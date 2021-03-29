const { response } = require('express');
const database = require('../database/dbConfig');

// Create a flagged post
const createFlaggedPost = async (post_id, user_id, {reason_id, note}) => {
  return database('flagged_posts').insert({ post_id, user_id, reason_id, note });
};

// Create a flagged comment
const createFlaggedComment = (comment_id, user_id, {reason_id, note}) => {
  return database('flagged_comments').insert({ comment_id, user_id, reason_id, note });
};

// Fetch a single instance of each flagged post
const getFlaggedPosts = () => {
  return database('flagged_posts as fp')
    .join('posts as p', 'fp.post_id', 'p.id')
    .distinct('fp.post_id', 'p.title')
    .orderBy('post_id');
};

// Fetch flags for each distinct post
const getFlagsByPostId = (post_id) => {
  return database('flagged_posts as fp')
    .join('flagged_reason as fr', 'fp.reason_id', 'fr.id')
    .join('users as u', 'fp.user_id', 'u.id')
    .where('fp.post_id', post_id)
    .select(
      'fp.user_id as flagger_id', 
      'u.display_name as flagger_name', 
      'fr.reason',
      'fp.note');
};

// Fetch a single instance of each flagged comment
const getFlaggedComments = () => {
  return database('flagged_comments as fc')
    .join('comments as c', 'fc.comment_id', 'c.id')
    .distinct('fc.comment_id', 'c.comment')
    .orderBy('fc.comment_id');
};

// Fetch flags for each distinct post
const getFlagsByCommentId = (comment_id) => {
  return database('flagged_comments as fc')
    .join('flagged_reason as fr', 'fc.reason_id', 'fr.id')
    .join('users as u', 'fc.user_id', 'u.id')
    .where('fc.comment_id', comment_id)
    .select(
      'fc.user_id as flagger_id', 
      'u.display_name as flagger_name', 
      'fr.reason',
      'fc.note');
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
  getFlagsByPostId,
  getFlaggedComments,
  getFlagsByCommentId,
  archivePost,
  archiveComment,
  resolveFlaggedPostWithoutArchiving,
  resolveFlaggedCommentWithoutArchiving,
  getReasonIdByReason
};
