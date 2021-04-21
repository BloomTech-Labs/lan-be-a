const express = require('express');
const User = require('../models/user');
const app = express.Router();

const { verifyUser } = require('../middleware');

// Fetch logged-in user's object
app.get('/', async (request, response) => {
  try { // Corey: Added try...catch due to UnhandledPromise err
    const verifiedUser = await User.find({ id: request.user.id });
    response.status(200).json({
      message: 'Successfully fetched user object',
      user: {
        id: request.user.id,
        email: verifiedUser.email,
        displayName: verifiedUser.display_name,
        profilePicture: verifiedUser.profile_picture,
        track: verifiedUser.track,
        onboarded: verifiedUser.onboarded,
        created_at: request.user.created_at,
        updated_at: request.user.updated_at,
        role_id: verifiedUser.role_id,
        gitHubUsername: verifiedUser.github_username
      },
    });
  } catch (err) {
    return response.status(500).json({error: err.message, stack: err.stack});
  }
});

// Fetch all posts and comments a single user has made
app.get('/:id', verifyUser, (request, response) => {
  const userID = request.params.id;
  User.find({ id: userID })
    .then((user) => {
      User.fetchPosts(userID)
        .then((posts) => {
          User.fetchComments(userID)
            .then((comments) =>
              response.status(200).json({ ...user, posts, comments })
            )
            .catch((err) => {
              console.log(err);
              response
                .status(500)
                .json({ message: 'Error fetching user\'s comments' });
            });
        })
        .catch((err) => {
          console.log(err);
          response.status(500).json({ message: 'Error fetching user\'s posts' });
        });
    })
    .catch((err) => {
      console.log(err);
      response.status(500).json({ message: 'Error fetching user' });
    });
});

// Fetch a users liked posts
app.get('/post/like', verifyUser, (request, response) => {
  const userID = request.user.id;
  User.fetchUsersLikedPosts(userID)
    .then((res) => response.status(200).json(res))
    .catch((err) => {
      console.log(err);
      response
        .status(500)
        .json({ message: 'Error fetching user\'s liked posts' });
    });
});

// Fetch a user's liked comments
app.get('/comment/like', verifyUser, (request, response) => {
  const userID = request.user.id;
  User.fetchUsersLikedComments(userID)
    .then((res) => response.status(200).json(res))
    .catch((err) => {
      console.log(err);
      response
        .status(500)
        .json({ message: 'Error fetching user\'s liked comments' });
    });
});

// Update user's display name
app.put('/displayname', verifyUser, (request, response) => {
  const { userID, displayName } = request.body;
  User.update(userID, { display_name: displayName })
    .then(() => {
      response.status(200).json({ message: 'Updated user\'s GitHub username successfully' });
    })
    .catch((err) => {
      console.log(err);
      response.status(500).json({ message: 'Error updating user\'s Github Username' });
    });
});

//Update user's GitHub username
app.put('/githubusername', verifyUser, (request, response) => {
  const { userID, gitHubUsername } = request.body;
  User.update(userID, { github_username: gitHubUsername })
    .then(() => {
      response.status(200).json({ message: 'Updated user\'s github username successfully' });
    })
    .catch((err) => {
      console.log(err);
      response.status(500).json({ message: 'Error updating user\'s github username' });
    });
});

// Set and update user's track
app.put('/track', verifyUser, (request, response) => {
  const userID = request.user.id;
  const track = request.body.track;
  const token = request.body.token;
  if (track === 'Career Coach') {
    if (token === process.env.LAN_TOKEN) {
      User.update(userID, { track })
        .then(() => {
          response.status(200).json({ message: 'Updated user\'s track successfully' });
        })
        .catch((err) => {
          console.log(err);
          response.status(500).json({ message: 'Error updating user track' });
        });
    } else {
      response.status(500).json({ message: 'Invalid viewee token' });
    }
  } else {
    User.update(userID, { track })
      .then(() => {
        response.status(200).json({ message: 'Updated user\'s track successfully' });
      })
      .catch((err) => {
        console.log(err);
        response.status(500).json({ message: 'Error updating user track' });
      });
  }
});

// Set a user's onboarded field to true
app.put('/onboard', verifyUser, (request, response) => {
  const userID = request.user.id;
  User.onboard(userID)
    .then(() =>
      response.status(200).json({ message: 'Updated user\'s onboarded field successfully' })
    )
    .catch((err) => {
      console.log(err);
      response.status(500).json({ message: 'Error updating user\'s onboarded field' });
    });
});

// Delete a user
app.delete('/settings/remove-user/:id', verifyUser, (req, res) => {
  const userID = req.user.id;
  User.remove(userID)
    .then(() => {
      res.status(200).json({ message: `user ${userID} has been removed from DB` });
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});

module.exports = app;
