const express = require('express');
const passport = require('passport');
const User = require('./auth-model');

const app = express.Router();

// google
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

// facebook
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

//twitter
app.get('/twitter', passport.authenticate('twitter'));

app.get('/twitter/redirect', passport.authenticate('twitter', {
		failureRedirect: 'http://localhost:3000/error'
	}),
	(request, response) => {
		response.redirect('http://localhost:3000/success');
	}
);

// common
app.get('/success', (request, response) => {
	response.status(200).json({
		message: 'successfully fetched user object',
		user: {
            id: request.user.id,
            displayName: request.user.display_name,
            track: request.user.track
        }
	});
});

app.get('/logout', (request, response) => {
	request.logout();

	if (request.session) {
		request.session.destroy(err => {
			if (err) {
				response.status(500).json({ message: 'error destroying session' });
			} else {
				response.status(200).clearCookie('viewee').json({ message: 'successfully signed out' });
			}
		});
	} else {
		response.status(204).json({ message: 'session does not exist' });
	};
});

module.exports = app;