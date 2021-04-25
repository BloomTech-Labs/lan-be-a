const database = require("../database/dbConfig");

//fetch all bugs
const fetchBugs = () => {
  return database("bugs")
    .join("users", "bugs.user_id", "users.id")
    .select([
      "bugs.id",
      "bugs.user_id",
      "users.display_name",
      "users.profile_picture",
      "bugs.title",
      "bugs.description",
      "bugs.photo_url",
      "bugs.resolved",
      "bugs.created_at",
      "bugs.updated_at",
    ])
    .orderBy("created_at", "desc");
};

//fetch bug
const fetchBug = (id) => {
  return database("bugs")
    .where("bugs.id", id)
    .join("users", "bugs.user_id", "users.id")
    .select([
      "bugs.id",
      "bugs.user_id",
      "users.display_name",
      "users.profile_picture",
      "bugs.title",
      "bugs.description",
      "bugs.photo_url",
      "bugs.resolved",
      "bugs.created_at",
      "bugs.updated_at",
    ])
    .first();
};

//add a bug
const addBug = async (value) => {
  const [newBug] = await database("bugs").insert(value).returning("*");
  return newBug;
};

// Update a bug
const updateBug = (id, value) => {
  return database("bugs").where("id", id).update(value).returning("*");
};

// resolve a bug
const resolveBug = (id) => {
  return database("bugs")
    .where("id", id)
    .update({ resolved: true })
    .returning("*");
};

// open a bug
const openBug = (id) => {
  return database("bugs")
    .where("id", id)
    .update({ resolved: false })
    .returning("*");
};

// Delete a bug
const removeBug = (id) => {
  return database("bugs").where("id", id).del();
};

module.exports = {
  fetchBugs,
  fetchBug,
  addBug,
  updateBug,
  resolveBug,
  openBug,
  removeBug,
};
