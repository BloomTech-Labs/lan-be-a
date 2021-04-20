const database = require('../database/dbConfig');

//Gets all of the rooms liked by a user
const fetchFollowedRooms = (filter) => {
    return database('my_room').where(filter);
};

// adds a room to a users 'my rooms'
const add = (roomID, userID) => {
    // TODO: handle the case where a user has already liked a room
    return database('my_room').insert({
        room_id: roomID,
        user_id: userID
    }).returning('*');
}

// removes a room from a users 'my rooms'
const remove = (roomID, userID) => {
    return database('my_room')
    .where({
        room_id: roomID,
        user_id: userID
    })
    .del();
};

module.exports = {
    fetchFollowedRooms,
    add,
    remove
};