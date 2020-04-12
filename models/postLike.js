const database = require('../database/dbConfig');

const add = (userID, postID) => {
    return database('liked_posts').insert({ user_id: userID, post_id: postID });
};

// Find the number of likes for a single post
const find = postID => {
    return database('posts').where({ id: postID }).select('likes').first();
};

// Fetch user's liked posts
const fetch = userID => {
    return database('liked_posts').where({ user_id: userID });
};

const update = (postID, likes) => {
    return database('posts').where({ id: postID }).update({ likes: likes });
};

const remove = (userID, postID) => {
    return database('liked_posts').where({ user_id: userID, post_id: postID }).del();
};

module.exports = {
    add,
    find,
    fetch,
    update,
    remove
};