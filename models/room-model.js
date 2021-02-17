const database = require('../database/dbConfig');

//helper to add a room to the db
const add = (room) => {
  return database('rooms').insert(room).returning('*');
};

//helper to remove a room from the db
const remove = (roomId) => {
  return database('rooms').where('id', roomId).del();
};

module.exports = {
  add,
  remove,
};
