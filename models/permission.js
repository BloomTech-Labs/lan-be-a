const database = require('../database/dbConfig');

//expects an object like the following;
// {UU: boolean, UC: boolean, UD: boolean ...etc}
const create = async permission => {
    let permissions = await database('permissions').insert(permission).returning("id");
    return permissions[0];
}

const fetch = id => {
    return database('permissions').where({id: id}).first();
}

const update = (id, permission) => {
    return database("permissions").where({id: id}).update(permission).returning("id");
}

const remove = id => {
    return database("permissions").where({id: id}).del().returning("id");
}

module.exports = {
    create,
    fetch,
    update,
    remove
}