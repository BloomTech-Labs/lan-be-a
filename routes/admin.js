const express = require('express');
const Admin = require('../models/admin');

const app = express.Router();

app.get('/users', async (req, res) => {
  try {
    const data = await Admin.getUsers();
    res.status(200).json(data);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/rooms', async (req, res) => {
  try {
    const data = await Admin.getRooms();
    res.status(200).json(data);
  } catch(err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = app;
