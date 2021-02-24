const express = require('express');
const passport = require('passport');

const app = express.Router();

const FRONTEND_URL = process.env.FRONTEND_DEPLOYED_URL || 'http://localhost:3000';

// LinkedIn Auth Launch
app.get('/linkedin', passport.authenticate('linkedin'));

// LinkedIn Auth Redirect
app.get('/linkedin/redirect', passport.authenticate('linkedin', {
  failureRedirect: `${FRONTEND_URL}/error`
}), (request, response) => {
  response.redirect(`${FRONTEND_URL}/success`);
}
);

// Logout User
app.get('/logout', (request, response) => {
  request.logout();
  if (request.session) {
    request.session.destroy(err => {
      if (err) {
        response.status(500).json({ message: 'Error destroying session' });
      } else {
        response.status(200).clearCookie('LAN').json({ message: 'Signed out successfully' });
      }
    });
  } else {
    response.status(204).json({ message: 'Session does not exist' });
  }
});

module.exports = app;