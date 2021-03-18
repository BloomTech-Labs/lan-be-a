const db = require('../database/dbConfig');

// Add a moderator to a room
const addRoomModerator = async (user_id, room_id) => {
  await db('room_to_moderator').insert({ user_id, room_id });
  return db('room_to_moderator as rtm')
    .where('rtm.user_id', user_id)
    .where('rtm.room_id', room_id)
    .join('users as u', 'rtm.user_id', 'u.id')
    .join('rooms as r', 'rtm.room_id', 'r.id')
    .returning('*')
    .first();
};

// Find all rooms and all added moderators
const findRoomModerator = () => {
  return db('room_to_moderator as rtm')
    .join('users as u', 'rtm.user_id', 'u.id')
    .join('rooms as r', 'rtm.room_id', 'r.id')
    .returning('*')
    .orderBy('room_id');
};
  
// Find all rooms or users assigned by room_id or user_id, or a single room by both
const findRoomModeratorBy = filter => {
  const { user_id, room_id } = filter;
  
  if (user_id && !room_id) {
    return db('room_to_moderator as rtm')
      .where('user_id', user_id)
      .join('users as u', 'rtm.user_id', 'u.id')
      .join('rooms as r', 'rtm.room_id', 'r.id')
      .returning('*')
      .orderBy('room_id');
  } else if (room_id && !user_id) {
    return db('room_to_moderator as rtm')
      .where('room_id', room_id)
      .join('users as u', 'rtm.user_id', 'u.id')
      .join('rooms as r', 'rtm.room_id', 'r.id')
      .returning('*')
      .orderBy('room_id');
  } else {
    return db('room_to_moderator as rtm')
      .where('user_id', user_id)
      .where('room_id', room_id)
      .join('users as u', 'rtm.user_id', 'u.id')
      .join('rooms as r', 'rtm.room_id', 'r.id')
      .returning('*')
      .orderBy('room_id');
  }
};
  
// Remove a moderator from a room
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
