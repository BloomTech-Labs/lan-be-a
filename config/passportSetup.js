const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
// const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;
// const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/user');

const BACKEND_URL = process.env.BACKEND_DEPLOYED_URL || 'http://localhost:5000';

passport.serializeUser((user, done) => {
  console.log('serializeUser', user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log('deserializeUser', id);
  User.find({ id: id }).then((user) => {
    return done(null, user);
  });
});

// Found online, might be it
// passport.deserializeUser(async (id,done) => {
//     const user = await User.findById(id)
//     done(null, user)
//  })

// passport.use(
//   new LinkedInStrategy(
//     {
//       consumerKey: process.env.LINKEDIN_CLIENT_ID,
//       consumerSecret: process.env.LINKEDIN_CLIENT_SECRET,
//       callbackURL: `${BACKEND_URL}/api/auth/linkedin/redirect`,
//     },
//     (accessToken, refreshToken, profile, done) => {
//       console.log('LinkedIn strategy hit', profile);
//       const user = {
//         id: profile.id,
//         email: profile.emails[0].value,
//         display_name: profile.displayName,
//         profile_picture: profile.photos[3].value,
//       };

//       User.find({ id: user.id }).then((existingUser) => {
//         console.log('existingUser', existingUser);
//         if (existingUser) {
//           return done(null, existingUser);
//         } else {
//           User.add(user).then((newUser) => {
//             console.log('newUser', newUser);
//             return done(null, newUser[0]);
//           });
//         }
//       });
//     }
//   )
// );

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/api/auth/linkedin/redirect`,
      scope: ['r_emailaddress', 'r_liteprofile'],
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('LinkedIn strategy hit', profile);
      const user = {
        id: profile.id,
        email: profile.emails[0].value,
        display_name: profile.displayName,
        profile_picture: profile.photos[3].value,
      };

      process.nextTick(() => {
        User.find({ id: user.id }).then((existingUser) => {
          console.log('existingUser', existingUser);
          if (existingUser) {
            return done(null, existingUser);
          } else {
            User.add(user).then((newUser) => {
              console.log('newUser', newUser);
              return done(null, newUser[0]);
            });
          }
        });
      });
    }
  )
);

// passport.use(new LinkedInStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: `${BACKEND_URL}/api/auth/google/redirect`
// }, (accessToken, refreshToken, profile, done) => {
//     const user = {
//         google_id: profile.id,
//         email: profile.emails[0].value,
//         display_name: profile.displayName,
//         profile_picture: profile.photos[0].value
//     };

//     User.find({ email: user.email })
//         .then(existingUser => {
//             if (existingUser) {
//                 done(null, existingUser);
//             } else {
//                 User.add(user)
//                     .then(newUser => {
//                         done(null, newUser[0]);
//                     });
//             };
//         })
// }
// ));

// Leaving Google as the only one for now as we wait to get approved for LinkedIn authentication
// The reason we are going to be offering just LinkedIn authentication is because it fits well with the platform's intentions and brand,
// and for data singularity. Currently, we have 3 different columns for the 3 different social media ID's which I believe introduces security concerns.
// For example, a user being able to interchange the social media they sign in with if those social medias have the same email address.
// passport.use(new GoogleStrategy({
//         clientID: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         callbackURL: `${BACKEND_URL}/api/auth/google/redirect`
//     }, (accessToken, refreshToken, profile, done) => {
//         const user = {
//             google_id: profile.id,
//             email: profile.emails[0].value,
//             display_name: profile.displayName,
//             profile_picture: profile.photos[0].value
//         };

//         User.find({ email: user.email })
//             .then(existingUser => {
//                 if (existingUser) {
//                     done(null, existingUser);
//                 } else {
//                     User.add(user)
//                         .then(newUser => {
//                             done(null, newUser[0]);
//                         });
//                 };
//             })
//     }
// ));

// Removing these two strategies for reasons mentioned above. Commenting them out instead of removing them, just in case we need them in the future.
// Environment variables needed are available or can be fetched.
// passport.use(new FacebookStrategy({
//         clientID: process.env.FACEBOOK_APP_ID,
//         clientSecret: process.env.FACEBOOK_APP_SECRET,
//         callbackURL: `${BACKEND_URL}/api/auth/facebook/redirect`,
//         profileFields: ['id', 'displayName', 'photos', 'email']
//     }, (accessToken, refreshToken, profile, done) => {
//         const user = {
//             facebook_id: profile.id,
//             email: profile.emails[0].value,
//             display_name: profile.displayName,
//             profile_picture: profile.photos[0].value
//         };

//         User.find({ email: user.email })
//             .then(existingUser => {
//                 if (existingUser) {
//                     done(null, existingUser);
//                 } else {
//                     User.add(user)
//                         .then(newUser => {
//                             done(null, newUser[0]);
//                         });
//                 };
//             })
//     }
// ));

// passport.use(new TwitterStrategy({
//         consumerKey: process.env.TWITTER_CONSUMER_API_KEY,
//         consumerSecret: process.env.TWITTER_CONSUMER_API_SECRET_KEY,
//         callbackURL: `${BACKEND_URL}/api/auth/twitter/redirect`,
//         includeEmail: true
//     },
//     (token, tokenSecret, profile, done) => {
//         const user = {
//             twitter_id: profile.id,
//             email: profile.emails[0].value,
//             display_name: profile.displayName,
//             profile_picture: profile.photos[0].value
//         };

//         User.find({ email: user.email })
//             .then(existingUser => {
//                 if (existingUser) {
//                     done(null, existingUser);
//                 } else {
//                     User.add(user).
//                         then(newUser => {
//                             done(null, newUser[0]);
//                         });
//                 };
//         });
//     }
// ));
