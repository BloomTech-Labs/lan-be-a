
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('flagged_posts').del()
    .then(function () {
      // Inserts seed entries
      return knex('flagged_posts').insert([
        {post_id: 7, user_id: 'isuh2gsef', reason_id: 1, reviewed: false},
        {post_id: 11, user_id: 'sefu2hsef', reason_id: 1, reviewed: false},
        {post_id: 15, user_id: 'v2nsiduhwf', reason_id: 2, reviewed: false},
        {post_id: 21, user_id: 'njksvh2if', reason_id: 2, reviewed: false},
        {post_id: 24, user_id: 'uvhsd5ifuh', reason_id: 3, reviewed: false},
        {post_id: 27, user_id: 'nlsdkfj09284', reason_id: 3, reviewed: false},
      ]);
    });
};
