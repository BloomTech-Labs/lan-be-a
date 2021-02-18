const database = require('../database/dbConfig');

//helper to get all the rooms
const getAllRooms = () => {
  return database('rooms');
};

//helper to add a room to the db
const add = (room) => {
  return database('rooms').insert(room).returning('*');
};

//helper to remove a room from the db
const remove = (roomId) => {
  return database('rooms').where('id', roomId).del();
};

// Fetch all posts
// This is where search and sorting will occur
const fetchRecentByRoomId = (room_id) => {
  return database('posts as p')
    .join('users as u', 'p.user_id', 'u.id')
    .join('rooms_to_posts as rtp', 'p.id', 'rtp.post_id')
    .orderBy('p.created_at', 'desc')
    .select([
      'p.id',
      'u.id as user_id',
      'u.profile_picture',
      'u.display_name',
      'p.title',
      'p.description',
      'p.likes',
      'p.comments',
      'p.created_at',
      'p.updated_at',
    ])
    .where('rtp.room_id', room_id);
};

// Fetch all posts based on popularity
const fetchPopularByRoomId = (room_id) => {
  return database('posts as p')
    .join('users as u', 'p.user_id', 'u.id')
    .join('rooms_to_posts as rtp', 'p.id', 'rtp.post_id')
    .orderBy('p.likes', 'desc')
    .select([
      'p.id',
      'u.id as user_id',
      'u.profile_picture',
      'u.display_name',
      'p.title',
      'p.description',
      'p.likes',
      'p.comments',
      'p.created_at',
      'p.updated_at',
    ])
    .where('rtp.room_id', room_id);
};

// Fetch based on search terms
const searchWithRoomId = (room_id, search) => {
  return database('posts as p')
    .join('users as u', 'p.user_id', 'u.id')
    .join('rooms_to_posts as rtp', 'p.id', 'rtp.post_id')
    .whereRaw('LOWER(p.title) LIKE ?', [`%${search}%`])
    .orWhereRaw('LOWER(p.description) LIKE ?', [`%${search}%`])
    .select([
      'p.id',
      'u.id as user_id',
      'u.profile_picture',
      'u.display_name',
      'p.title',
      'p.description',
      'p.likes',
      'p.comments',
      'p.created_at',
      'p.updated_at',
    ])
    .where('rtp.room_id', room_id);
};

module.exports = {
  getAllRooms,
  add,
  remove,
  fetchRecentByRoomId,
  fetchPopularByRoomId,
  searchWithRoomId,
};
