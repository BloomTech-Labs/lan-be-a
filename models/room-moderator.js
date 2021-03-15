const db = require('../database/dbConfig');

// Add a moderator to a room
const addRoomModerator = (user_id, room_id) => {
  return db('room_to_moderator').insert({ user_id, room_id }).returning('*');
};
  
// Find all rooms and all added moderators
const findRoomModerator = () => {
  return db('room_to_moderator').orderBy('room_id');
};
  
// Find all rooms by room_id or user_id, or a single room by both
const findRoomModeratorBy = filter => {
  const { user_id, room_id } = filter;
  if (user_id && !room_id) {
    return db('room_to_moderator').where('user_id', user_id).orderBy('room_id');
  } else if (room_id && !user_id) {
    return db('room_to_moderator').where('room_id', room_id).orderBy('room_id');
  } else {
    return db('room_to_moderator')
      .where('user_id', user_id)
      .where('room_id', room_id)
      .orderBy('room_id');
  }
};
  
const removeRoomModerator = (user_id, room_id) => {
  return db('room_to_moderator')
    .where('user_id', user_id)
    .where('room_id', room_id)
    .del();
};

module.exports = {
  addRoomModerator,
  findRoomModerator,
  findRoomModeratorBy,
  removeRoomModerator
};