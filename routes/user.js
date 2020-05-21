const express = require('express');
const User = require('../models/user');

const app = express.Router();

// Fetch all of user's posts and comments
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

// Update display name
app.put('/', (request, response) => {
    const { userID, displayName } = request.body;

    User.updateDisplayName(userID, displayName)
        .then(res => response.status(200).json({ message: 'Updated user\'s display name successfully' }))
        .catch(err => response.status(500).json({ message: 'Error updating user\'s display name' }));
});

module.exports = app;