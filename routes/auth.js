const express = require('express');
const passport = require('passport');

const app = express.Router();

// Google
app.get('/google', passport.authenticate('google', {
	scope: ['profile', 'email'],
	prompt: 'select_account'
}));

app.get('/google/redirect', passport.authenticate('google', {
		failureRedirect: 'http://localhost:3000/error'
	}),
	(request, response) => {
		response.redirect('http://localhost:3000/success');
	}
);

// Facebook
app.get('/facebook', passport.authenticate('facebook', {
	scope: ['email']
}));

app.get('/facebook/redirect', passport.authenticate('facebook', {
		failureRedirect: 'http://localhost:3000/error'
	}),
	(request, response) => {
		response.redirect('http://localhost:3000/success');
	}
);

// Twitter
app.get('/twitter', passport.authenticate('twitter'));

app.get('/twitter/redirect', passport.authenticate('twitter', {
		failureRedirect: 'http://localhost:3000/error'
	}),
	(request, response) => {
		response.redirect('http://localhost:3000/success');
	}
);

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

// Might implement manual registering later on

module.exports = app;