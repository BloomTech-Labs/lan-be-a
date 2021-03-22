const express = require('express');
const app = express.Router();
const Flag = require('../models/flag-model');

const { verifyModeratorOrAdmin } = require('../middleware');

// Flag a post
app.post('/posts/:id', (req, res) => {
  Flag.createFlaggedPost(req.params.id, req.user.id)
    .then(() => {
      res.status(200).json({ message: 'successfully flagged post' });
    })
    .catch(() => {
      res.status(500).json({ message: 'failed to flag post' });
    });
});

// Flag a comment
app.post('/comments/:id', (req, res) => {
  Flag.createFlaggedComment(req.params.id, req.user.id)
    .then(() => {
      res.status(200).json({ message: 'successfully flagged Comment' });
    })
    .catch(() => {
      res.status(500).json({ message: 'failed to flag Comment' });
    });
});

// Fetches flagged posts
app.get('/posts', verifyModeratorOrAdmin, (req, res) => {
  Flag.getFlaggedPosts()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch(() => {
      res.status(500).json({ message: 'Could not retrieve posts' });
    });
});

// Fetches flagged comments
app.get('/comments', verifyModeratorOrAdmin, (req, res) => {
  Flag.getFlaggedComments()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch(() => {
      res.status(500).json({ message: 'Failed to fetch comments'});
    });
});

// Archive a flagged post
app.delete('/posts/:id', verifyModeratorOrAdmin, (req, res) => {
  const flaggedPost= (req.params.id);
  try {
    Flag.archivePost(flaggedPost)
      .then(() => {
        res.status(200).json({ message: 'Successfuly archived post'});
      })
      .catch(() => {
        res.status(500).json ({ message: 'Server Error'});
      });
  } catch(err) {
    res.status(500).json({message: err.message});
  }
});

// Archive a flagged comment
app.delete('/comments/:id', verifyModeratorOrAdmin, (req, res) => {
  try {
    Flag.archiveComment(req.params.id)
      .then(() => {
        res.status(200).json({ message: 'Successfully archived comment' });
      })
      .catch(() => {
        res.status(500).json({ message: 'Server error' });
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Resolve a flagged post without removing
app.put('/posts/:id', verifyModeratorOrAdmin, (req, res) => {
  Flag.resolveFlaggedPostWithoutArchiving(req.params.id)
    .then(() => {
      res.status(200).json({ message: 'Flag resolved' });
    })
    .catch(() => {
      res.status(500).json({ message: 'Unable to resolve flag'});
    });
});

// Resolve a flagged comment without removing
app.put('/comments/:id', verifyModeratorOrAdmin, async (req, res) => {
  Flag.resolveFlaggedCommentWithoutArchiving(req.params.id)
    .then(() => {
      res.status(200).json({ message: 'Flag resolved' });
    })
    .catch(() => {
      res.status(500).json({ message: 'Unable to resolve flag'});
    });
});

module.exports = app;
