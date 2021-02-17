const database = require('../database/dbConfig');

const getUsers = () => {
  return database('users');
};

const getRooms = () => {
  return database('rooms');
};

module.exports = {
  getUsers,
  getRooms
};
