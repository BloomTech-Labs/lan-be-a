const database = require("../database/dbConfig");

//Get following users
const fetchFollowing = async (user_id) => {
  return database("following")
    .join("users", "following.following_id", "users.id")
    .where("following.user_id", user_id.id)
    .select([
      "following.following_id",
      "users.display_name",
      "users.profile_picture",
      "users.track",
      "users.following",
    ]);
};

// adds a new following
const addFollowing = async (user_id, following_id) => {
  await database("users").where("id", user_id).increment("following", 1);

  return database("following")
    .insert({
      user_id,
      following_id,
    })
    .returning("*");
};

// remove a following
const removeFollowing = async (user_id, following_id) => {
  await database("users").where("id", user_id).decrement("following", 1);

  return database("following")
    .where({
      user_id,
      following_id,
    })
    .del();
};

module.exports = {
  fetchFollowing,
  addFollowing,
  removeFollowing,
};
