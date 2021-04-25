const database = require("../database/dbConfig");
const Follow = require("./following");

// Get a user during Auth
const findUserAtAuth = (filter) => {
  return database("users").where(filter).first();
};

// Get a user
const find = async (filter) => {
  const userDetails = await database("users").where(filter).first();
  const followingDetails =
    userDetails.following !== 0 ? await Follow.fetchFollowing(filter) : [];

  return { ...userDetails, following_list: followingDetails };
};

//Get all users
const fetchAll = () => {
  return database("users")
    .select([
      "id",
      "display_name",
      "profile_picture",
      "track",
      "github_username",
      "following",
    ])
    .orderBy("display_name");
};

// Add a user
const add = (user) => {
  return database("users").insert(user).returning("*");
};

// Update a user
const update = (id, value) => {
  return database("users").where("id", id).update(value).returning("*");
};

// Delete a user
const remove = (userID) => {
  return database("users").where("id", userID).del();
};

// Fetch all of a users posts
const fetchPosts = (userID) => {
  return database("posts").where("user_id", userID);
};

// Fetch all of a users comments
const fetchComments = (userID) => {
  return database("comments").where("user_id", userID);
};

// Fetch all posts a user has liked
const fetchUsersLikedPosts = (userID) => {
  return database("liked_posts").where("user_id", userID);
};

// Fetch all comments a user has liked
const fetchUsersLikedComments = (userID) => {
  return database("liked_comments").where("user_id", userID);
};

// Set a users onboarded field to true
const onboard = (userID) => {
  return database("users")
    .where("id", userID)
    .update("onboarded", "true")
    .returning("*");
};

module.exports = {
  fetchAll,
  findUserAtAuth,
  find,
  add,
  update,
  remove,
  fetchPosts,
  fetchComments,
  fetchUsersLikedPosts,
  fetchUsersLikedComments,
  onboard,
};
