const database = require("../database/dbConfig");

// Add a comment
const add = (userID, postID, comment) => {
  return database("comments")
    .insert({ user_id: userID, post_id: postID, comment: comment })
    .returning("*");
};

// Delete a comment
const deleteComments = (id) => {
  return database('comments').where({id}).del();
};

// Add a comment like
const addCommentLike = (userID, commentID) => {
  return database("liked_comments").insert({
    user_id: userID,
    comment_id: commentID,
  });
};

// Fetch post comments by recent
// Should this be in post model? Maybe not because the URI will end in /comment anyway.
const fetchRecent = (postID) => {
  return (
    database("comments")
      .join("users", "comments.user_id", "users.id")
      .where("post_id", postID)
      .orderBy("comments.created_at", "desc")
      // Check what else is available here
      // user.id or comments.user_id?, research Knex as keyword so that you can use user.id
      .select([
        "comments.id",
        "comments.user_id",
        "users.display_name",
        "users.profile_picture",
        "users.track",
        "comments.post_id",
        "comments.comment",
        "comments.likes",
        "comments.created_at",
        "comments.updated_at",
      ])
  );
};

const fetchPopular = (postID) => {
  return (
    database("comments")
      .join("users", "comments.user_id", "users.id")
      .where("post_id", postID)
      .orderBy("comments.likes", "desc")
      // Check what else is available here
      // user.id or comments.user_id?, research Knex as keyword so that you can use user.id
      .select([
        "comments.id",
        "comments.user_id",
        "users.display_name",
        "users.profile_picture",
        "users.track",
        "comments.post_id",
        "comments.comment",
        "comments.likes",
        "comments.created_at",
        "comments.updated_at",
      ])
  );
};

const incrementCommentLikes = (commentID) => {
  return database("comments").where("id", commentID).increment("likes", 1);
};

const decrementCommentLikes = (commentID) => {
  return database("comments").where("id", commentID).decrement("likes", 1);
};

const removeCommentLike = (userID, commentID) => {
  return database("liked_comments")
    .where({ user_id: userID, comment_id: commentID })
    .del();
};

// helper to delete comments (moderator)

const deleteComments = async (id) => {
  await database("comments").where({ id }).update({ visible: false });
  return database("flagged_comments")
    .where({ comment_id: id })
    .update({ reviewed: true });
};


module.exports = {
  add,
  addCommentLike,
  fetchRecent,
  fetchPopular,
  incrementCommentLikes,
  decrementCommentLikes,
  removeCommentLike,
  deleteComments,
};
