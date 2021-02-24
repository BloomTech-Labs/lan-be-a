const express = require('express');
const app = express.Router();
const Flag = require('../models/flag-model');

// Flag a post
app.post('/post', (req, res) => {
  
});

// Flag a comment
app.post('/comment', (req, res) => {
  
});

// Fetches flagged posts
app.get('/posts', (req, res) => {
    
});

// Fetches flagged comments
app.get('/comments', (req, res) => {
    
});

// Remove a post
app.delete('/post/:id', (req, res) => {
    
});

// Remove a comment
app.delete('/post/:id', (req, res) => {
    
});

// Resolve a flagged post without removing
app.put('/post/:id', (req, res) => {

});

// Resolve a flagged comment without removing
app.put('/post/:id', (req, res) => {

});

module.exports = app;