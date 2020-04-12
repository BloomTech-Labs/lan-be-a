const express = require('express');
const PostLike = require('../models/postLike');

const app = express.Router();

app.get('/:id', (request, response) => {
    PostLike.find(request.params.id)
        .then(likes => {
            console.log(likes, likes.likes, likes.likes + 1, 'first layer');
            PostLike.update(request.params.id, likes.likes + 1)
                .then(res => {
                    console.log('second layer');
                    PostLike.add(request.user.id, request.params.id)
                        .then(r => response.status(200).json({ message: 'post liked successfully' }))
                })
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({ message: 'error liking post' });
        });
});

module.exports = app;