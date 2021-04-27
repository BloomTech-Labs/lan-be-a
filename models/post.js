const database = require('../database/dbConfig');


// Create post
const createPost = (post) => {
  return database('posts').insert(post).returning('id');
};

// Delete post
const deletePost = (postID) => {
  return database('posts').where({id: postID}).update('visible', false);
};

// Create an entry of a post in the room_to_posts table
const createRoomPostEntry = (post_id, room_id) => {
  return database('rooms_to_posts').insert({ post_id, room_id });
};

// Get post like
const findPostLike = (user_id, post_id) => {
  return database('liked_posts')
    .where('user_id', user_id)
    .where('post_id', post_id)
    .first();
};

// Add like to a post
const addPostLike = (userID, postID) => {
  return database('liked_posts').insert({ user_id: userID, post_id: postID });
};


// Add 1 to post likes column
const incrementPostLikes = postID => {
  return database('posts').where('id', postID).increment('likes', 1);
};

// Remove entry for post like
const removePostLike = (userID, postID) => {
  return database('liked_posts').where({ user_id: userID, post_id: postID }).del();
};

// Remove 1 from post likes column
const decrementPostLikes = postID => {
  return database('posts').where('id', postID).decrement('likes', 1);
};

// Add 1 to posts' comments colu,m
const incrementCommentCount = postID => {
  return database('posts').where('id', postID).increment('comments', 1);
};
  
  
// Remove 1 from posts' comments column
const decrementCommentCount = postID => {
  return database('posts').where('id', postID).decrement('comments', 1);
};

// Fetch individual post
const fetch = postID => {
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
      'posts.updated_at'
    ])
    .first();
};

// Fetch all posts ordered by most recent
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
      'posts.updated_at'
    ]);
};
// fetch 10 most recent post with most likes
const fetchRecentLiked = () => {
  return database('posts')
    .join('users', 'posts.user_id', 'users.id')
    .orderBy([{ column: 'posts.created_at', order: 'desc' }, { column: 'posts.likes', order: 'desc' }])
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
      'posts.updated_at'
    ])
    .limit(10);
};
// Fetch all posts ordered by most likes
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
      'posts.updated_at'
    ]);
};

// Fetch posts based on user search input
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
      'posts.updated_at'
    ]);
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
  deletePost,
  createRoomPostEntry,
  findPostLike,
  addPostLike,
  incrementPostLikes,
  removePostLike,
  decrementPostLikes,
  incrementCommentCount,
  decrementCommentCount,
  fetch,
  fetchRecent,
  fetchPopular,
  fetchSearch,
  postUpdate,
  fetchRecentLiked
};

