const express = require('express');
const authRouter = require('../auth/auth-router');
const postRouter = require('../posts/post-router');

const app = express();

app.get('/', (request, response) => {
    response.send({message: 'server working'});
});

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api', postRouter);

module.exports = app;