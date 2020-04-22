const express = require('express');
const CommentLike = require('../models/commentLike');

const app = express.Router();

app.get('/', (request, response) => {
    const userID = request.user.id;

    CommentLike.fetch(userID)
        .then(res => response.status(200).json(res))
        .catch(err => {
            console.log(error);
            response.status(500).json({ message: 'Error fetching user\'s liked comments' });
        });
});

app.get('/:id', (request, response) => {
    userID = request.user.id;
    commentID = Number(request.params.id);

    CommentLike.increment(commentID)
        .then(res => {
            CommentLike.add(userID, commentID)
                .then(r => response.status(200).json({ message: 'Liked comment successfully' }))
                .catch(e => console.log(e));
        })
        .catch(err => {
            console.log(error);
            response.status(200).json({ message: 'Error incrementing comment likes' });
        })
});

app.delete('/:id', (request, response) => {
    userID = request.user.id;
    commentID = Number(request.params.id);

    CommentLike.decrement(commentID)
        .then(res => {
            CommentLike.remove(userID, commentID)
                .then(r => response.status(200).json({ message: 'Unliked comment successfully' }))
                .catch(e => console.log(e));
        })
        .catch(err => {
            console.log(error);
            response.status(200).json({ message: 'Error decrementing comment likes' });
        })
});

module.exports = app;