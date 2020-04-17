const express = require('express');
const Comment = require('../models/comment');

const app = express.Router();

app.post('/', (request, response) => {
    userID = request.user.id;
    postID = request.body.postID;
    comment = request.body.comment;
    
    Comment.increment(postID)
        .then(res => {
            Comment.add(userID, postID, comment)
                .then(r => response.status(200).json({ message: 'Added comment successfully', comment: r[0] }))
        })
        .catch(err => {
            console.log(err);
            response.status(500).json({ message: 'Error incrementing comment count on post' });
        });
});

module.exports = app;