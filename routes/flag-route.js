const express = require('express');
const app = express.Router();
const Flag = require('../models/flag-model');
const Room = require('../models/room-model');
const Comment = require('../models/comment');

const { 
  verifyModeratorOrAdmin,
  findReasonIdByReason
} = require('../middleware');

// Flag a post
app.post('/posts/:id', findReasonIdByReason, (req, res) => {
  Flag.createFlaggedPost(req.params.id, req.user.id, req.body)
    .then(() => {
      res.status(200).json({ message: 'successfully flagged post' });
    })
    .catch(() => {
      res.status(500).json({ message: 'failed to flag post' });
    });
});

// Flag a comment
app.post('/comments/:id', findReasonIdByReason, (req, res) => {
  Flag.createFlaggedComment(req.params.id, req.user.id, req.body)
    .then(() => {
      res.status(200).json({ message: 'successfully flagged Comment' });
    })
    .catch(() => {
      res.status(500).json({ message: 'failed to flag Comment' });
    });
});

// Fetches one instance of all flagged posts
app.get('/posts/flagged', verifyModeratorOrAdmin, async (req, res) => {
  Flag.getFlaggedPosts()
    .then(async distinctPosts => {
      const getFlaggedPosts = async (list) => {
        return Promise.all(list.map(async post => {
          let flaggedPost = {...post};
          let flags = await Flag.getFlagsByPostId(post.post_id);
          flaggedPost.flags = flags;
          return flaggedPost;
        }));
      };
      let flags = await getFlaggedPosts(distinctPosts);
      res.status(200).json(flags);
    });
});

// Fetches one instance of all posts by room
app.get('/posts/:id', verifyModeratorOrAdmin, async (req, res) => {
  const room_id = req.params.id;
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  Room.fetchRecentByRoomId(room_id, page, limit)
    .then(async roomPosts => {
      const getFlaggedPosts = async (list) => {
        return Promise.all(list.map(async post => {
          let flaggedPost = {...post};
          let flags = await Flag.getFlagsByPostId(post.id);
          flaggedPost.flags = flags;
          return flaggedPost;
        }));
      };
      const getFlaggedCommentsByPostId = async (list) => {
        return Promise.all(list.map(async post => {
          let flaggedPost = {...post};
          let flaggedComments = await Flag.getFlaggedCommentsByPostId(post.id);
          flaggedPost.flaggedComments = flaggedComments;
          return flaggedPost;
        }));
      };
      let flaggedPosts = await getFlaggedPosts(roomPosts.posts);
      let flags = await getFlaggedCommentsByPostId(flaggedPosts);
      res.status(200).json(flags);
    });
});

// Fetches one instance of all flagged comments
app.get('/comments/flagged', verifyModeratorOrAdmin, async (req, res) => {
  Flag.getFlaggedComments()
    .then(async distinctComments => {
      const getFlaggedComments = async (list) => {
        return Promise.all(list.map(async comment => {
          let flaggedComment = {...comment};
          let flags = await Flag.getFlagsByCommentId(comment.comment_id);
          flaggedComment.flags = flags;
          return flaggedComment;
        }));
      };
      let flags = await getFlaggedComments(distinctComments);
      res.status(200).json(flags);
    });
});

// Fetches one instance of all flagged comments by room
app.get('/comments/:id', verifyModeratorOrAdmin, async (req, res) => {
  const post_id = req.params.id;

  Comment.fetchRecent(post_id)
    .then(async distinctComments => {
      const getFlaggedComments = async (list) => {
        return Promise.all(list.map(async comment => {
          let flaggedComment = {...comment};
          let flags = await Flag.getFlagsByCommentId(comment.id);
          flaggedComment.flags = flags;
          return flaggedComment;
        }));
      };
      let flags = await getFlaggedComments(distinctComments);
      res.status(200).json(flags);
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

// Get a list of all flag reasons
app.get('/reasons', verifyModeratorOrAdmin, (req, res) => {
  Flag.getFlagReasons()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(400).json({
        message: 'Failed to retrieve reasons',
        error: err.message
      });
    });
});

module.exports = app;
