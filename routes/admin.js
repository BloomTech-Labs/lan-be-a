const express = require('express');
const Admin = require('../models/admin');

const app = express.Router();

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

// updating a created user's role given the User's ID and the role you'd like to switch it to
app.put('/users/:user_id/:role_id', (request, response) => {
  if (request.user.role_id === 3) {
    Admin.userSetRole(request.params.user_id, request.params.role_id)
      .then((data) => response.status(200).json(data))
      .catch((err) => {
        response
          .status(500)
          .json({ message: "Error updating user's role", error: err });
      });
  } else {
    response
      .status(400)
      .json({ message: 'You do not have the correct role to do this' });
  }
});

// deleting a user from the database, need to later refactor to either move to a different table or toggle something to hide user
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

// creating a new role given a unique name
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

// updating a role given the role's ID and the new name
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

// deleting an old role given the role ID and correct authentication level
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

module.exports = app;
