const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const passportSetup = require('../config/passport-setup');
const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);
const config = require('../data/config');
const authRouter = require('../auth/auth-router');
const postRouter = require('../posts/post-router');
const postLikeRouter = require('../post-likes/like-router');

const app = express();

app.use(express.json());
app.use(helmet());
app.use(
    cors({
        credentials: true,
        origin: 'http://localhost:3000'
    })
);
app.use(
    session({
        name: 'viewee',
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            secure: false
            // set to true once in production
        },
        store: new knexSessionStore({
            knex: config
        })
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);
app.use('/api/like', postLikeRouter);

app.get('/', (request, response) => response.send({ message: 'server working' }));

module.exports = app;