
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('flagged_comments').del()
    .then(function () {
      // Inserts seed entries
      return knex('flagged_comments').insert([
        {comment_id: 11, user_id: 'isuh2gsef', reviewed: false},
        {comment_id: 18, user_id: 'sefu2hsef', reviewed: false},
        {comment_id: 25, user_id: 'v2nsiduhwf', reviewed: false},
        {comment_id: 37, user_id: 'njksvh2if', reviewed: false},
        {comment_id: 48, user_id: 'uvhsd5ifuh', reviewed: false},
        {comment_id: 53, user_id: 'nlsdkfj09284', reviewed: false},
      ]);
    });
};
