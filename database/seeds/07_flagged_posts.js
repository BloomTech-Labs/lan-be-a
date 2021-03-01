
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('flagged_posts').del()
    .then(function () {
      // Inserts seed entries
      return knex('flagged_posts').insert([
        {post_id: 7, user_id: 'isuh2gsef', reviewed: false},
        {post_id: 11, user_id: 'sefu2hsef', reviewed: false},
        {post_id: 15, user_id: 'v2nsiduhwf', reviewed: false},
        {post_id: 21, user_id: 'njksvh2if', reviewed: false},
        {post_id: 24, user_id: 'uvhsd5ifuh', reviewed: false},
        {post_id: 27, user_id: 'nlsdkfj09284', reviewed: false},
      ]);
    });
};
