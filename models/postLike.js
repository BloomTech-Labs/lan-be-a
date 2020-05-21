const database = require('../database/dbConfig');

// Add entry for post like
const addPostLike = (userID, postID) => {
    return database('liked_posts').insert({ user_id: userID, post_id: postID });
};

// Fetch user's liked posts
// Should this be in the user model?
const fetchUsersLikedPosts = userID => {
    return database('liked_posts').where({ user_id: userID });
};

// Remove entry for post like
const removePostLike = (userID, postID) => {
    return database('liked_posts').where({ user_id: userID, post_id: postID }).del();
};

module.exports = {
    add,
    find,
    fetch,
    update,
    remove
};