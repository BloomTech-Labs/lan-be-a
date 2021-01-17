const express = require('express');
const passport = require('passport');

const app = express.Router();

const FRONTEND_URL = process.env.FRONTEND_DEPLOYED_URL || 'http://localhost:3000';

// LinkedIn
app.get('/linkedin', passport.authenticate('linkedin'));

app.get('/linkedin/redirect', passport.authenticate('linkedin', {
		failureRedirect: `${FRONTEND_URL}/error`
	}),
  	(request, response) => {
		// Successful authentication, redirect home.
		response.redirect(`${FRONTEND_URL}/success`);
	}
);

// Google
app.get('/google', passport.authenticate('google', {
	scope: ['profile', 'email'],
	prompt: 'select_account'
}));

app.get('/google/redirect', passport.authenticate('google', {
		failureRedirect: `${FRONTEND_URL}/error`
	}),
	(request, response) => {
		response.redirect(`${FRONTEND_URL}/success`);
	}
);

// Refer to passportSetup.js as to why these are commented out.
// Facebook
// app.get('/facebook', passport.authenticate('facebook', {
// 	scope: ['email']
// }));

// app.get('/facebook/redirect', passport.authenticate('facebook', {
// 		failureRedirect: `${FRONTEND_URL}/error`
// 	}),
// 	(request, response) => {
// 		response.redirect(`${FRONTEND_URL}/success`);
// 	}
// );

// Twitter
// app.get('/twitter', passport.authenticate('twitter'));

// app.get('/twitter/redirect', passport.authenticate('twitter', {
// 		failureRedirect: `${FRONTEND_URL}/error`
// 	}),
// 	(request, response) => {
// 		response.redirect(`${FRONTEND_URL}/success`);
// 	}
// );

// Common
app.get('/logout', (request, response) => {
	request.logout();

	if (request.session) {
		request.session.destroy(err => {
			if (err) {
				response.status(500).json({ message: 'Error destroying session' });
			} else {
				response.status(200).clearCookie('viewee').json({ message: 'Signed out successfully' });
			};
		});
	} else {
		response.status(204).json({ message: 'Session does not exist' });
	};
});

// Might implement manual registering later on. Most likely not, but here is where they would go.

module.exports = app;