const express = require('express');
const app = express.Router();
const RoomModerator = require('../models/room-moderator');

const {
  displayNameToId,
  roomNameToId,
  findRoomModeratorPair
} = require('../middleware');

// Add a moderator to a room
app.post('/', displayNameToId, roomNameToId, findRoomModeratorPair, (req, res) => {
  const { role_id } = req.user;
  const { display_name, room_name, pair, user_id, room_id } = req.body;
  
  if (role_id !== 3) {
    res.status(403).json({ message: 'Access denied.' });
  } else {
    if (pair.length === 0) {
      RoomModerator.addRoomModerator(user_id, room_id)
        .then((data) => {
          res.status(201).json(data);
        })
        .catch((err) => {
          res.status(500).json({ 
            message: `Failed to add moderator display_name: ${display_name} to room_name: ${room_name}.`, 
            error: err.message
          });
        });
    } else {
      res.status(400).json({ 
        message: `The moderator display_name: ${display_name} is already assigned to room_name: ${room_name}.` 
      });
    }
  }
});
  
// Find a room and all added moderators or a moderator and all assigned rooms
app.get('/findBy', displayNameToId, roomNameToId, (req, res) => {
  const { role_id } = req.user;
  const { display_name, room_name, user_id, room_id } = req.body;

  if (role_id != 3) {
    res.status(403).json({ message: 'Access denied.' });
  } else {
    if (!user_id && !room_id) {
      res.status(400).json({ 
        message: 'Must designate moderator display_name or room_name or both to continue.' 
      });
    } else if (user_id && room_id) {
      RoomModerator.findRoomModeratorBy({ user_id, room_id })
        .then(data => {
          return res.status(200).json(data);
        })
        .catch(err => {
          res.status(500).json({ 
            message: `Failed to retrieve room_name: ${room_name}, for moderator display_name: ${display_name}.`,
            error: err.message
          });
        });
    } else if (user_id) {
      RoomModerator.findRoomModeratorBy({ user_id })
        .then(data => {
          return res.status(200).json(data);
        })
        .catch(err => {
          res.status(500).json({ 
            message: `Failed to retrieve rooms for moderator display_name: ${display_name}.`,
            error: err.message
          });
        });
    } else {
      RoomModerator.findRoomModeratorBy({ room_id })
        .then(data => {
          return res.status(200).json(data);
        })
        .catch(err => {
          return res.status(200).json({
            message: `Failed to retrieve moderators for room_name: ${room_name}.`,
            error: err.message
          });
        });
    }
  }
});
  
app.delete('/', displayNameToId, roomNameToId, findRoomModeratorPair, (req, res) => {
  const { role_id } = req.user;
  const { display_name, room_name, pair, user_id, room_id } = req.body;

  if (role_id != 3) {
    res.status(403).json({ message: 'Access denied.' });
  } else {
    if (pair.length === 1) {
      RoomModerator.removeRoomModerator(user_id, room_id)
        .then(() => {
          res.status(200).json({
            message: `Moderator display_name: ${display_name} was removed from room_name: ${room_name}.`
          });
        })
        .catch(err => {
          res.status(400).json({ 
            message: 'Failed to remove moderator from the room.',
            error: err.message
          });
        });
    } else {
      res.status(400).json({ 
        message: `The moderator display_name: ${display_name} is not assigned to room_name: ${room_name} ` 
      });
    }
  }
});
  
module.exports = app;
