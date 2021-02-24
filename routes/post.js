const express = require('express');
const Post = require('../models/post');

const app = express.Router();

// Create post
app.post('/create', (request, response) => {
  const userID = request.user.id;
  const { title, description, room_id } = request.body;
  Post.createPost({ user_id: userID, title, description })
    .then(([res]) => {
      Post.createRoomPostEntry(res, room_id)
        .then(() => {
          response.status(200).json({ message: 'Post created successfully' });
        })
        .catch(err => {
          console.log(err);
          response.status(500).json({ message: 'Error creating post' });
        });
    })
    .catch(err => {
      console.log(err);
      response.status(500).json({ message: 'Error creating post' });
    });
});

// Fetch a single post
app.get('/:id', (request, response) => {
  const postID = request.params.id;
  Post.fetch(postID)
    .then(post => response.status(200).json(post))
    .catch(error => {
      console.log(error);
      response.status(500).json({ message: 'Error fetching individual post' });
    });
});

// Fetch posts ordered by most recent
app.post('/recent', (request, response) => {
  Post.fetchRecent()
    .then(res => response.status(200).json(res))
    .catch(err => {
      console.log(err);
      response.status(500).json({message: 'Error fetching recent posts'});
    });
});

// Fetch posts ordered by most popular
app.post('/popular', (request, response) => {
  Post.fetchPopular()
    .then(res => response.status(200).json(res))
    .catch(err => {
      console.log(err);
      response.status(500).json({message: 'Error fetching popular posts'});
    });
});


// Search for a post based on user search input
app.post('/search', (request, response) => {
  const search = request.body.search;
  Post.fetchSearch(search)
    .then(res => response.status(200).json(res))
    .catch(err => {
      console.log(err);
      response.status(500).json({message: 'Error fetching posts'});
    });
});

// Like a post
app.get('/like/:id', (request, response) => {
  const userID = request.user.id;
  const postID = request.params.id;
  Post.incrementPostLikes(postID)
    .then(() => {
      Post.addPostLike(userID, postID)
        .then(() => response.status(200).json({ message: 'Post liked successfully' }))
        .catch((err) => {
          console.log(err);
          response.status(500).json({ message: 'Error adding post like' });
        });
    })
    .catch((err) => {
      console.log(err);
      response.status(500).json({ message: 'Error incrementing post\'s comment count' });
    });
});

// Remove like from a post
app.delete('/like/:id', (request, response) => {
  const userID = request.user.id;
  const postID = request.params.id;
  Post.decrementPostLikes(postID)
    .then(() => {
      Post.removePostLike(userID, postID)
        .then(() => response.status(200).json({ message: 'Post unliked successfully' }))
        .catch((err) => {
          console.log(err);
          response.status(500).json({ message: 'Error removing post like' });
        });
    })
    .catch((err) => {
      console.log(err);
      response.status(500).json({ message: 'Error decrementing post\'s comment count' });
    });
});

module.exports = app;