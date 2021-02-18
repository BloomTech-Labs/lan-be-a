
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('rooms').del()
    .then(function () {
      // Inserts seed entries
      return knex('rooms').insert([
        {id: 1, room_name: 'Announcements', description: 'This room is for any major announcements regarding the Lambda Alumni Network'},
        {id: 2, room_name: 'Open Source', description: 'To help alumni gather and work together on open source projects'},
        {id: 3, room_name: 'Events', description: 'Share, view, and make plans with other alumni for upcoming events'},
        {id: 4, room_name: 'Algorithms', description: 'Drop some difficult coding challenges you have found and discuss solutions'},
        {id: 5, room_name: 'Tech Help', description: 'Stuck on a specific technology, drop your issues and let the community help'},
        {id: 6, room_name: 'Job Board', description: 'Is your company or someone you know hiring? Share with the community'},
        {id: 7, room_name: 'New Tech', description: 'Learning a new technology, help out the community by dropping your insight'},
        {id: 8, room_name: 'Interview Prep', description: 'Preparing for an interview? Check out some great resources to get you on the right track'},
        {id: 9, room_name: 'Politics', description: 'Kepp it kind, keep it fun, this isn\'t the dinner table though'},
        {id: 10, room_name: 'After Hours', description: 'A great place to hangout and get to know one another'},
      ]);
    });
};
