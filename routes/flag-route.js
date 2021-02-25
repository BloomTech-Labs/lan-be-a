const express = require("express");
const app = express.Router();
const Flag = require("../models/flag-model");

// Flag a post
app.post("/posts/:id", (req, res) => {
  Flag.createFlaggedPost(req.params.id, req.user.id)
    .then(() => {
      res.status(200).json({ message: "successfully flagged post" });
    })
    .catch(() => {
      res.status(500).json({ message: "failed to flag post" });
    });
});

// Flag a comment
app.post("/comments/:id", (req, res) => {
  Flag.createFlaggedComment(req.params.id, req.user.id)
    .then(() => {
      res.status(200).json({ message: "successfully flagged Comment" });
    })
    .catch(() => {
      res.status(500).json({ message: "failed to flag Comment" });
    });
});

// Fetches flagged posts
app.get("/posts", (req, res) => {
  if (req.user.role_id > 1) {
    Flag.getFlaggedPosts()
      .then((posts) => {
        res.status(200).json(posts);
      })
      .catch(() => {
        res.status(500).json({ message: "Could not retrieve posts" });
      });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

// Fetches flagged comments
app.get("/comments", (req, res) => {
  if (req.user.role_id > 1) {
    Flag.getFlaggedComments()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json({ message: "Failed to fetch comments" });
      });
  } else {
    res.status(401).json({ message: "Unauthroized" });
  }
});

// Deletes a comment
app.delete("/comments/:id", (request, response) => {
  const commentId = request.params.id;
  Comment.deleteComments(commentId)
    .then((num) => {
      if (num === 1) {
        res
          .status(200)
          .json({ successMessage: "This comment is successfully deleted" });
      } else {
        res.status(404).json({ message: "Failed to delete comment" }).end();
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "ERR in DELETE COMMENT", error: err.message });
    });
});

// Archive a flagged post
app.delete("/posts/:id", async (req, res) => {
  const flaggedPost = req.params.id;
  try {
    if (req.user.role_id > 1) {
      await Flag.archivePost(flaggedPost);
      res.status(200).json({ message: "Successfuly archived post" });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Archive a flagged comment
app.delete("/comments/:id", async (req, res) => {
  try {
    if (req.user.role_id > 1) {
      await Flag.archiveComment(req.params.id);
      res.status(200).json({ message: "Successfully archived comment" });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Resolve a flagged post without removing
app.put("/posts/:id", (req, res) => {
  if (req.user.role_id > 1) {
    Flag.resolveFlaggedPostWithoutArchiving(req.params.id)
      .then(() => {
        res.status(200).json({ message: "Flag resolved" });
      })
      .catch((err) => {
        res.status(500).json({ message: "Unable to resolve flag" });
      });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

// Resolve a flagged comment without removing
app.put("/comments/:id", async (req, res) => {
  if (req.user.role_id > 1) {
    Flag.resolveFlaggedCommentWithoutArchiving(req.params.id)
      .then(() => {
        res.status(200).json({ message: "Flag resolved" });
      })
      .catch((err) => {
        res.status(500).json({ message: "Unable to resolve flag" });
      });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

module.exports = app;
