const express = require('express');
const passport = require('passport');

const app = express.Router();

const jwt = require('jsonwebtoken');

const FRONTEND_URL = process.env.FRONTEND_DEPLOYED_URL || 'http://localhost:3000';

function getJwt(user) {
  const payload = {
    id: user.id,
    email: user.email,
    displayName: user.display_name,
    profilePicture: user.profile_picture,
    track: user.track,
    onboarded: user.onboarded,
    created_at: user.created_at,
    updated_at: user.updated_at,
    role_id: user.role_id,
  };
  const jwtOptions = {
    expiresIn: '8h',
  };
  const secret = process.env.SESSION_SECRET || 'potatoes in the sky';
  return jwt.sign(payload, secret, jwtOptions);
}

// LinkedIn Auth Launch
app.get('/linkedin', passport.authenticate('linkedin'));

// LinkedIn Auth Redirect
app.get('/linkedin/redirect', passport.authenticate('linkedin', {
  failureRedirect: `${FRONTEND_URL}/error`
}), (request, response) => {
  const token = getJwt(request.user);
  response.redirect(`${FRONTEND_URL}/success/` + token);
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