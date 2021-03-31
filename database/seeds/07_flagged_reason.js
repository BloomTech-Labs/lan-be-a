
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('flagged_reason').del()
    .then(function () {
      // Inserts seed entries
      return knex('flagged_reason').insert([
        {reason: 'Spam', weight: 2},
        {reason: 'Bullying or Harassment', weight: 2},
        {reason: 'Hate Speech or Symbols', weight: 2},
        {reason: 'Nudity or Sexual Content', weight: 2},
        {reason: 'I just dislike it', weight: 1},
        {reason: 'Other', weight: 1},
      ]);
    });
};
