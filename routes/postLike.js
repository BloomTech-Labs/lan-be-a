const express = require('express');
const PostLike = require('../models/postLike');

const app = express.Router();

app.get('/', (request, response)  => {
    const userID = request.user.id;

    PostLike.fetch(userID)
        .then(res => response.status(200).json(res))
        .catch(err => {
            console.log(err);
            response.status(500).json({ message: 'Error fetching user\'s liked posts' })
        });
});

// Like
app.get('/:id', (request, response) => {
    const userID = request.user.id;
    const postID = request.params.id;

    PostLike.find(postID)
        .then(likes => {
            PostLike.update(postID, likes.likes + 1)
                .then(res => {
                    PostLike.add(userID, postID)
                        .then(r => response.status(200).json({ message: 'Post liked successfully' }))
                })
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({ message: 'Error liking post' });
        });
});

// Unlike
app.delete('/:id', (request, response) => {
    const userID = request.user.id;
    const postID = request.params.id;

    PostLike.find(postID)
        .then(likes => {
            PostLike.update(postID, likes.likes - 1)
                .then(res => {
                    PostLike.remove(userID, postID)
                        .then(r => response.status(200).json({ message: 'Post unliked successfully' }))
                })
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({ message: 'Error liking post' });
        });
});

module.exports = app;