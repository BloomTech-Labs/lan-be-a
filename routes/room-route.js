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
  Room.fetchRecentByRoomId(request.params.id)
    .then((data) => response.status(200).json(data))
    .catch((err) =>
      response.status(400).json({
        message: `Failed to fetch all posts for room with ID:${request.params.id}`,
        error: err,
      })
    );
});

// Fetch posts in a room ordered by most likes
app.get('/:id/popular', (request, response) => {
  Room.fetchPopularByRoomId(request.params.id)
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

module.exports = app;
