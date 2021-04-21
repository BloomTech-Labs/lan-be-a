const database = require("../database/dbConfig");

//Gets all messages between two users
const fetchMessages = (user_send_id, user_receive_id) => {
    return database("messages")
        .where(user_send_id)
        .andWhere(user_receive_id)
        .orderBy("created_at", "desc");
};

// adds a new message
const addMessage = (user_send_id, user_receive_id, message) => {
    return database("messages")
        .insert({
            user_send_id,
            user_receive_id,
            message,
        })
        .returning("*");
};

// removes a message by id
const removeMessage = (message_id) => {
    return database("messages")
        .where({
            id: message_id,
        })
        .del();
};

module.exports = {
    fetchMessages,
    addMessage,
    removeMessage,
};