const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const passportSetup = require('./config/passportSetup'); // eslint-disable-line
const knexSessionStore = require('connect-session-knex')(session);
const config = require('./database/dbConfig');

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const commentRouter = require('./routes/comment');
const adminRouter = require('./routes/admin');
const roomRouter = require('./routes/room-route');
const modRouter = require('./routes/flag-route');
const searchRouter = require('./routes/search-route');

const User = require('./models/user');

const app = express();

const FRONTEND_URL =
  process.env.FRONTEND_DEPLOYED_URL || 'http://localhost:3000';
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL,
  })
);

app.use(
  session({
    // name: 'LAN',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: process.env.SECURE_TRUE || false, // Set to true once in production
      SameSite: 'none',
    },
    store: new knexSessionStore({
      knex: config,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

async function verifyRole(req, res, next) {
  const userId = req.user.id;
  try {
    const verifiedUser = await User.find({ id: userId });
    if (verifiedUser) {
      req.user.role_id = verifiedUser.role_id;
      return next();
    }
    return res.status(401).send('User does not exist');
  } catch (error) {
    return res.status(500).send('Database error');
  }
}

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/post', verifyRole, postRouter);
app.use('/api/comment', verifyRole, commentRouter);
app.use('/api/room', verifyRole, roomRouter);
app.use('/api/admin', verifyRole, adminRouter);
app.use('/api/mod', verifyRole, modRouter);
app.use('/api/search', verifyRole, searchRouter);

app.get('/', (request, response) =>
  response.send({ message: 'Server working' })
);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
