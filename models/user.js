const database = require('../database/dbConfig');

const add = user => {
    return database('users').insert(user).returning('*');
};

const find = filter => {
    return database('users').where(filter).first();
};

const update = (id, value) => {
    return database('users').where('id', id).update(value).returning('*');
};

// Fetch all of a single user's posts
const fetchPosts = userID => {
    return database('posts').where('user_id', userID);
};

// Can we mix these two? Should we?

// Fetch all of a single user's comments
const fetchComments = userID => {
    return database('comments').where('user_id', userID);
};

// Fetch user's liked posts
const fetchUsersLikedPosts = userID => {
    return database('liked_posts').where('user_id', userID);
};

// Fetch user's liked comments
const fetchUsersLikedComments = userID => {
    return database('liked_comments').where('user_id', userID);
};

module.exports = {
    add,
    find,
    update,
    fetchPosts,
    fetchComments,
    fetchUsersLikedPosts,
    fetchUsersLikedComments
};