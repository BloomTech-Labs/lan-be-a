
exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('my_room').del()
      .then(function () {
        // Inserts seed entries
        return knex('my_room').insert([
         {user_id:'isuh2gsef',room_id: 1},
         {user_id:'isuh2gsef',room_id: 2}, 
         {user_id:'isuh2gsef',room_id: 3}  
        ]);
      });
  };
  