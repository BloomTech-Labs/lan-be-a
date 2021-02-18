
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('rooms_to_posts').del()
    .then(function () {
      // Inserts seed entries
      return knex('rooms_to_posts').insert([
        {id: 1, post_id: 1, room_id: 1},
        {id: 2, post_id: 2, room_id: 2},
        {id: 3, post_id: 3, room_id: 3},
        {id: 4, post_id: 4, room_id: 4},
        {id: 5, post_id: 5, room_id: 5},
        {id: 6, post_id: 6, room_id: 6},
        {id: 7, post_id: 7, room_id: 7},
        {id: 8, post_id: 8, room_id: 8},
        {id: 9, post_id: 9, room_id: 9},
        {id: 10, post_id: 10, room_id: 10},
        {id: 11, post_id: 11, room_id: 1},
        {id: 12, post_id: 12, room_id: 2},
        {id: 13, post_id: 13, room_id: 3},
        {id: 14, post_id: 14, room_id: 4},
        {id: 15, post_id: 15, room_id: 5},
        {id: 16, post_id: 16, room_id: 6},
        {id: 17, post_id: 17, room_id: 7},
        {id: 18, post_id: 18, room_id: 8},
        {id: 19, post_id: 19, room_id: 9},
        {id: 20, post_id: 20, room_id: 10},
        {id: 21, post_id: 21, room_id: 1},
        {id: 22, post_id: 22, room_id: 2},
        {id: 23, post_id: 23, room_id: 3},
        {id: 24, post_id: 24, room_id: 4},
        {id: 25, post_id: 25, room_id: 5},
        {id: 26, post_id: 26, room_id: 6},
        {id: 27, post_id: 27, room_id: 7},
        {id: 28, post_id: 28, room_id: 8},
        {id: 29, post_id: 29, room_id: 9},
        {id: 30, post_id: 30, room_id: 10},
      ]);
    });
};
