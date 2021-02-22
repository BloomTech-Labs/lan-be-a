
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('rooms').del()
    .then(function () {
      // Inserts seed entries
      return knex('rooms').insert([
        {room_name: 'Announcements', description: 'This room is for any major announcements regarding the Lambda Alumni Network'},
        {room_name: 'Open Source', description: 'To help alumni gather and work together on open source projects'},
        {room_name: 'Events', description: 'Share, view, and make plans with other alumni for upcoming events'},
        {room_name: 'Algorithms', description: 'Drop some difficult coding challenges you have found and discuss solutions'},
        {room_name: 'Tech Help', description: 'Stuck on a specific technology, drop your issues and let the community help'},
        {room_name: 'Job Board', description: 'Is your company or someone you know hiring? Share with the community'},
        {room_name: 'New Tech', description: 'Learning a new technology, help out the community by dropping your insight'},
        {room_name: 'Interview Prep', description: 'Preparing for an interview? Check out some great resources to get you on the right track'},
        {room_name: 'Politics', description: 'Kepp it kind, keep it fun, this isn\'t the dinner table though'},
        {room_name: 'After Hours', description: 'A great place to hangout and get to know one another'},
      ]);
    });
};
