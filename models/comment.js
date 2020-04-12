const database = require('../data/config');

const fetch = postID => {
    return database('comments').where('post_id', postID);
};

module.exports = {
    fetch
};