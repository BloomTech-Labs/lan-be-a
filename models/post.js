const database = require('../database/dbConfig');

// Create post
const create = post => {
    return database('posts').insert(post);
};

// Add entry for post like
const addPostLike = (userID, postID) => {
    return database('liked_posts').insert({ user_id: userID, post_id: postID });
};

// Fetch individual post
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

// Fetch all posts
// This is where search and sorting will occur
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

const incrementCommentCount = postID => {
    return database('posts').where('id', postID).increment('comments', 1);
};

const decrementCommentCount = postID => {
    return database('posts').where('id', postID).decrement('comments', 1);
};

// Remove entry for post like
const removePostLike = (userID, postID) => {
    return database('liked_posts').where({ user_id: userID, post_id: postID }).del();
};

module.exports = {
    create,
	addPostLike,
	fetch,
    fetchAll,
	incrementCommentCount,
	decrementCommentCount,
	removePostLike,
};