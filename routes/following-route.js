const express = require("express");
const following = require("../models/following");
const app = express.Router();

// fetch all messages between two users
app.get("/:id", (req, res) => {
  const user_id = req.params.id;

  following
    .fetchFollowing({ id: user_id })
    .then((following) => {
      res.status(200).json({ following });
    })
    .catch((err) => {
      res.status(500).json(`${err}`);
    });
});

//add a new message
app.get("/:user_id/follow/:following_id", (req, res) => {
  const user_id = req.params.user_id;
  const following_id = req.params.following_id;
  following
    .addFollowing(user_id, following_id)
    .then((following) => {
      res.status(200).json({ following });
    })
    .catch((err) => {
      res.status(500).json(`${err}`);
    });
});

//delete a message
app.delete("/:user_id/unfollow/:following_id", (req, res) => {
  const user_id = req.params.user_id;
  const following_id = req.params.following_id;

  following
    .removeFollowing(user_id, following_id)
    .then((following) => {
      res.status(200).json({ following });
    })
    .catch((err) => {
      res.status(500).json(`${err}`);
    });
});

module.exports = app;
