exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("rooms_to_users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("rooms_to_users").insert([
        { user_id: "isuh2gsef", room_id: 11 },
        { user_id: "nlsdkfj09284", room_id: 11 },
        { user_id: "woiesnf4dfn", room_id: 11 },
        { user_id: "su6hgsf", room_id: 11 },
      ]);
    });
};
