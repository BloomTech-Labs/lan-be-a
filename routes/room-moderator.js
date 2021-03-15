const express = require('express');
const app = express.Router();
const RoomModerator = require('../models/room-moderator');

// Add a moderator to a room
app.post('/', (req, res) => {
  const { role_id } = req.user;
  const { user_id, room_id } = req.body;
  if (role_id !== 3) {
    res.status(403).json({ message: 'Access denied.' });
  } else if (!room_id) {
    res.status(400).json({ message: 'Must designate user_id and room_id to continue.' });
  } else {
    RoomModerator.addRoomModerator(user_id, room_id)
      .then((data) => {
        res.status(201).json(data);
      })
      .catch((err) => {
        res.status(500).json({ 
          message: 'Failed to add moderator to room.', 
          error: err.message
        });
      });
  }
});
  
// Find all rooms and all added moderators
app.get('/', (req, res) => {
  const { role_id } = req.user;
  // const page = req.query.page || 1;    --- add limiters
  // const limit = req.query.limit || 10;
  if (role_id != 3) {
    res.status(403).json({ message: 'Access denied.' });
  } else {
    RoomModerator.findRoomModerator(/* page, limit */)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json({ 
          message: 'Failed to retrieve rooms and moderators.',
          error: err.message 
        });
      });
  }
});
  
// Find a room and all added moderators or a moderator and all assigned rooms
app.get('/findBy', (req, res) => {
  const { role_id } = req.user;
  const { user_id, room_id } = req.body;
  // const page = req.query.page || 1;    --- add limiters
  // const limit = req.query.limit || 10;
  if (role_id != 3) {
    res.status(403).json({ message: 'Access denied.' });
  } else {
    if (!user_id && !room_id) {
      res.status(400).json({ message: 'Must designate user_id or room_id to continue.' });
    } else if (user_id && room_id) {
      RoomModerator.findRoomModeratorBy({ user_id, room_id }, /* page, limit */)
        .then(data => {
          return res.status(200).json(data);
        })
        .catch(err => {
          res.status(500).json({ 
            message: `Failed to retrieve rooms for moderator with ID: ${user_id}`,
            error: err.message
          });
        });
    } else if (user_id) {
      RoomModerator.findRoomModeratorBy({ user_id }, /* page, limit */)
        .then(data => {
          return res.status(200).json(data);
        })
        .catch(err => {
          res.status(500).json({ 
            message: `Failed to retrieve rooms for moderator with ID: ${user_id}`,
            error: err.message
          });
        });
    } else {
      RoomModerator.findRoomModeratorBy({ room_id }, /* page, limit */)
        .then(data => {
          return res.status(200).json(data);
        })
        .catch(err => {
          return res.status(200).json({
            message: `Failed to retrieve moderators for room with ID: ${room_id}`,
            error: err.message
          });
        });
    }
  }
});
  
app.delete('/', (req, res) => {
  const { user_id, room_id } = req.body;
  RoomModerator.removeRoomModerator(user_id, room_id)
    .then(() => {
      res.status(200).json(`Moderator ID: ${user_id} was removed from room ID: ${room_id}`);
    })
    .catch(err => {
      res.status(400).json({ 
        message: 'Failed to remove moderator from the room.',
        error: err.message
      });
    });
});
  
module.exports = app;
