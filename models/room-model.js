// eslint-disable-next-line no-unused-vars
const { count } = require('../database/dbConfig');
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

// Fetch a room by filter
const getRoomBy = filter => {
  return database('rooms').where(filter).first();
};

// Fetch all posts in a room ordered by most recent
const fetchRecentByRoomId = async (room_id, page, limit) => {
  const posts = await database('posts as p')
    .join('users as u', 'p.user_id', 'u.id')
    .join('rooms_to_posts as rtp', 'p.id', 'rtp.post_id')
    .orderBy('p.created_at', 'desc')
    .limit(limit)
    .offset((page - 1) * limit)
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
  const count = await database('posts as p')
    .join('users as u', 'p.user_id', 'u.id')
    .join('rooms_to_posts as rtp', 'p.id', 'rtp.post_id')
    .where('rtp.room_id', room_id)
    .andWhere('p.visible', 1)
    .count('p.id');
  return {
    posts: posts,
    totalPages: (Math.ceil(count[0].count / limit))
  };
};

// Fetch all posts in a room ordered by likes
const fetchPopularByRoomId = async (room_id, page, limit) => {
  const posts = await database('posts as p')
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
    .limit(limit)
    .offset((page - 1) * limit)
    .where('rtp.room_id', room_id)
    .andWhere('p.visible', 1);
  const count = await database('posts as p')
    .join('users as u', 'p.user_id', 'u.id')
    .join('rooms_to_posts as rtp', 'p.id', 'rtp.post_id')
    .where('rtp.room_id', room_id)
    .andWhere('p.visible', 1)
    .count('p.id');
  return {
    posts: posts,
    totalPages: (Math.ceil(count[0].count / limit))
  };
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
    .where('rtp.room_id', room_id)
    .andWhere('p.visible', 1);
};

module.exports = {
  add,
  remove,
  getAllRooms,
  getRoomBy,
  fetchRecentByRoomId,
  fetchPopularByRoomId,
  searchWithRoomId
};
