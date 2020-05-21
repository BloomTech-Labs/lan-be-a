const database = require('../database/dbConfig');

// Add comment
const add = (userID, postID, comment) => {
    return database('comments').insert({ user_id: userID, post_id: postID, comment: comment }).returning('*');
};

// Fetch post comments
// Should this be in post model?
const fetch = postID => {
    return database('comments')
    .join('users', 'comments.user_id', 'users.id')
    .where('post_id', postID)
    .select([
        'comments.id',
        'comments.user_id',
        'users.display_name',
        'users.profile_picture',
        'users.track',
        'comments.post_id',
        'comments.comment',
        'comments.likes',
        'comments.created_at',
        'comments.updated_at'
    ]);
};

// Former comment like helper functions
const addCommentLike = (userID, commentID) => {
    return database('liked_comments').insert({ user_id: userID, comment_id: commentID });
};

const incrementCommentLikes = commentID => {
    return database('comments').where('id', commentID).increment('likes', 1);
};

const decrementCommentLikes = commentID => {
    return database('comments').where('id', commentID).decrement('likes', 1);
};

const removeCommentLike = (userID, commentID) => {
    return database('liked_comments').where({ user_id: userID, comment_id: commentID }).del();
};

module.exports = {
    add,
    fetch,

    addCommentLike,
    incrementCommentLikes,
    decrementCommentLikes,
    removeCommentLike
};