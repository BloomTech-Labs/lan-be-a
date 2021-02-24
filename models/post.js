const database = require('../database/dbConfig');

// Create post
const createPost = (post) => {
  return database('posts').insert(post).returning('id');
};

const createRoomPostEntry = (post_id, room_id) => {
  return database('rooms_to_posts').insert({ post_id, room_id });
};

// Add entry for post like
const addPostLike = (userID, postID) => {
  return database('liked_posts').insert({ user_id: userID, post_id: postID });
};

// Fetch individual post
const fetch = (postID) => {
  return database('posts')
    .join('users', 'posts.user_id', 'users.id')
    .where('posts.id', postID)
    .select([
      'posts.id',
      'users.id as user_id',
      'users.profile_picture',
      'users.display_name',
      'posts.title',
      'posts.description',
      'posts.likes',
      'posts.comments',
      'posts.created_at',
      'posts.updated_at',
    ])
    .first();
};

// Fetch all posts
// This is where search and sorting will occur
const fetchRecent = () => {
  return database('posts')
    .join('users', 'posts.user_id', 'users.id')
    .orderBy('posts.created_at', 'desc')
    .select([
      'posts.id',
      'users.id as user_id',
      'users.profile_picture',
      'users.display_name',
      'posts.title',
      'posts.description',
      'posts.likes',
      'posts.comments',
      'posts.created_at',
      'posts.updated_at',
    ]);
};

// Fetch all posts based on popularity
const fetchPopular = () => {
  return database('posts')
    .join('users', 'posts.user_id', 'users.id')
    .orderBy('posts.likes', 'desc')
    .select([
      'posts.id',
      'users.id as user_id',
      'users.profile_picture',
      'users.display_name',
      'posts.title',
      'posts.description',
      'posts.likes',
      'posts.comments',
      'posts.created_at',
      'posts.updated_at',
    ]);
};

const fetchSearch = (search) => {
  return database('posts')
    .join('users', 'posts.user_id', 'users.id')
    .whereRaw('LOWER(posts.title) LIKE ?', [`%${search}%`])
    .orWhereRaw('LOWER(posts.description) LIKE ?', [`%${search}%`])
    .select([
      'posts.id',
      'users.id as user_id',
      'users.profile_picture',
      'users.display_name',
      'posts.title',
      'posts.description',
      'posts.likes',
      'posts.comments',
      'posts.created_at',
      'posts.updated_at',
    ]);
};

const incrementPostLikes = (postID) => {
  return database('posts').where('id', postID).increment('likes', 1);
};

const decrementPostLikes = (postID) => {
  return database('posts').where('id', postID).decrement('likes', 1);
};

const incrementCommentCount = (postID) => {
  return database('posts').where('id', postID).increment('comments', 1);
};

const decrementCommentCount = (postID) => {
  return database('posts').where('id', postID).decrement('comments', 1);
};

// Remove entry for post like
const removePostLike = (userID, postID) => {
  return database('liked_posts')
    .where({ user_id: userID, post_id: postID })
    .del();
};

//helper for updating a post with given postID and newDescription
const postUpdate = (postID, newDescription) => {
  return database('posts')
    .where('id', postID)
    .update({ description: newDescription })
    .returning('*');
};
module.exports = {
  createPost,
  createRoomPostEntry,
  addPostLike,
  fetch,
  fetchRecent,
  fetchPopular,
  fetchSearch,
  incrementPostLikes,
  decrementPostLikes,
  incrementCommentCount,
  decrementCommentCount,
  removePostLike,
  postUpdate,
};
