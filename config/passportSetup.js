const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.find({ id: id })
        .then(user => {
            done(null, user);
        });
});

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/api/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        const user = {
            google_id: profile.id,
            email: profile.emails[0].value,
            display_name: profile.displayName,
            profile_picture: profile.photos[0].value
        };

        User.find({ email: user.email })
            .then(existingUser => {
                if (existingUser) {
                    done(null, existingUser);
                } else {
                    User.add(user)
                        .then(newUser => {
                            done(null, newUser[0]);
                        });
                };
            })
    }
));

passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: 'http://localhost:5000/api/auth/facebook/redirect',
        profileFields: ['id', 'displayName', 'photos', 'email']
    }, (accessToken, refreshToken, profile, done) => {
        const user = {
            facebook_id: profile.id,
            email: profile.emails[0].value,
            display_name: profile.displayName,
            profile_picture: profile.photos[0].value
        };

        User.find({ email: user.email })
            .then(existingUser => {
                if (existingUser) {
                    done(null, existingUser);
                } else {
                    User.add(user)
                        .then(newUser => {
                            done(null, newUser[0]);
                        });
                };
            })
    }
));

passport.use(new TwitterStrategy({
        consumerKey: process.env.TWITTER_CONSUMER_API_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_API_SECRET_KEY,
        callbackURL: 'http://localhost:5000/api/auth/twitter/redirect',
        includeEmail: true
    },
    (token, tokenSecret, profile, done) => {
        const user = {
            twitter_id: profile.id,
            email: profile.emails[0].value,
            display_name: profile.displayName,
            profile_picture: profile.photos[0].value
        };

        User.find({ email: user.email })
            .then(existingUser => {
                if (existingUser) {
                    done(null, existingUser);
                } else {
                    User.add(user).
                        then(newUser => {
                            done(null, newUser[0]);
                        });
                };
        });
    }
));