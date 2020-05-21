const express = require('express');
const Post = require('../models/post');
const Comment = require('../models/comment');

const app = express.Router();

// Add a comment to a post
app.post('/', (request, response) => {
    userID = request.user.id;
    postID = request.body.postID;
    comment = request.body.comment;
    
    Post.incrementCommentCount(postID)
        .then(res => {
            Comment.add(userID, postID, comment)
                .then(r => response.status(200).json({ message: 'Added comment successfully', comment: r[0] }))
        })
        .catch(err => {
            console.log(err);
            response.status(500).json({ message: 'Error incrementing comment count on post' });
        });
});

// Update a comment on a post
// Does timestamp update automatically?

// Remove a comment from a post

module.exports = app;