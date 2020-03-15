const express = require('express');
const Auth = require('./auth-model');

const app = express.Router();

// register
app.post('/register', (request, response) => {
    Auth.register(request.body)
        .then(res => response.status(200).json({message: 'registered successfully'}))
        .catch(err => {
            response.status(500).json({message: 'error registering user'});
            console.log(error);
        });
});

module.exports = app;