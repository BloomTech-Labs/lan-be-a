const express = require('express');
const User = require('../models/user');

const app = express.Router();

app.get('/:id', (request, response) => {
    const userID = request.params.id;

    User.find({ id: userID })
        .then(user => {
            User.fetchPosts(userID)
                .then(posts => {
                    User.fetchComments(userID)
                        .then(comments => response.status(200).json({ ...user, posts, comments }))
                })
        })
        .catch(err => {
            console.log(err);
            response.status(500).json({ message: 'Error fetching user' });
        });
});

module.exports = app;