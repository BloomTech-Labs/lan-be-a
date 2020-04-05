const database = require('../data/config');

// find the number of likes for a single post
const find = postID => {
    return database('posts').where({ id: postID }).select('likes').first();
};

const update = (postID, likes) => {
    return database('posts').where({ id: postID }).update({ likes: likes });
};

const add = (userID, postID) => {
    return database('liked_posts').insert({ user_id: userID, post_id: postID });
};

module.exports = {
    find,
    update,
    add
};