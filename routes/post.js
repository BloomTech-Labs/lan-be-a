const express = require('express');
const Post = require('../models/post');
const Comment = require('../models/comment');

const app = express.Router();

// Create post
app.post('/create', (request, response) => {
    const userID = request.user.id;
    const { question, answer, track, category } = request.body;
    
    Post.create({ user_id: userID, question, answer, track, category })
        .then(res => response.status(200).json({ message: 'Post created successfully' }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ message: 'Error creating post' });
        });
});

// Fetch single post
app.get('/:id', (request, response) => {
    const postID = request.params.id;

	Post.fetch(postID)
		.then(post => {
            Comment.fetch(postID)
                .then(comments => response.status(200).json({ ...post, comments }))
                .catch(e => {
                    console.log(e);
                    response.status(500).json({ message: 'Error fetching post\'s comments' });
                });
		})
		.catch(err => {
			console.log(err);
			response.status(500).json({ message: 'Error fetching post' });
		});
});

// Fetch all posts
// This is where search and sort will occur
app.post('/', (request, response) => {
    const search = request.body.search;
    
    Post.fetchAll(search)
        .then(res => response.status(200).json(res))
        .catch(err => {
            console.log(err);
            response.status(500).json({message: 'Error fetching posts'});
        });
});

// Like post
app.get('/like/:id', (request, response) => {
    const userID = request.user.id;
    const postID = request.params.id;

    Post.incrementPostLikes(postID)
        .then(res => {
            Post.addPostLike(userID, postID)
                .then(r => response.status(200).json({ message: 'Post liked successfully' }))
                .catch(e => {
                    console.log(e);
                    response.status(500).json({ message: 'Error adding post like' });
                });
        })
        .catch(err => {
            console.log(err);
            response.status(500).json({ message: 'Error incrementing post\'s comment count' });
        });
});

// Unlike post
app.delete('/like/:id', (request, response) => {
    const userID = request.user.id;
    const postID = request.params.id;

    Post.decrementPostLikes(postID)
        .then(res => {
            Post.removePostLike(userID, postID)
                .then(r => response.status(200).json({ message: 'Post unliked successfully' }))
                .catch(e => {
                    console.log(e);
                    response.status(500).json({ message: 'Error removing post like' });
                });
        })
        .catch(err => {
            console.log(err);
            response.status(500).json({ message: 'Error decrementing post\'s comment count' });
        });
});

module.exports = app;