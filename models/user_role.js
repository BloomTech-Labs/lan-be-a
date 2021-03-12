const database = require('../database/dbConfig');
const Role = require("./role");

const create = async (user_id, role_id) => {
    const role = await Role.fetch(role_id);
    return database("user_roles").insert({user_id: user_id, role_id: role.id}).returning("*");
}

const fetch = async (user_id) => {
    return database("user_roles as ur")
    .leftJoin("roles as r", "ur.role_id", "r.id")
    .leftJoin("permissions as p", "p.id", "r.permission_id")
    .where({user_id: user_id})
    .select("r.name as role_name", "r.id", "p.UU", "p.UC", "p.UD", "p.PCU", "p.PCD", "p.RC", "p.RU", "p.RD")
    .first();
}

const update = async (user_id, role_id) => {
    const role = await Role.fetch(role_id);
    return database("user_roles").where({user_id: user_id}).update({
        role_id: role.id
    });
}

module.exports = {
    create,
    fetch,
    update
}