const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Room = require('../models/room-model');
const Flag = require('../models/flag-model');
const RoomModerator = require('../models/room-moderator');

async function verifyUser(req, res, next) {
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

const verifyAdmin = (req, res, next) => {
  const { role_id } = req.user;

  if (role_id !== 3) {
    res.status(403).json({ message: 'Access denied.' });
  } else {
    next();
  }
};

const verifyModeratorOrAdmin = (req, res, next) => {
  const { role_id } = req.user;

  if (role_id > 1) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied.' });
  }
};

const findUserByDisplayName = async (req, res, next) => {
  if (!req.body.display_name){
    next();
  } else {
    const { display_name } = req.body;
    
    try {
      const match = await User.find({ display_name });
    
      if (match) {
        req.body.user_id = match.id;
        next();
      } else {
        res.status(400).json(`The user with display_name: ${display_name}, could not be found.`);
      }
    } catch (err) {
      res.status(500).json({ 
        message: 'There was a problem communicating with the server.',
        error: err.message
      });
    }
  }
};

const findRoomByRoomName = async (req, res, next) => {
  if (!req.body.room_name){
    next();
  } else {
    const { room_name } = req.body;
      
    try {
      const match = await Room.getRoomBy({ room_name });
      
      if (match) {
        req.body.room_id = match.id;
        next();
      } else {
        res.status(400).json(`The room_name: ${room_name}, could not be found.`);
      }
    } catch (err) {
      res.status(500).json({ 
        message: 'There was a problem communicating with the server.',
        error: err.message
      });
    }
  }
};

const findRoomModeratorPair = async (req, res, next) => {
  const { user_id, room_id } = req.body;

  if (!user_id || !room_id) {
    res.status(400).json({ message: 'Must designate moderator display_name and room_name to continue.' });
  } else {
    try {
      const pair = await RoomModerator.findRoomModeratorBy({ user_id, room_id });
      req.body.pair = pair;
      next();
    } catch (err) {
      res.status(500).json({
        message: 'There was a problem communicating with the server.',
        error: err.message
      });
    }
  }
};

const findReasonIdByReason = async (req, res, next) => {
  const { reason } = req.body;

  if (!reason) {
    res.status(400).json({ message: 'Must designate reason for flagging post.' });
  } else {
    const reasonData = await Flag.getReasonIdByReason(reason);
    req.body.reason_id = reasonData.id;
    next();
  }
};

const findIfPostLiked = async (req, res, next) => {
  const user_id = req.user.id;
  const post_id = req.params.id;

  if (!user_id || !post_id) {
    res.status(400).json({ message: 'A user_id required in request and post_id required in request params.' });
  } else {
    try {
      const pair = await Post.findPostLike(user_id, post_id);
      req.body.pair = pair;
      next();
    } catch (err) {
      res.status(500).json({
        message: 'There was a problem communicating with the server.',
        error: err.message
      });
    }
  }
};

const findIfCommentLiked = async (req, res, next) => {
  const user_id = req.user.id;
  const comment_id = req.params.id;

  if (!user_id || !comment_id) {
    res.status(400).json({ message: 'A user_id required in request and comment_id required in request params.' });
  } else {
    try {
      const pair = await Comment.findCommentLike(user_id, comment_id);
      req.body.pair = pair;
      next();
    } catch (err) {
      res.status(500).json({
        message: 'There was a problem communicating with the server.',
        error: err.message
      });
    }
  }
};

module.exports = {
  verifyUser,
  verifyAdmin,
  verifyModeratorOrAdmin,
  findUserByDisplayName,
  findRoomByRoomName,
  findRoomModeratorPair,
  findReasonIdByReason,
  findIfPostLiked,
  findIfCommentLiked
};
