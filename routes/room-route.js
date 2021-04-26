const express = require("express");
const app = express.Router();
const Room = require("../models/room-model");

const { verifyAdmin } = require("../middleware");

// Get all rooms
app.get("/", (req, res) => {
  Room.getAllRooms()
    .then((rooms) => {
      res.status(200).json(rooms);
    })
    .catch(() => {
      res.status(500).json({ message: "Could not retrieve rooms" });
    });
});

// Get all private rooms
app.get("/private", (req, res) => {
  Room.getAllPrivateRooms()
    .then((rooms) => {
      res.status(200).json(rooms);
    })
    .catch(() => {
      res.status(500).json({ message: "Could not retrieve private rooms" });
    });
});

// Get all private rooms
app.get("/private/:roomId", (req, res) => {
  const { roomId } = req.params;

  Room.getPrivateRoom(roomId)
    .then((room) => {
      if (room.private) res.status(200).json(room);
      else res.status(403).json({ message: "room is not private" });
    })
    .catch(() => {
      res.status(500).json({ message: "Could not retrieve private rooms" });
    });
});

// Create a room
app.post("/", (req, res) => {
  const { room_name, description } = req.body;
  if (!room_name || !description) {
    res.status(400).json({ message: "Must designate room name to continue." });
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

// Create a private room
app.post("/private", (req, res) => {
  const { room_name, description } = req.body;
  if (!room_name || !description) {
    res.status(400).json({ message: "Must designate room name to continue." });
  } else {
    Room.addPrivateRoom(req.body)
      .then((data) => {
        res.status(201).json(data);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  }
});

// Add users to a private room
app.post("/private/:roomId/users", (req, res) => {
  const { roomId } = req.params;
  const { users } = req.body;
  const promises = [];

  if (users) {
    users.forEach((userId) => {
      Room.addUserPrivateRoom(roomId, userId)
        .then((data) => {
          promises.push(data);
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    });
  }

  Promise.all(promises)
    .then(() => {
      res.status(200).json({ message: "Users added successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

// Remove users from a private room
app.delete("/private/:roomId/users", (req, res) => {
  const { roomId } = req.params;
  const { users } = req.body;
  const promises = [];

  if (users) {
    users.forEach((userId) => {
      Room.removeUserPrivateRoom(roomId, userId)
        .then((data) => {
          promises.push(data);
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    });
  }

  Promise.all(promises)
    .then(() => {
      res.status(200).json({ message: "Users removed successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

// Delete a private room
app.delete("/private/:roomId", async (req, res) => {
  const { roomId } = req.params;

  const { users } = await Room.getPrivateRoom(roomId);

  const promises = [];
  if (users) {
    users.forEach((userId) => {
      Room.removeUserPrivateRoom(roomId, userId)
        .then((data) => {
          promises.push(data);
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    });
  }

  Promise.all(promises)
    .then(() => {
      Room.remove(roomId)
        .then(() => {
          res
            .status(200)
            .json({
              message: `Private room ${roomId} has been removed from DB`,
            });
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

// Delete a room
app.delete("/:id", (req, res) => {
  const roomId = req.params.id;
  Room.remove(roomId)
    .then(() => {
      res
        .status(200)
        .json({ message: `room ${roomId} has been removed from DB` });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

// Fetch posts in a room ordered by most recent
app.get("/:id/recent", (request, response) => {
  const page = request.query.page || 1;
  const limit = request.query.limit || 10;
  const user_id = request.user.id;

  Room.fetchRecentByRoomId(request.params.id, page, limit, user_id)
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
app.get("/:id/popular", (request, response) => {
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
app.get("/:id/search", (request, response) => {
  Room.searchWithRoomId(request.params.id)
    .then((data) => response.status(200).json(data))
    .catch(() =>
      response.status(400).json({
        message: `Failed to fetch all posts for room with ID:${request.params.id}`,
      })
    );
});

module.exports = app;
