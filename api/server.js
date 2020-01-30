const express = require('express');
const authRouter = require('../auth/authRouter');
const postsRouter = require('../posts/postsRouter');

const app = express();

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api', postsRouter);

module.exports = app;