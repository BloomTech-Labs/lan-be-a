const express = require('express');
const Post = require('./post-model');

const app = express.Router();

// fetch all posts
app.get('/posts', (request, response) => {
    Post.fetchPosts()
        .then(res => response.status(200).json(res))
        .catch(err => {
            response.status(500).json({message: 'error fetching posts'});
            console.log(err);
        });
});

// create post
app.post('/:id/posts', (request, response) => {
    Post.createPost({
        user_id: request.params.id,
        question: request.body.question,
        cohort: request.body.cohort,
        category: request.body.category
    })
        .then(res => response.status(200).json({message: 'post created successfully'}))
        .catch(err => {
            response.status(500).json({message: 'error creating post'});
            console.log(err);
        });
});

module.exports = app;