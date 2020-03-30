const express = require('express');
const passport = require('passport');
const User = require('./auth-model');

const app = express.Router();

//twitter
app.get('/twitter', passport.authenticate('twitter'));

app.get('/twitter/redirect', passport.authenticate('twitter', { failureRedirect: 'https//localhost:3000/error' }), (request, response) => {
    response.redirect('http://localhost:3000/success');
});

// common
app.get('/success', (request, response) => {
	response.status(200).json({
		message: 'successfully fetched user object',
		user: {
            id: request.user.id,
            displayName: request.user.display_name,
            profilePicture: request.user.profile_picture,
            role: request.user.role,
            cohort: request.user.cohort
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