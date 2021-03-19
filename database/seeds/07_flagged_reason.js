
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('flagged_reason').del()
    .then(function () {
      // Inserts seed entries
      return knex('flagged_reason').insert([
        {reason: 'Spam', weight: 1},
        {reason: 'Bullying or Harrasment', weight: 2},
        {reason: 'Hate Speech or Symbols', weight: 3},
        {reason: 'Nudity or Sexual Content', weight: 4},
        {reason: 'I just dislike it', weight: 5},
        {reason: 'Other', weight: 6},
      ]);
    });
};
