const database = require('../database/dbConfig');

// Create a room
const add = (room) => {
  return database('rooms').insert(room).returning('*');
};

// Delete a room
const remove = (roomId) => {
  return database('rooms').where('id', roomId).del();
};

// Fetch all rooms
const getAllRooms = () => {
  return database('rooms').orderBy('room_name');
};

// Fetch all posts in a room ordered by most recent
const fetchRecentByRoomId = (room_id) => {
  return database('posts as p')
    .join('users as u', 'p.user_id', 'u.id')
    .join('rooms_to_posts as rtp', 'p.id', 'rtp.post_id')
    .orderBy('p.created_at', 'desc')
    .select([
      'p.id',
      'p.visible',
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
    .where('rtp.room_id', room_id)
    .andWhere('p.visible', 1);
};

// Fetch all posts in a room ordered by likes
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
    .where({['rtp.room_id']: room_id, ['p.visible']: true });
};

// Fetch posts in a room based on user search input
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
    .where({['rtp.room_id']: room_id, ['p.visible']: true});
};

module.exports = {
  add,
  remove,
  getAllRooms,
  fetchRecentByRoomId,
  fetchPopularByRoomId,
  searchWithRoomId,
};
