exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('roles').del()
    .then(async function () {
      // Inserts seed entries
      const permissions = await knex("permissions");
      return knex('roles').insert([
        {id: 1, role: 'admin', permission_id: permissions[0].id},
        {id: 2,role: 'moderator', permission_id: permissions[1].id},
        {id: 3,role: 'alumni', permission_id: permissions[3].id}       
      ]);
    });
};
