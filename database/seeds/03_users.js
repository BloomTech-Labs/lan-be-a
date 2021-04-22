
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 'isuh2gsef', email: 'tim@hotmail.com', display_name: 'tim', profile_picture: 'https://cdn.pixabay.com/photo/2016/07/27/08/03/child-1544790_960_720.jpg', track: 'web', onboarded: true, role_id: 1, following: 1},
        {id: 'vnsfh7sf', email: 'brad@gmail.com', display_name: 'brad', profile_picture: 'https://cdn.pixabay.com/photo/2019/02/13/18/46/model-3994985_1280.jpg', track: 'web', onboarded: true, role_id: 3, following: 1},
        {id: 'su6hgsf', email: 'ryan@aol.com', display_name: 'ryan', profile_picture: 'https://cdn.pixabay.com/photo/2017/08/15/14/46/headshot-2644201_1280.jpg', track: 'web', onboarded: true, role_id: 2},
        {id: 'sefu2hsef', email: 'rex@gmail.com', display_name: 'rex', profile_picture: 'https://cdn.pixabay.com/photo/2016/11/08/00/21/autumn-1807190_960_720.jpg', track: 'web', onboarded: true, role_id: 1},
        {id: 'woie9yth', email: 'cyan@gmail.com', display_name: 'cyan', profile_picture: 'https://cdn.pixabay.com/photo/2020/10/30/16/22/man-5699025_960_720.jpg', track: 'web', onboarded: true, role_id: 3},
        {id: 'v2nsiduhwf', email: 'renee@yahoo.com', display_name: 'renee', profile_picture: 'https://cdn.pixabay.com/photo/2019/01/19/17/52/headshots-3942187_960_720.jpg', track: 'web', onboarded: true, role_id: 2},
        {id: 'woiesnf4dfn', email: 'ilene@cnn.com', display_name: 'ilene', profile_picture: 'https://cdn.pixabay.com/photo/2020/02/17/05/48/fuji-4855493_960_720.jpg', track: 'web', onboarded: true, role_id: 1},
        {id: 'uvhsd5ifuh', email: 'mike@lambdastudents.com', display_name: 'mike', profile_picture: 'https://cdn.pixabay.com/photo/2019/11/30/19/35/border-collie-4664013_960_720.jpg', track: 'web', onboarded: true, role_id: 3},
        {id: 'njksvh2if', email: 'fred@aol.com', display_name: 'fred', profile_picture: 'https://cdn.pixabay.com/photo/2017/03/08/03/27/comedian-2125853_1280.jpg', track: 'web', onboarded: true, role_id: 1},
        {id: 'nlsdkfj09284', email: 'trystan@aol.com', display_name: 'trystan', profile_picture: 'https://cdn.pixabay.com/photo/2017/12/19/18/02/boy-3028416_1280.jpg', track: 'web', onboarded: true, role_id: 1}
      ]);
    });
};
