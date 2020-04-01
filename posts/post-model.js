const database = require('../data/config');

const create = post => {
    return database('posts').insert(post);
};

const fetch = () => {
    return database('posts');
};

module.exports = {
    create,
    fetch
};