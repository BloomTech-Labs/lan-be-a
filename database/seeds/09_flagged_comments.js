
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('flagged_comments').del()
    .then(function () {
      // Inserts seed entries
      return knex('flagged_comments').insert([
        {comment_id: 11, user_id: 'isuh2gsef', reason_id: 1, reviewed: false},
        {comment_id: 18, user_id: 'sefu2hsef', reason_id: 1, reviewed: false},
        {comment_id: 25, user_id: 'v2nsiduhwf', reason_id: 2, reviewed: false},
        {comment_id: 37, user_id: 'njksvh2if', reason_id: 2, reviewed: false},
        {comment_id: 48, user_id: 'uvhsd5ifuh', reason_id: 3, reviewed: false},
        {comment_id: 53, user_id: 'nlsdkfj09284', reason_id: 3, reviewed: false},
      ]);
    });
};
