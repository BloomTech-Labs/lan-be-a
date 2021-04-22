exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("following")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("following").insert([
        {
          user_id: "isuh2gsef",
          following_id: "vnsfh7sf",
        },
        {
          user_id: "vnsfh7sf",
          following_id: "isuh2gsef",
        },
      ]);
    });
};
