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
app.post('/comment', (req, res) => {
  Flag.createFlaggedComment(req.params.id, req.user.id)
    .then(() => {
      res.status(200).json({ message: 'successfully flagged Comment' });
    })
    .catch(() => {
      res.status(500).json({ message: 'failed to flag Comment' });
    });
});

// Fetches flagged posts
app.get('/posts', (req, res) => {
  if (req.user.role_id > 1) {
    Flag.getFlaggedPosts()
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
app.delete('/post/:id', (req, res) => {
  if (req.user.role_id > 1) {
    Flag.archivePost()
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

// Remove a comment
app.delete('/comment/:id', (req, res) => {
  if (req.user.role_id > 1) {
    Flag.archiveComment()
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

// Resolve a flagged post without removing
app.put('/post/:id', (req, res) => {
  if (req.user.role_id > 1) {
    Flag.resolvePost()
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

// Resolve a flagged comment without removing
app.put('/comment/:id', (req, res) => {
  if (req.user.role_id > 1) {
    Flag.resolveComment()
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

module.exports = app;
