const express = require('express');
const Post = require('../models/post');
const Comment = require('../models/comment');
const app = express.Router();

const { findIfCommentLiked } = require('../middleware');

// Add a comment to a post
app.post('/', (request, response) => {
  const userID = request.user.id;
  const postID = request.body.postID;
  const comment = request.body.comment;
  Post.incrementCommentCount(postID)
    .then(() => {
      Comment.add(userID, postID, comment).then((r) =>
        response
          .status(200)
          .json({ message: 'Added comment successfully', comment: r[0] })
      );
    })
    .catch((err) => {
      console.log(err);
      response
        .status(500)
        .json({ message: 'Error incrementing comment count on post' });
    });
});

// Deletes a comment from a post (USER)
app.delete('/:id', async (request, response) => {
  const commentId = request.params.id;
  const commentFromDb = await Comment.fetchCommentId(commentId);
  if (commentFromDb[0].user_id === request.user.id) {
    Comment.removeComments(commentId)
      .then(() => {
        response
          .status(200)
          .json({ successMessage: 'This comment is successfully deleted' });
      })
      .catch((err) => {
        response
          .status(500)
          .json({ message: 'ERR in DELETE COMMENT', error: err.message });
      });
  } else {
    response.status(403).json({ message: "Access denied." });
  }
});

// Fetch Comment by ID
app.get('/:id', (request, response) => {
  const commentId = request.params.id;
  Comment.fetchCommentId(commentId)
    .then((comment) =>
      response.status(200).json({
        successMessage: 'This comment is successfully fetched',
        comment,
      })
    )
    .catch((error) => {
      console.log(error);
      response
        .status(500)
        .json({ message: 'Error in fetching comment', err: error.message });
    });
});

// Fetch a posts' comments order by most recent
app.get('/recent/:id', (request, response) => {
  const postID = request.params.id;
  const user_id = request.user.id;
  Comment.fetchRecent(postID, user_id)
    .then((comments) => {
      response.status(200).json(comments);
    })
    .catch((error) => {
      console.log(error);
      response
        .status(500)
        .json({ message: 'Error fetching post\'s comments by recent' });
    });
});

// Fetch a posts' comments ordered by most likes
app.get('/popular/:id', (request, response) => {
  const postID = request.params.id;
  Comment.fetchPopular(postID)
    .then((comments) => response.status(200).json(comments))
    .catch((error) => {
      console.log(error);
      response
        .status(500)
        .json({ message: 'Error fetching post\'s comments by popular' });
    });
});

// Add user like to a comment
app.get('/like/:id', findIfCommentLiked, (request, response) => {
  const userID = request.user.id;
  const commentID = Number(request.params.id);
  const pair = request.body.pair;
  if (!pair) {
    Comment.incrementCommentLikes(commentID)
      .then(() => {
        Comment.addCommentLike(userID, commentID)
          .then(() =>
            response.status(200).json({ message: 'Liked comment successfully' })
          )
          .catch((err) => {
            console.log(err);
            response.status(500).json({ message: 'Error adding comment like' });
          });
      })
      .catch((err) => {
        console.log(err);
        response
          .status(500)
          .json({ message: 'Error incrementing comment likes' });
      });
  } else {
    response.status(400).json({
      message: 'Ooops, already liked that comment.'
    });
  }
});

// Remove a users like from a comment
app.delete('/like/:id', findIfCommentLiked, (request, response) => {
  const userID = request.user.id;
  const commentID = Number(request.params.id);
  const pair = request.body.pair;
  if (pair) {
    Comment.decrementCommentLikes(commentID)
      .then(() => {
        Comment.removeCommentLike(userID, commentID)
          .then(() =>
            response.status(200).json({ message: 'Unliked comment successfully' })
          )
          .catch((err) => {
            console.log(err);
            response.status(500).json({ message: 'Error removing comment like' });
          });
      })
      .catch((err) => {
        console.log(err);
        response
          .status(500)
          .json({ message: 'Error decrementing comment likes' });
      });
  } else {
    response.status(400).json({
      message: 'Ooops, haven\'t liked that comment.'
    });
  }
});

module.exports = app;
