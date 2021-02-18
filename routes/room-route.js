const express = require("express");
const app = express.Router();

const Room = require("../models/room-model");

app.get("/", (req, res) => {
  Room.getAllRooms()
    .then((rooms) => {
      res.status(200).json(rooms);
    })
    .catch(() => {
      res.status(500).json({ message: "Could not retrieve rooms" });
    });
});

//create a room if users role is 3(admin) and verify that room_name is in req
app.post("/", (req, res) => {
  const { role_id } = req.user;
  const { room_name } = req.body;
  if (role_id != 3) {
    res.status(403).json({ message: "Access denied." });
  } else if (!room_name) {
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

//delete a room if users role is 3(admin)
app.delete("/:id", (req, res) => {
  const { role_id } = req.user;
  const { roomId } = req.params.id;

  if (role_id != 3) {
    res.status(403).json({ message: "Access denied." });
  } else {
    Room.remove(roomId)
      .then((numberOfRoomsToRemove) => {
        res
          .status(200)
          .json({ message: `room ${roomId} has been removed from DB` });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  }
});

app.get("/:id/recent", (request, response) => {
  console.log(request.params);
  Room.fetchRecentByRoomId(request.params.id)
    .then((data) => response.status(200).json(data))
    .catch((err) =>
      response.status(400).json({
        message: `Failed to fetch all posts for room with ID:${request.params.id}`,
        error: err,
      })
    );
});

app.get("/:id/popular", (request, response) => {
  Room.fetchPopularByRoomId(request.params.id)
    .then((data) => response.status(200).json(data))
    .catch(() =>
      response.status(400).json({
        message: `Failed to fetch all posts for room with ID:${request.params.id}`,
      })
    );
});

app.get("/:id/search", (request, response) => {
  Room.fetchPopularByRoomId(request.params.id)
    .then((data) => response.status(200).json(data))
    .catch(() =>
      response.status(400).json({
        message: `Failed to fetch all posts for room with ID:${request.params.id}`,
      })
    );
});

module.exports = app;
