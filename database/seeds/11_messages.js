exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex("messages")
        .del()
        .then(function() {
            // Inserts seed entries
            return knex("messages").insert([{
                    user_send_id: "isuh2gsef",
                    user_receive_id: "vnsfh7sf",
                    message: "Hi there",
                    viewed: true,
                },
                {
                    user_send_id: "isuh2gsef",
                    user_receive_id: "vnsfh7sf",
                    message: "Welcome to Lambda alumni network",
                    viewed: true,
                },
                {
                    user_send_id: "vnsfh7sf",
                    user_receive_id: "isuh2gsef",
                    message: "thanks, looking forward to a great time.",
                    viewed: true,
                },
                {
                    user_send_id: "vnsfh7sf",
                    user_receive_id: "isuh2gsef",
                    message: "Do you know how to get a job?",
                    viewed: false,
                },
            ]);
        });
};