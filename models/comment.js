const database = require('../database/dbConfig');

// Add a comment
const add = (userID, postID, comment) => {
  return database('comments').insert({ user_id: userID, post_id: postID, comment: comment }).returning('*');
};

// Delete a comment
const deleteComments = (id) => {
  return database('comments').where({id}).del();
};

// Add a comment like
const addCommentLike = (userID, commentID) => {
  return database('liked_comments').insert({ user_id: userID, comment_id: commentID });
};

// Add 1 to a comments likes column
const incrementCommentLikes = commentID => {
  return database('comments').where('id', commentID).increment('likes', 1);
};

// Remove a comment like
const removeCommentLike = (userID, commentID) => {
  return database('liked_comments').where({ user_id: userID, comment_id: commentID }).del();
};

// Remove 1 from a comments likes column
const decrementCommentLikes = commentID => {
  return database('comments').where('id', commentID).decrement('likes', 1);
};

// Fetch a posts' comments ordered by more recent
const fetchRecent = (postID) => {
  return database('comments')
    .join('users', 'comments.user_id', 'users.id')
    .where('post_id', postID)
    .orderBy('comments.created_at', 'desc')
    .select([
      'comments.id',
      'comments.user_id',
      'users.display_name',
      'users.profile_picture',
      'users.track',
      'comments.post_id',
      'comments.comment',
      'comments.likes',
      'comments.created_at',
      'comments.updated_at'
    ]);
};

// Fetch a posts' comments ordered by most likes
const fetchPopular = postID => {
  return database('comments')
    .join('users', 'comments.user_id', 'users.id')
    .where('post_id', postID)
    .orderBy('comments.likes', 'desc')
    .select([
      'comments.id',
      'comments.user_id',
      'users.display_name',
      'users.profile_picture',
      'users.track',
      'comments.post_id',
      'comments.comment',
      'comments.likes',
      'comments.created_at',
      'comments.updated_at'
    ]);
};

module.exports = {
  add,
  deleteComments,
  addCommentLike,
  incrementCommentLikes,
  removeCommentLike,
  decrementCommentLikes,
  fetchRecent,
  fetchPopular,
};