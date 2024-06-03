const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');

// import Comment model
const { Comment } = require('../models');

// ======== GET ROUTES ===============
// Get all comments for a specific post
router.get('/comments/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId });
    res.render('comments/index', { comments, postId: req.params.postId, alerts: req.flash() });
  } catch (err) {
    req.flash('error', 'Could not load comments');
    res.redirect('/');
  }
});

// New comment form
router.get('/post/:postId/new', isLoggedIn, (req, res) => {
  res.render('comments/new', { postId: req.params.postId, alerts: req.flash() });
});

// Create a new comment
router.post('/post/:postId', isLoggedIn, async (req, res) => {
  try {
    const { content } = req.body;
    const newComment = new Comment({
      content,
      postId: req.params.postId,
      username: req.user.username,
    });
    await newComment.save();
    req.flash('success', 'Comment added successfully');
    res.redirect(`/comments/post/${req.params.postId}`);
  } catch (err) {
    req.flash('error', 'Could not add comment');
    res.redirect(`/comments/post/${req.params.postId}/new`);
  }
});

// Edit comment form
router.get('/:id/edit', isLoggedIn, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      req.flash('error', 'Comment not found');
      return res.redirect(`/comments/post/${comment.postId}`);
    }
    res.render('comments/edit', { comment, alerts: req.flash() });
  } catch (err) {
    req.flash('error', 'Could not load comment for editing');
    res.redirect(`/comments/post/${req.params.postId}`);
  }
});

// Update a comment
router.put('/:id', isLoggedIn, async (req, res) => {
  try {
    const { content } = req.body;
    await Comment.findByIdAndUpdate(req.params.id, { content });
    req.flash('success', 'Comment updated successfully');
    res.redirect(`/comments/post/${req.body.postId}`);
  } catch (err) {
    req.flash('error', 'Could not update comment');
    res.redirect(`/comments/post/${req.body.postId}`);
  }
});

// Delete a comment
router.delete('/:id', isLoggedIn, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    req.flash('success', 'Comment deleted successfully');
    res.redirect(`/comments/post/${comment.postId}`);
  } catch (err) {
    req.flash('error', 'Could not delete comment');
    res.redirect(`/comments/post/${req.params.postId}`);
  }
});

module.exports = router;
