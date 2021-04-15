const database = require('../database/dbConfig');

//Gets all of the rooms liked by a user
const fetchFollowedRooms = (userID) => {
    return database('my_rooms').where('user_id', userID);
};