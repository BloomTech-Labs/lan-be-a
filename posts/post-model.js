const database = require('../data/config');

const create = post => {
    return database('posts').insert(post);
};

const fetch = () => {
    return database('posts')
        .join('users', 'posts.user_id', 'users.id')
        .select([
            'posts.id',
            'users.id as user_id',
            'users.profile_picture',
            'users.display_name',
            'posts.track',
            'posts.category',
            'posts.question',
            'posts.answer',
            'posts.likes',
            'posts.comments',
            'posts.created_at',
            'posts.updated_at'
        ]);
};

module.exports = {
    create,
    fetch
};