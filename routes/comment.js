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

// Each of the two endpoints below do two things: update the like field on the comments table for a give comment ID
// AND creates an entry in the liked_comments table given a user ID and comment ID

// Like comment
// We need this in order to keep track of what comments a user has liked
app.get('/like/:id', (request, response) => {
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

// Unlike comment
// There is no 'downvote' feature, only 'upvote', therefore this just undoes what the endpoint above does
app.delete('/like/:id', (request, response) => {
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