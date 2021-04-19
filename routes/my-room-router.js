const express = require('express');
const MyRoom = require('../models/my-room-model');
const app = express.Router();
const { verifyUser } = require('../middleware');


// fetch a users rooms
app.get('/:id', (req, res) => {
    const userId = req.params.id
    MyRoom.fetchFollowedRooms({user_id:userId})
    .then(rooms => {
        console.log({rooms})
        res.status(200).json({rooms})
    })
    .catch((err) =>{
        res.status(500).json(`${err}`)
    });
});

//add a room to a users rooms
app.post('/:userID/:roomID', (req, res) => {
    const { userID, roomID } = req.params;
    MyRoom.add(roomID, userID)
    .then(result => {
        console.log({result});
        res.status(201).json({result})
    })
    .catch((err) =>{
        res.status(500).json(`${err}`)
    })
});

//remove a room from a users rooms
app.delete('/:userID/:roomID', (req, res) => {
    const { userID, roomID } = req.params;

    MyRoom.remove(roomID, userID)
    .then(res => {
        res.status(200).json({ message: `Room ${roomID} has been removed from user ${userID}'s rooms.` });
    })
    .catch(error => {
        res.status(500).json({ error });
    });
});

module.exports = app;