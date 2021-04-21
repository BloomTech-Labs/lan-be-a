const express = require("express");
const messages = require("../models/message");
const app = express.Router();

// fetch all messages between two users
app.get("/send/:id1/receive/:id2", (req, res) => {
    const user1 = req.params.id1;
    const user2 = req.params.id2;

    messages
        .fetchMessages({ user_send_id: user1 }, { user_receive_id: user2 })
        .then((messages) => {
            res.status(200).json({ messages });
        })
        .catch((err) => {
            res.status(500).json(`${err}`);
        });
});

//add a room to a users rooms
app.post("/send/:id1/receive/:id2", (req, res) => {
    const user1 = req.params.id1;
    const user2 = req.params.id2;
    const message = req.body.message;
    messages
        .addMessage(user1, user2, message)
        .then((msg) => {
            res.status(200).json({ msg });
        })
        .catch((err) => {
            res.status(500).json(`${err}`);
        });
});

//remove a room from a users rooms
app.delete("/:messageId", (req, res) => {
    const messageId = req.params.messageId;

    messages
        .removeMessage(messageId)
        .then((msg) => {
            res.status(200).json({ msg });
        })
        .catch((err) => {
            res.status(500).json(`${err}`);
        });
});

module.exports = app;