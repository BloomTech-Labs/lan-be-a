const database = require('../database/dbConfig');

// Fetch single user based on ID
const fetchUser = (user_id) => {
  return database('users').where('id', user_id).first();
};

// Get all users ordered by display name
const getUsers = () => {
  return database('users').orderBy('display_name');
};

// Delete user
const userDelete = (user_id) => {
  return database('users').where('id', user_id).del();
};

// Update a users role
const userSetRole = async (user_id, role_id) => {
  return database('users').where('id', user_id).update({ role_id });
};

// Get all rooms
const getRooms = () => {
  return database('rooms').orderBy('room_name');
};

// Update a room
const roomUpdate = (room_id, payload) => {
  return database('rooms').where('id', room_id).update({ id: room_id, room_name: payload.room_name, description: payload.description }).returning('*');
};

// Create a new role
const roleCreate = (role) => {
  return database('roles').insert(role).returning('*');
};

// Update an existing role
const roleUpdate = (role_id, new_role_name) => {
  return database('roles')
    .where('id', role_id)
    .update({ id: role_id, role: new_role_name })
    .returning('*');
};

// Delete a role
const roleDelete = (role_id) => {
  return database('roles').where('id', role_id).del();
};

module.exports = {
  fetchUser,
  getUsers,
  userDelete,
  userSetRole,
  getRooms,
  roomUpdate,
  roleCreate,
  roleUpdate,
  roleDelete,
};
