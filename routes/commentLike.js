const express = require('express');
const Comment = require('../models/comment');

const app = express.Router();

// Fetch a user's liked comments
app.get('/', (request, response) => {
    const userID = request.user.id;

    Comment.fetchUsersLikedComments(userID)
        .then(res => response.status(200).json(res))
        .catch(err => {
            console.log(error);
            response.status(500).json({ message: 'Error fetching user\'s liked comments' });
        });
});

// User likes a comment
app.get('/:id', (request, response) => {
    userID = request.user.id;
    commentID = Number(request.params.id);

    Comment.incrementCommentLikes(commentID)
        .then(res => {
            Comment.addCommentLike(userID, commentID)
                .then(r => response.status(200).json({ message: 'Liked comment successfully' }))
                .catch(e => {
                    console.log(e);
                    response.status(500).json({ message: 'Error adding comment like' });
                });
        })
        .catch(err => {
            console.log(error);
            response.status(500).json({ message: 'Error incrementing comment likes' });
        })
});

// User unlikes a comment
app.delete('/:id', (request, response) => {
    userID = request.user.id;
    commentID = Number(request.params.id);

    Comment.decrementCommentLikes(commentID)
        .then(res => {
            Comment.removeCommentLike(userID, commentID)
                .then(r => response.status(200).json({ message: 'Unliked comment successfully' }))
                .catch(e => {
                    console.log(e);
                    response.status(500).json({ message: 'Error removing comment like' });
                });
        })
        .catch(err => {
            console.log(error);
            response.status(500).json({ message: 'Error decrementing comment likes' });
        })
});

module.exports = app;