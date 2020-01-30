const database = require('../data/config');

// register
const register = user => {
    return database('users').insert(user);
};

// log in
const login = user => {

};

// log out

module.exports = {
    register
};