const database = require('../database/dbConfig');

// Create a flagged post
const createFlaggedPost = (post_id, user_id) => {
  return database('flagged_posts').insert({ post_id, user_id });
};

// Create a flagged comment
const createFlaggedComment = (commentId, userId) => {
  // Yvette
};

// Fetch Flagged Posts
const getFlaggedPosts = () => {
  // Only flagged posts that reviewed = false
  // Jake
};

// Fetch Flagged comments
const getFlaggedComments = () => {
  // Only flagged comments that reviewed = false
  // James
};

// Archive a flagged post
const archivePost = (postId) => {
  // set visible to false on post
  // set reviewed to true in flagged_posts table
  // Sal
};

// Archive a flagged comment
const archiveComment = (commentId) => {
  // set visible to false on comment
  // set reviewed to true in flagged_comments table
  // Gerardo
};

// Resolve flagged post without archiving

module.exports = {
  createFlaggedPost,
  createFlaggedComment,
  getFlaggedPosts,
  getFlaggedComments,
  archivePost,
  archiveComment,
};
