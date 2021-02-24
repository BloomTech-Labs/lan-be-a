const express = require('express');
const Post = require('../models/post');
const Comment = require('../models/comment');
const { response } = require('express');

const app = express.Router();

// Add a comment to a post
app.post('/', (request, response) => {
  const userID = request.user.id;
  const postID = request.body.postID;
  const comment = request.body.comment;
  Post.incrementCommentCount(postID)
    .then(() => {
      Comment.add(userID, postID, comment)
        .then(r => response.status(200).json({ message: 'Added comment successfully', comment: r[0] }));
    })
    .catch(err => {
      console.log(err);
      response.status(500).json({ message: 'Error incrementing comment count on post' });
    });
});

// Deletes a comment from a post
app.delete('/comments/:id', (request, response) => {
  const commentId = request.params.id;
  Comment.deleteComments(commentId)
    .then((num) =>{
      if (num === 1) {
        response.status(200).json({ successMessage: 'This comment is successfully deleted'});
      } else {
        response.status(404).json({ message:'Failed to delete comment'}).end();
      }
    })
    .catch((err) =>{
      response.status(500).json({message:'ERR in DELETE COMMENT', error: err.message});
    });
});

// Fetch a posts' comments order by most recent
app.get('/recent/:id', (request, response) => {
  const postID = request.params.id;
  Comment.fetchRecent(postID)
    .then(comments => response.status(200).json(comments))
    .catch(error => {
      console.log(error);
      response.status(500).json({ message: 'Error fetching post\'s comments by recent' });
    });
});

// Fetch a posts' comments ordered by most likes
app.get('/popular/:id', (request, response) => {
  const postID = request.params.id;
  Comment.fetchPopular(postID)
    .then(comments => response.status(200).json(comments))
    .catch(error => {
      console.log(error);
      response.status(500).json({ message: 'Error fetching post\'s comments by popular' });
    });
});

// Add user like to a comment
app.get('/like/:id', (request, response) => {
  const userID = request.user.id;
  const commentID = Number(request.params.id);
  Comment.incrementCommentLikes(commentID)
    .then(() => {
      Comment.addCommentLike(userID, commentID)
        .then(() => response.status(200).json({ message: 'Liked comment successfully' }))
        .catch((err) => {
          console.log(err);
          response.status(500).json({ message: 'Error adding comment like' });
        });
    })
    .catch((err) => {
      console.log(err);
      response.status(500).json({ message: 'Error incrementing comment likes' });
    });
});

// Remove a users like from a comment
app.delete('/like/:id', (request, response) => {
  const userID = request.user.id;
  const commentID = Number(request.params.id);
  Comment.decrementCommentLikes(commentID)
    .then(() => {
      Comment.removeCommentLike(userID, commentID)
        .then(() => response.status(200).json({ message: 'Unliked comment successfully' }))
        .catch((err) => {
          console.log(err);
          response.status(500).json({ message: 'Error removing comment like' });
        });
    })
    .catch((err) => {
      console.log(err);
      response.status(500).json({ message: 'Error decrementing comment likes' });
    });
});

module.exports = app;