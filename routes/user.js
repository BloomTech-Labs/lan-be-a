const express = require('express');
const User = require('../models/user');

const app = express.Router();

// Fetch logged-in user's object
app.get('/', (request, response) => {
  response.status(200).json({
    message: 'Successfully fetched user object',
    user: {
      id: request.user.id,
      email: request.user.email,
      displayName: request.user.display_name,
      profilePicture: request.user.profile_picture,
      track: request.user.track,
      likes: request.user.likes,
      onboarded: request.user.onboarded,
      created_at: request.user.created_at,
      updated_at: request.user.updated_at,
    },
  });
});

// Fetch all of a single user's posts and comments
// Can model helper function be consolidated?
// Good idea, I'll think about this
// Might need help with these architectural decisions
app.get('/:id', (request, response) => {
  const userID = request.params.id;

  User.find({ id: userID })
    .then((user) => {
      // Model helper functions need to be seperate due to Knex's limitations
      User.fetchPosts(userID)
        .then((posts) => {
          User.fetchComments(userID)
            .then((comments) =>
              response.status(200).json({ ...user, posts, comments })
            )
            .catch((e) => {
              console.log(e);
              response
                .status(500)
                .json({ message: "Error fetching user's comments" });
            });
        })
        .catch((err) => {
          console.log(err);
          response.status(500).json({ message: "Error fetching user's posts" });
        });
    })
    .catch((error) => {
      console.log(err);
      response.status(500).json({ message: 'Error fetching user' });
    });
});

// These are similar, but the one above works for any user

// Fetch user's liked posts
app.get('/post/like', (request, response) => {
  const userID = request.user.id;

  User.fetchUsersLikedPosts(userID)
    .then((res) => response.status(200).json(res))
    .catch((err) => {
      console.log(err);
      response
        .status(500)
        .json({ message: "Error fetching user's liked posts" });
    });
});

// Fetch a user's liked comments
app.get('/comment/like', (request, response) => {
  const userID = request.user.id;

  User.fetchUsersLikedComments(userID)
    .then((res) => response.status(200).json(res))
    .catch((err) => {
      console.log(error);
      response
        .status(500)
        .json({ message: "Error fetching user's liked comments" });
    });
});

// Update user's display name
app.put('/displayname', (request, response) => {
  const { userID, displayName } = request.body;

  User.update(userID, { display_name: displayName })
    .then((res) =>
      response
        .status(200)
        .json({ message: "Updated user's display name successfully" })
    )
    .catch((err) =>
      response
        .status(500)
        .json({ message: "Error updating user's display name" })
    );
});

// Set and update user's track
app.put('/track', (request, response) => {
  userID = request.user.id;
  track = request.body.track;
  token = request.body.token;

  if (track === 'Career Coach') {
    if (token === process.env.LAN_TOKEN) {
      User.update(userID, { track })
        .then((res) =>
          response
            .status(200)
            .json({ message: "Updated user's track successfully" })
        )
        .catch((err) => {
          console.log(err);
          response.status(500).json({ message: 'Error updating user track' });
        });
    } else {
      response.status(500).json({ message: 'Invalid viewee token' });
    }
  } else {
    User.update(userID, { track })
      .then((res) =>
        response
          .status(200)
          .json({ message: "Updated user's track successfully" })
      )
      .catch((err) => {
        console.log(err);
        response.status(500).json({ message: 'Error updating user track' });
      });
  }
});

// Set a user's onboarded field to true
app.put('/onboard', (request, response) => {
  userID = request.user.id;

  User.onboard(userID)
    .then((res) =>
      response
        .status(200)
        .json({ message: "Updated user's onboarded field successfully", user })
    )
    .catch((err) => {
      console.log(err);
      response
        .status(500)
        .json({ message: "Error updating user's onboarded field" });
    });
});

//remove a specific user with the userID passed in req param
app.delete('/settings/remove-user/:id', (req, res) => {
  userID = req.user.id;

  User.remove(userID)
    .then((numberOfRecordsDeleted) => {
      res
        .status(200)
        .json({ message: `user ${userID} has been removed from DB` });
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});

module.exports = app;
