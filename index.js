const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');

const jwt = require('jsonwebtoken');

const passportSetup = require('./config/passportSetup'); // eslint-disable-line

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const commentRouter = require('./routes/comment');
const adminRouter = require('./routes/admin');
const roomRouter = require('./routes/room-route');
const modRouter = require('./routes/flag-route');
const searchRouter = require('./routes/search-route');
const moderatorRouter = require('./routes/room-moderator');
const myRoomRouter = require('./routes/my-room-router');
const User = require('./models/user');

const app = express();

const FRONTEND_URL =
  process.env.FRONTEND_DEPLOYED_URL || 'http://localhost:3000';
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(helmet());

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Allow-Origin', FRONTEND_URL);
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
//   next();
// });

app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL,
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

const tokenVerified = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    const secret = process.env.SESSION_SECRET || 'potatoes in the sky';
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        // token is invalid
        res.status(401).json({ message: 'Invalid token' });
      } else {
        // token is valid
        req.user = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ message: 'Access Denied' });
  }
};

app.use('/api/auth', authRouter);

app.use('/api/user', tokenVerified, userRouter);
app.use('/api/post', tokenVerified, verifyRole, postRouter);
app.use('/api/comment', tokenVerified, verifyRole, commentRouter);
app.use('/api/room', tokenVerified, verifyRole, roomRouter);
app.use('/api/admin', tokenVerified, verifyRole, adminRouter);
app.use('/api/mod', tokenVerified, verifyRole, modRouter);
app.use('/api/search', tokenVerified, verifyRole, searchRouter);
app.use('/api/moderator', tokenVerified, verifyRole, moderatorRouter);
app.use('/api/myroom', tokenVerified,myRoomRouter);

app.get('/', (request, response) =>
  response.send({ message: 'Server working' })
);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
