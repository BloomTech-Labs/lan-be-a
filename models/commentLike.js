const database = require('../database/dbConfig');

const add = (userID, commentID) => {
    return database('liked_comments').insert({ user_id: userID, comment_id: commentID });
};

const fetch = userID => {
    return database('liked_comments').where('user_id', userID);
};

const increment = commentID => {
    return database('comments').where('id', commentID).increment('likes', 1);
};

const decrement = commentID => {
    return database('comments').where('id', commentID).decrement('likes', 1);
};

const remove = (userID, commentID) => {
    return database('liked_comments').where({ user_id: userID, comment_id: commentID }).del();
};

module.exports = {
    add,
    fetch,
    increment,
    decrement,
    remove
};