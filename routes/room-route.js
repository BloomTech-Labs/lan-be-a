const express = require('express');
const app = express.Router();
const Room = require('../models/room-model');

// Get all rooms
app.get('/', (req, res) => {
  Room.getAllRooms()
    .then((rooms) => {
      res.status(200).json(rooms);
    })
    .catch(() => {
      res.status(500).json({ message: 'Could not retrieve rooms' });
    });
});

// Create a room
app.post('/', (req, res) => {
  const { role_id } = req.user;
  const { room_name, description } = req.body;
  if (role_id !== 3) {
    res.status(403).json({ message: 'Access denied.' });
  } else if (!room_name || !description) {
    res.status(400).json({ message: 'Must designate room name to continue.' });
  } else {
    Room.add(req.body)
      .then((data) => {
        res.status(201).json(data);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  }
});

// Delete a room
app.delete('/:id', (req, res) => {
  const { role_id } = req.user;
  const roomId = req.params.id;
  if (role_id != 3) {
    res.status(403).json({ message: 'Access denied.' });
  } else {
    Room.remove(roomId)
      .then(() => {
        res.status(200).json({ message: `room ${roomId} has been removed from DB` });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  }
});

// Fetch posts in a room ordered by most recent
app.get('/:id/recent', (request, response) => {
  const page = request.query.page || 1;
  const limit = request.query.limit || 10;
  Room.fetchRecentByRoomId(request.params.id, page, limit)
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((err) =>
      response.status(400).json({
        message: `Failed to fetch all posts for room with ID:${request.params.id}`,
        error: err,
      })
    );
});

// Fetch posts in a room ordered by most likes
app.get('/:id/popular', (request, response) => {
  const page = request.query.page || 1;
  const limit = request.query.limit || 10;
  Room.fetchPopularByRoomId(request.params.id, page, limit)
    .then((data) => response.status(200).json(data))
    .catch(() =>
      response.status(400).json({
        message: `Failed to fetch all posts for room with ID:${request.params.id}`,
      })
    );
});

// Fetch posts from room based on user search input
app.get('/:id/search', (request, response) => {
  Room.searchWithRoomId(request.params.id)
    .then((data) => response.status(200).json(data))
    .catch(() =>
      response.status(400).json({
        message: `Failed to fetch all posts for room with ID:${request.params.id}`,
      })
    );
});

// Add a moderator to a room
app.post('/moderator', (req, res) => {
  const { role_id } = req.user;
  const { user_id, room_id } = req.body;
  if (role_id !== 3) {
    res.status(403).json({ message: 'Access denied.' });
  } else if (!room_id) {
    res.status(400).json({ message: 'Must designate user_id and room_id to continue.' });
  } else {
    Room.addRoomModerator(user_id, room_id)
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
app.get('/moderator', (req, res) => {
  const { role_id } = req.user;
  // const page = req.query.page || 1;    --- add limiters
  // const limit = req.query.limit || 10;
  if (role_id != 3) {
    res.status(403).json({ message: 'Access denied.' });
  } else {
    Room.findRoomModerator(/* page, limit */)
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
app.get('/moderatorBy/', (req, res) => {
  const { role_id } = req.user;
  const { user_id, room_id } = req.body;
  // const page = req.query.page || 1;    --- add limiters
  // const limit = req.query.limit || 10;
  if (role_id != 3) {
    res.status(403).json({ message: 'Access denied.' });
  } else {
    if (!user_id && !room_id) {
      res.status(400).json({ message: 'Must designate user_id or room_id to continue.' });
    } else if (user_id) {
      Room.findRoomModeratorBy({ user_id }, /* page, limit */)
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
      Room.findRoomModeratorBy({ room_id }, /* page, limit */)
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

module.exports = app;
