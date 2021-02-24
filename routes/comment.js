const express = require('express');
const Post = require('../models/post');
const Comment = require('../models/comment');
const { response } = require('express');

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
// ENDPOINT GOES HERE

// DELETE a comment from a post
app.delete('/comments/:id', (request, response) => {

    const commentId = request.params.id;

    Comment.deleteComments(commentId)
    .then((num) =>{
        if (num === 1) {
            res.status(200).json({ successMessage: "This comment is successfully deleted"})
        } else {
            res.status(404).json({ message:"Failed to delete comment"}).end();
        }
    })
    .catch((err) =>{
        res.status(500).json({message:"ERR in DELETE COMMENT", error: err.message})
    });
})
// ENDPOINT GOES HERE

// Fetch a post's comments by recent
app.get('/recent/:id', (request, response) => {
    const postID = request.params.id;

	Comment.fetchRecent(postID)
        .then(comments => response.status(200).json(comments))
        .catch(error => {
            console.log(error);
            response.status(500).json({ message: 'Error fetching post\'s comments by recent' });
        });
});

// Fetch a post's comments by popular
app.get('/popular/:id', (request, response) => {
    const postID = request.params.id;

	Comment.fetchPopular(postID)
        .then(comments => response.status(200).json(comments))
        .catch(error => {
            console.log(error);
            response.status(500).json({ message: 'Error fetching post\'s comments by popular' });
        });
});

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