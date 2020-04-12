const database = require('../database/dbConfig');

const create = post => {
    return database('posts').insert(post);
};

const fetchAll = search => {
	return database('posts')
		.join('users', 'posts.user_id', 'users.id')
		.whereRaw(`LOWER(posts.question) LIKE ?`, [`%${search}%`])
		// .where('posts.track', 'like', `%${track}%`)
		// .where('posts.category', 'like', `%${category}%`)
		// .orderBy('posts.created_at', 'desc')
		// .orderBy('post.likes')
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

const fetch = postID => {
    return database('posts')
		.join('users', 'posts.user_id', 'users.id')
		.where('posts.id', postID)
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
		])
		.first();
};

module.exports = {
    create,
    fetchAll,
    fetch
};