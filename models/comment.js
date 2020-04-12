const database = require('../database/dbConfig');

const fetch = postID => {
    return database('comments').where('post_id', postID);
};

module.exports = {
    fetch
};