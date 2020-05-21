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

// Former post like model helper functions
const incrementCommentCount = postID => {
    return database('posts').where('id', postID).increment('comments', 1);
};

const decrementCommentCount = postID => {
    return database('posts').where('id', postID).decrement('comments', 1);
};

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
    create,
    fetchAll,
	fetch,
	
	incrementCommentCount,
	decrementCommentCount,
	addPostLike,
	fetchUsersLikedPosts,
	removePostLike
};