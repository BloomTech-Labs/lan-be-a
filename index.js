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
const moderatorRouter = require('./routes/room-moderator');

const User = require('./models/user');

const app = express();

const FRONTEND_URL =
  process.env.FRONTEND_DEPLOYED_URL || 'http://localhost:3000';
const PORT = process.env.PORT || 5000;

app.all('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json());
app.use(helmet());

app.all('/*', function(req, res, next) {
  
  next();
});
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', 'https://main.d37zm5ayhfot8q.amplifyapp.com');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});
app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL,
  })
);

app.set('trust proxy', 1);
console.log(process.env.SECURE_TRUE || false);
 
app.use(
  session({
    name: 'LAN',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
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
app.use('/api/moderator', verifyRole, moderatorRouter);

app.get('/', (request, response) =>
  response.send({ message: 'Server working' })
);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
