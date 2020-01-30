const express = require('express');
const authRouter = require('../auth/authRouter');
const postsRouter = require('../posts/postsRouter');

const app = express();

app.get('/', (request, response) => {
    response.send({message: 'server working'});
});

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api', postsRouter);

module.exports = app;