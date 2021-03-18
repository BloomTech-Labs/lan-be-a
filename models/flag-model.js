const database = require('../database/dbConfig');

// Create a flagged post
const createFlaggedPost = async (post_id, user_id, reason_id) => {
  return database('flagged_posts').insert({ post_id, user_id, reason_id });
};

// Create a flagged comment
const createFlaggedComment = (comment_id, user_id, reason_id) => {
  return database('flagged_comments').insert({ comment_id, user_id, reason_id });
};

// Fetch Flagged Posts
const getFlaggedPosts = () => {
  return database('flagged_posts')
    .join('posts', 'flagged_posts.post_id', 'posts.id')
    .join('flagged_reason', 'flagged_posts.reason_id', 'flagged_reason.id')
    .where( 'flagged_posts.reviewed', false );
};

// Fetch Flagged comments
const getFlaggedComments = () => {
  return database('flagged_comments')
    .join('comments', 'flagged_comments.comment_id', 'comments.id')
    .join('flagged_reason', 'flagged_comments.reason_id', 'flagged_reason.id')
    .where( 'flagged_comments.reviewed', false );
};

// Archive a flagged post
const archivePost = async (postId) => {
  await database('posts').where('id', postId).update({ visible: false });
  return database('flagged_posts')
    .where('post_id', postId)
    .update({ reviewed: true });
};

// Archive a flagged comment
const archiveComment = async (commentId) => {
  await database('comments').where('id', commentId).update({ visible: false });
  return database('flagged_comments')
    .where('comment_id', commentId)
    .update({ reviewed: true });
};

// Resolve flagged post without archiving
const resolveFlaggedPostWithoutArchiving = (postId) => {
  return database('flagged_posts').where('post_id', postId).update({ reviewed: true });
};

// Resolve flagged post without archiving
const resolveFlaggedCommentWithoutArchiving = (commentId) => {
  return database('flagged_comments').where('comment_id', commentId).update({ reviewed: true });
};

// Get flagged reason id from reason
const getReasonIdByReason = (reason) => {
  return database('flagged_reason').where({ reason }).first();
};

module.exports = {
  createFlaggedPost,
  createFlaggedComment,
  getFlaggedPosts,
  getFlaggedComments,
  archivePost,
  archiveComment,
  resolveFlaggedPostWithoutArchiving,
  resolveFlaggedCommentWithoutArchiving,
  getReasonIdByReason
};
