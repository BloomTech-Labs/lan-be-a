const database = require('../database/dbConfig');

// Fetch posts, comments, users, rooms based on search input
const getFullSearchResults = async (search) => {
  const posts = await database('posts')
    .whereRaw('LOWER(posts.title) LIKE ?', [`%${search}%`])
    .orWhereRaw('LOWER(posts.description) LIKE ?', [`%${search}%`])
    .where('posts.visible', 1);
  const comments = await database('comments')
    .whereRaw('LOWER(comments.comment) LIKE ?', [`%${search}%`])
    .where('comments.visible', 1);
  const users = await database('users')
    .whereRaw('LOWER(users.email) LIKE ?', [`%${search}%`])
    .orWhereRaw('LOWER(users.display_name) LIKE ?', [`%${search}%`])
    .where('users.visible', 1);
  const rooms = await database('rooms')
    .whereRaw('LOWER(rooms.room_name) LIKE ?', [`%${search}%`])
    .orWhereRaw('LOWER(rooms.description) LIKE ?', [`%${search}%`]);
  return {
    users: users,
    rooms: rooms,
    posts: posts,
    comments: comments,
  };
};

// Fetch posts based on search input
const getPostSearchResults = (search) => {
  return database('posts')
    .whereRaw('LOWER(posts.title) LIKE ?', [`%${search}%`])
    .orWhereRaw('LOWER(posts.description) LIKE ?', [`%${search}%`])
    .andWhere('posts.visible', 1);
};

// Fetch comments based on search input
const getCommentSearchResults = (search) => {
  return database('comments')
    .whereRaw('LOWER(comments.title) LIKE ?', [`%${search}%`])
    .orWhereRaw('LOWER(comments.description) LIKE ?', [`%${search}%`])
    .andWhere('comments.visible', 1);
};

// Fetch users based on search input
const getUserSearchResults = (search) => {
  return database('users')
    .whereRaw('LOWER(users.email) LIKE ?', [`%${search}%`])
    .orWhereRaw('LOWER(users.display_name) LIKE ?', [`%${search}%`])
    .andWhere('users.visible', 1);
};

// Fetch rooms based on search input
const getRoomSearchResults = (search) => {
  return database('rooms')
    .whereRaw('LOWER(rooms.room_name) LIKE ?', [`%${search}%`])
    .orWhereRaw('LOWER(rooms.description) LIKE ?', [`%${search}%`]);
};

// Fetch posts in a room based on user search input
const getPostSearchResultsByRoom = (search, room_id) => {
  return database('posts')
    .join('rooms_to_posts', 'posts.id', 'rooms_to_posts.post_id')
    .whereRaw('LOWER(posts.title) LIKE ?', [`%${search}%`])
    .orWhereRaw('LOWER(posts.description) LIKE ?', [`%${search}%`])
    .where('rooms_to_posts.room_id', room_id)
    .andWhere('posts.visible', 1);
};

// Fetch posts in a room based on user search input
const getCommentSearchResultsByPost = (search, post_id) => {
  return database('comments')
    .whereRaw('LOWER(comments.comment) LIKE ?', [`%${search}%`])
    .where('comments.post_id', post_id )
    .andWhere('p.visible', 1);
};

module.exports = {
  getFullSearchResults,
  getPostSearchResults,
  getCommentSearchResults,
  getUserSearchResults,
  getRoomSearchResults,
  getPostSearchResultsByRoom,
  getCommentSearchResultsByPost
};