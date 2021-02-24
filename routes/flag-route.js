const express = require('express');
const app = express.Router();
const Flag = require('../models/flag-model');

// Flag a post
app.post('/post/:id', (req, res) => {
  Flag.createFlaggedPost(req.params.id, req.user.id)
    .then(() => {
      res.status(200).json({ message: 'successfully flagged post' });
    })
    .catch(() => {
      res.status(500).json({ message: 'failed to flag post' });
    });
});

// Flag a comment
app.post('/comment', (req, res) => {});

// Fetches flagged posts
app.get('/posts', (req, res) => {});

// Fetches flagged comments
app.get('/comments', (req, res) => {
  if (req.user.role_id > 1) {
    Flag.getFlaggedComments()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.status(401).json({ message: 'Unauthroized'});
  }
});

// Remove a post
app.delete('/post/:id', (req, res) => {});

// Remove a comment
app.delete('/post/:id', (req, res) => {});

// Resolve a flagged post without removing
app.put('/post/:id', (req, res) => {});

// Resolve a flagged comment without removing
app.put('/post/:id', (req, res) => {});

module.exports = app;
