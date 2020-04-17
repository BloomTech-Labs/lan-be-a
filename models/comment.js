const database = require('../database/dbConfig');

const add = (userID, postID, comment) => {
    return database('comments').insert({ user_id: userID, post_id: postID, comment: comment }).returning('*');
};

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
        'comments.thumbs_up',
        'comments.created_at',
        'comments.updated_at'
    ]);
};

const increment = postID => {
    return database('posts').where('id', postID).increment('comments', 1);
};

module.exports = {
    fetch,
    add,
    increment
};