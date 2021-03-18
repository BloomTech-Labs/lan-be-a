const express = require('express');
const Admin = require('../models/admin');
const app = express.Router();

const { verifyAdmin } = require('../middleware');

// Get all users
app.get('/users', verifyAdmin, async (req, res) => {
  try {
    const data = await Admin.getUsers();
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// Delete a user
app.delete('/users/:id', verifyAdmin, (request, response) => {
  const userID = request.params.id;

  Admin.userDelete(userID)
    .then(() => {
      response.status(200).json({
        message: `Successfully removed user with ID: ${userID}`,
      });
    })
    .catch((err) => {
      response
        .status(500)
        .json({ message: 'Unable to delete user', error: err });
    });
});

// Update a users role
app.put('/users/:user_id/:role_id', verifyAdmin, (request, response) => {
  Admin.userSetRole(request.params.user_id, request.params.role_id)
    .then((data) => response.status(200).json(data))
    .catch((err) => {
      response
        .status(500)
        .json({ message: 'Error updating user\'s role', error: err });
    });
});

// Create a new role
app.post('/roles/:role', verifyAdmin, (request, response) => {
  Admin.roleCreate(request.params.role).then((new_role) =>
    response.status(200).json(new_role)
  );
});

// Update a role
app.put('/roles/:role_id/:role_name', verifyAdmin, (request, response) => {
  Admin.roleUpdate(request.params.role_id, request.params.role_name)
    .then((data) => response.status(200).json(data))
    .catch((err) => {
      response
        .status(500)
        .json({ message: 'Error updating role', error: err });
    });
});

// Delete a role
app.delete('/roles/:role_id', verifyAdmin, (request, response) => {
  Admin.roleDelete(request.params.role_id)
    .then(() =>
      response.status(200).json({
        message: `Successfully removed role with ID: ${request.params.role_id}`,
      })
    )
    .catch((err) => {
      response
        .status(500)
        .json({ message: 'Unable to delete role', error: err });
    });
});

// Get all rooms
app.get('/rooms', verifyAdmin, async (req, res) => {
  try {
    const data = await Admin.getRooms();
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// Update a room
app.put('/rooms/:id', verifyAdmin, async (req, res) => {
  const { room_name, description } = req.body;
  const room_id = req.params.id;
  if (!room_name || !description) {
    res.status(400).json({ message: 'missing room_name or description' });
  } else {
    let payload = { room_name: room_name, description: description };
    await Admin.roomUpdate(room_id, payload);
    res.status(200).json({ message: 'Room has been updated'});
  }
});

module.exports = app;
