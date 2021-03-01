const express = require('express');
const app = express.Router();
const Search = require('../models/search-model');

// Fetch posts, comments, users, rooms based on search input 
app.get('/full/:search', (request, response) => {
  Search.getFullSearchResults(request.params.search)
    .then((data) => response.status(200).json(data))
    .catch(() =>
      response.status(400).json({
        message: `Failed to fetch search results:${request.params.search}`,
      })
    );
});

// Fetch posts based on search input 
app.get('/posts/:search', (request, response) => {
  Search.getPostSearchResults(request.params.search)
    .then((data) => response.status(200).json(data))
    .catch(() =>
      response.status(400).json({
        message: `Failed to fetch search results:${request.params.search}`,
      })
    );
});

// Fetch comments based on search input
app.get('/comments/:search', (request, response) => {
  Search.getCommentSearchResults(request.params.search)
    .then((data) => response.status(200).json(data))
    .catch(() =>
      response.status(400).json({
        message: `Failed to fetch search results:${request.params.search}`,
      })
    );
});

// Fetch users based on search input
app.get('/users/:search', (request, response) => {
  Search.getUserSearchResults(request.params.search)
    .then((data) => response.status(200).json(data))
    .catch(() =>
      response.status(400).json({
        message: `Failed to fetch search results:${request.params.search}`,
      })
    );
});

// Fetch rooms based on search input
app.get('/rooms/:search', (request, response) => {
  Search.getRoomSearchResults(request.params.search)
    .then((data) => response.status(200).json(data))
    .catch(() =>
      response.status(400).json({
        message: `Failed to fetch search results:${request.params.search}`,
      })
    );
});

// Fetch posts from room based on user search input
app.get('/rooms/:search/:room_id', (request, response) => {
  Search.getPostSearchResultsByRoom(request.params.search, request.params.room_id)
    .then((data) => response.status(200).json(data))
    .catch(() =>
      response.status(400).json({
        message: `Failed to fetch search: ${request.params.search} in room ${request.params.room_id}`,
      })
    );
});

// Fetch comments from post based on user search input
app.get('/rooms/:search/:post_id', (request, response) => {
  Search.getCommentSearchResultsByPost(request.params.search, request.params.post_id)
    .then((data) => response.status(200).json(data))
    .catch(() =>
      response.status(400).json({
        message: `Failed to fetch search: ${request.params.search} in post ${request.params.room_id}`,
      })
    );
});

module.exports = app;
