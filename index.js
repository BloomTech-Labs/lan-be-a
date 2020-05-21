const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const passportSetup = require('./config/passportSetup');
const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);
const config = require('./database/dbConfig');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const commentRouter = require('./routes/comment');

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
            // Set to true once in production
        },
        store: new knexSessionStore({
            knex: config
        })
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/comment', commentRouter);

app.get('/', (request, response) => response.send({ message: 'server working' }));

app.listen(5000, () => console.log('server listening on port 5000'));