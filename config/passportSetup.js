const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/user');
const BACKEND_URL = process.env.BACKEND_DEPLOYED_URL || 'http://localhost:5000';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.find({ id: id }).then((user) => {
    done(null, user);
  });
});

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/api/auth/linkedin/redirect`,
      scope: ['r_emailaddress', 'r_liteprofile'],
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        id: profile.id,
        email: profile.emails[0].value,
        display_name: profile.displayName,
        profile_picture: profile.photos[3].value,
      };

      process.nextTick(() => {
        User.find({ id: user.id }).then((existingUser) => {
          if (existingUser) {
            return done(null, existingUser);
          } else {
            User.add(user).then((newUser) => {
              return done(null, newUser[0]);
            });
          }
        });
      });
    }
  )
);
