const express = require('express');
const User = require('../models/user');
const Post = require('../models/post');

const app = express.Router();

// Fetch user's liked posts
app.get('/', (request, response)  => {
    const userID = request.user.id;

    User.fetchUsersLikedPosts(userID)
        .then(res => response.status(200).json(res))
        .catch(err => {
            console.log(err);
            response.status(500).json({ message: 'Error fetching user\'s liked posts' })
        });
});

// Like post
app.get('/:id', (request, response) => {
    const userID = request.user.id;
    const postID = request.params.id;

    Post.incrementCommentCount(postID)
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
app.delete('/:id', (request, response) => {
    const userID = request.user.id;
    const postID = request.params.id;

    Post.decrementCommentCount(postID)
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