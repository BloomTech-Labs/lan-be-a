const database = require('../data/config');

const fetchPosts = () => {
    return database('posts');
};

const createPost = post => {
    return database('posts').insert(post);
};

module.exports = {
    fetchPosts,
    createPost
};