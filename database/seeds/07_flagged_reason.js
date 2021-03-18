
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('flagged_reason').del()
    .then(function () {
      // Inserts seed entries
      return knex('flagged_reason').insert([
        {id: 1, reason: 'Reason 1', weight: 1},
        {id: 2, reason: 'Reason 2', weight: 2},
        {id: 3, reason: 'Reason 3', weight: 3},
      ]);
    });
};
