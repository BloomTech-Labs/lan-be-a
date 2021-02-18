const database = require('../database/dbConfig');

const getUsers = () => {
  return database('users');
};

const getRooms = () => {
  return database('rooms');
};

const fetchUser = (user_id) => {
    return database('users').where('id', user_id).first();
  };

const userSetRole = async (user_id, role_id) => {
  const oldUser = await fetchUser(user_id);
  return database('users')
  .where('id', user_id)
  .update({ ...oldUser, role_id });
};
const userDelete = (user_id) => {
    return database('users').where('id', user_id).del();
};
const roleCreate = (role) => {
    return database('roles').insert(role).returning('*');
};
const roleUpdate = (role_id, new_role_name) => {
  return database('roles').where('id', role_id).update({id: role_id, role: new_role_name}).returning('*');
};
const roleDelete = (role_id) => {
  return database('roles').where('id', role_id).del();
};

module.exports = {
  userSetRole,
  userDelete,
  roleCreate,
  roleUpdate,
  roleDelete,
  getUsers,
  getRooms
};
