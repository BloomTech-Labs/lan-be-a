const database = require('../database/dbConfig');
const Permission =  require('./permission');

const fetchAll = () => {
  return database('roles as r')
    .leftJoin('permissions as p', 'p.id', 'r.permission_id')
    .select('r.name as role_name', 'r.id', 'p.UU', 'p.UC', 'p.UD', 'p.PCU', 'p.PCD', 'p.RC', 'p.RU', 'p.RD');
};

const fetch = id => {
  return database('roles as r')
    .leftJoin('permissions as p', 'p.id', 'r.permission_id')
    .where({'r.id': id})
    .select('r.name as role_name', 'r.id', 'p.UU', 'p.UC', 'p.UD', 'p.PCU', 'p.PCD', 'p.RC', 'p.RU', 'p.RD')
    .first();
};

//permissions expects an object like the following;
// {UU: boolean, UC: boolean, UD: boolean ...etc}
const create = async (name, permissions) => {
  const roleExists = await database('roles').where({name: name}).first();
  if(roleExists) return null;
  const permissionsId = await Permission.create(permissions);
  const newRole = await database('roles').insert({name: name, permission_id: permissionsId}).returning('*');
  return await fetch(newRole[0].id);
};

//updates object looks like this:
//{name: string, permissisons {UC: true, UU: true, etc...}}
const update = async (id, updates) => {
  let role = await database('roles').where({id: id}).update({name: updates.name}).returning('*');
  role = role[0];
  await Permission.update(role.permission_id, updates.permissions);
  return await fetch(role.id);
};

const remove = async id => {
  const protectedRoles = ['admin', 'moderator', 'alumni'];
  const isRoleProtected = await fetch(id);
  if(protectedRoles.includes(isRoleProtected.role_name)) return null;

  let role = await database('roles').where({id: id}).del().returning('*');
  role = role[0];
  await Permission.remove(role.permission_id);
  return role;
};

module.exports = {
  create,
  fetch,
  fetchAll,
  update,
  remove
};