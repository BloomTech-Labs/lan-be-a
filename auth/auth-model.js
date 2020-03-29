const database = require('../data/config');

const add = user => {
    return database('users').insert(user).returning('*');
};

const find = filter => {
    return database('users').where(filter).first();
};

module.exports = {
    add,
    find
};