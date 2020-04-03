const express = require('express');
const User = require('../auth/auth-model');
const Post = require('./post-model');
const Comment = require('../comments/comment-model');

const app = express.Router();

// create post
app.post('/', (request, response) => {
    Post.create({
        user_id: request.user.id,
        question: request.body.question,
        answer: request.body.answer,
        track: request.body.track,
        category: request.body.category
    })
        .then(res => response.status(200).json({message: 'post created successfully'}))
        .catch(err => {
            console.log(err);
            response.status(500).json({message: 'error creating post'});
        });
});

// fetch all posts
app.get('/', (request, response) => {
    Post.fetchAll()
        .then(res => response.status(200).json(res))
        .catch(err => {
            console.log(err);
            response.status(500).json({message: 'error fetching posts'});
        });
});

// fetch post
app.post('/:id', (request, response) => {
	Post.fetch(request.params.id)
		.then(post => {
			Comment.fetch(request.params.id).then(comments =>
				response.status(200).json({
					...post,
					comments: comments
				})
			);
		})
		.catch(err => {
			console.log(err);
			response.status(500).json({ message: 'error fetching post' });
		});
});

module.exports = app;