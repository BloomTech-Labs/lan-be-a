const database = require('../database/dbConfig');

const add = user => {
    return database('users').insert(user).returning('*');
};

const find = filter => {
    return database('users').where(filter).first();
};

const update = (id, track) => {
    return database('users').where({ id }).update({ track }).returning('*');
};

module.exports = {
    add,
    find,
    update
};