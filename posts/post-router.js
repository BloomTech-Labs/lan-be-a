const express = require('express');
const Post = require('./post-model');

const app = express.Router();

// create post
app.post('/', (request, response) => {
    Post.create({
        user_id: request.params.id,
        question: request.body.question,
        answer: request.body.answer,
        cohort: request.body.cohort,
        category: request.body.category
    })
        .then(res => response.status(200).json({message: 'post created successfully'}))
        .catch(err => {
            response.status(500).json({message: 'error creating post'});
            console.log(err);
        });
});

// fetch all posts
app.get('/', (request, response) => {
    Post.fetch()
        .then(res => response.status(200).json(res))
        .catch(err => {
            response.status(500).json({message: 'error fetching posts'});
            console.log(err);
        });
});

module.exports = app;