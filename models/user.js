const database = require('../database/dbConfig');

const add = (user) => {
  return database('users').insert(user).returning('*');
};

const find = (filter) => {
  return database('users').where(filter).first();
};

// Fetch all of a single user's posts
const fetchPosts = (userID) => {
  return database('posts').where('user_id', userID);
};

// Can we mix these two? Should we?

// Fetch all of a single user's comments
const fetchComments = (userID) => {
  return database('comments').where('user_id', userID);
};

// Fetch user's liked posts
const fetchUsersLikedPosts = (userID) => {
  return database('liked_posts').where('user_id', userID);
};

// Fetch user's liked comments
const fetchUsersLikedComments = (userID) => {
  return database('liked_comments').where('user_id', userID);
};

const update = (id, value) => {
  return database('users').where('id', id).update(value).returning('*');
};

// Set a user's onboarded field to true
const onboard = (userID) => {
  return database('users')
    .where('id', userID)
    .update('onboarded', 'true')
    .returning('*');
};

//remove a specific user with the userID passed in req param
const remove = (userID) => {
  return database('users').where('id', userID).del();
};

module.exports = {
  add,
  find,
  fetchPosts,
  fetchComments,
  fetchUsersLikedPosts,
  fetchUsersLikedComments,
  update,
  onboard,
  remove,
};
