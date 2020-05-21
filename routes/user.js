const express = require('express');
const User = require('../models/user');

const app = express.Router();

// Fetch logged in user object
app.get('/', (request, response) => {
	response.status(200).json({
		message: 'Successfully fetched user object',
		user: {
			// Email and total likes gotten also available
            id: request.user.id,
			displayName: request.user.display_name,
			profilePicture: request.user.profile_picture,
            track: request.user.track
        }
	});
});

// Fetch all of a single user's posts and comments
// Can model helper function be consolidated?
app.get('/:id', (request, response) => {
    const userID = request.params.id;

    User.find({ id: userID })
        .then(user => {
            User.fetchPosts(userID)
                .then(posts => {
                    User.fetchComments(userID)
                        .then(comments => response.status(200).json({ ...user, posts, comments }))
                })
        })
        .catch(err => {
            console.log(err);
            response.status(500).json({ message: 'Error fetching user' });
        });
});

// Update user's display name
app.put('/displayname', (request, response) => {
    const { userID, displayName } = request.body;

    User.update(userID, { display_name: displayName })
        .then(res => response.status(200).json({ message: 'Updated user\'s display name successfully' }))
        .catch(err => response.status(500).json({ message: 'Error updating user\'s display name' }));
});

// Set and update user's track
app.put('/track', (request, response) => {
	userID = request.user.id;
	track = request.body.track;
	token = request.body.token;

	if (track === 'Career Coach') {
		if (token === process.env.VIEWEE_TOKEN) {
			User.update(userID, { track })
				.then(res => response.status(200).json({ message: 'Updated user\'s track successfully' }))
				.catch(err => {
					console.log(err);
					response.status(500).json({ message: 'Error updating user track' });
				});
		} else {
			response.status(500).json({ message: 'Invalid viewee token' });
		};
	} else {
		User.update(userID, { track })
			.then(res => response.status(200).json({ message: 'Updated user\'s track successfully' }))
			.catch(err => {
				console.log(err);
				response.status(500).json({ message: 'Error updating user track' });
			});
	};
});

module.exports = app;