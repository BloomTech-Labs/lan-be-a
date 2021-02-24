const express = require('express');
const Admin = require('../models/admin');
const app = express.Router();

// Get all users
app.get('/users', async (req, res) => {
  if (req.user.role_id === 3) {
    try {
      const data = await Admin.getUsers();
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  } else {
    res
      .status(400)
      .json({ message: 'You do not have the correct role to do this' });
  }
});

// Delete a user
app.delete('/users/:id', (request, response) => {
  const userID = request.params.id;
  if (request.user.role_id === 3) {
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
  } else {
    response
      .status(400)
      .json({ message: 'You do not have the correct role to do this' });
  }
});

// Update a users role
app.put('/users/:user_id/:role_id', (request, response) => {
  if (request.user.role_id === 3) {
    Admin.userSetRole(request.params.user_id, request.params.role_id)
      .then((data) => response.status(200).json(data))
      .catch((err) => {
        response
          .status(500)
          .json({ message: 'Error updating user\'s role', error: err });
      });
  } else {
    response
      .status(400)
      .json({ message: 'You do not have the correct role to do this' });
  }
});

// Create a new role
app.post('/roles/:role', (request, response) => {
  if (request.user.role_id === 3) {
    Admin.roleCreate(request.params.role).then((new_role) =>
      response.status(200).json(new_role)
    );
  } else {
    response
      .status(400)
      .json({ message: 'You do not have the correct role to do this' });
  }
});

// Update a role
app.put('/roles/:role_id/:role_name', (request, response) => {
  if (request.user.role_id === 3) {
    Admin.roleUpdate(request.params.role_id, request.params.role_name)
      .then((data) => response.status(200).json(data))
      .catch((err) => {
        response
          .status(500)
          .json({ message: 'Error updating role', error: err });
      });
  } else {
    response
      .status(400)
      .json({ message: 'You do not have the correct role to do this' });
  }
});

// Delete a role
app.delete('/roles/:role_id', (request, response) => {
  if (request.user.role_id === 3) {
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
  } else {
    response
      .status(400)
      .json({ message: 'You do not have the correct role to do this' });
  }
});

// Get all rooms
app.get('/rooms', async (req, res) => {
  if (req.user.role_id === 3) {
    try {
      const data = await Admin.getRooms();
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  } else {
    res
      .status(400)
      .json({ message: 'You do not have the correct role to do this' });
  }
});

// Update a room
app.put('/rooms/:id', async (req, res) => {
  const { role_id } = req.user;
  const { room_name, description } = req.body;
  const room_id = req.params.id;
  if (role_id !== 3) {
    res.status(403).json({ message: 'Access denied' });
  } else if (!room_name || !description) {
    res.status(400).json({ message: 'missing room_name or description' });
  } else {
    let payload = { room_name: room_name, description: description };
    await Admin.roomUpdate(room_id, payload);
    res.status(200).json({ message: 'Room has been updated'});
  }
});

module.exports = app;
