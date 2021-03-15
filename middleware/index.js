const User = require('../models/user');
const Room = require('../models/room-model');
const RoomModerator = require('../models/room-moderator');

const displayNameToId = async (req, res, next) => {
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

const roomNameToId = async (req, res, next) => {
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

module.exports = {
  displayNameToId,
  roomNameToId,
  findRoomModeratorPair
};
