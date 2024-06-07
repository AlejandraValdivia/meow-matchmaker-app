const express = require('express');
const router = express.Router();
const { Comment } = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');
require('dotenv').config();

// ======== POSTS ROUTES ===============
// All comments
router.get('/', isLoggedIn, async (req, res) => {
  try {
    console.log("Fetching comments...");
    const comments = await Comment.find();
    console.log("Fetched comments:", comments);
    res.render('comments/index', { comments });
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).send('Server Error');
  }
});

// New comment
router.get('/new', isLoggedIn, (req, res) => {
  res.render('comments/new');
});

// Create a new comment
router.post('/', isLoggedIn, async (req, res) => {
  try {
    const { content, username } = req.body;
    if (!content || !username) {
      req.flash('error', 'All fields are required');
      return res.redirect('/comments/new');
    }
    const newComment = new Comment({ content, username });
    await newComment.save();
    req.flash('success', 'Comment created successfully');
    res.redirect('/comments');
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).send('Server Error');
  }
});

// Edit a comment
router.get('/:id/edit', isLoggedIn, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    res.render('comments/edit', { comment });
  } catch (err) {
    console.error('Error fetching comment for edit:', err);
    res.status(500).send('Server Error');
  }
});

// Update a comment - PUT request to /comments/:id
router.put('/:id', isLoggedIn, async (req, res) => {
  try {
    const { content, username} = req.body;
    if (!content || !username) {
      req.flash('error', 'All fields are required');
      return res.redirect(`/comments/${req.params.id}/edit`);
    }
    await Comment.findByIdAndUpdate(req.params.id, { content, username });
    req.flash('success', 'Comment updated successfully');
    res.redirect('/comments');
  } catch (err) {
    console.error('Error updating comment:', err);
    res.status(500).send('Server Error');
  }
});

// Show Delete a comment
router.get('/:id/delete', isLoggedIn, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    res.render('comments/delete', { comment });
  } catch (err) {
    console.error('Error fetching post for delete:', err);
    res.status(500).send('Server Error');
  }
});

// Delete a comment 
router.delete('/:id', isLoggedIn, async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    req.flash('success', 'Comment deleted successfully');
    res.redirect('/comments');
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).send('Server Error');
  }
});

// Show a single comment
router.get('/:id', isLoggedIn, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('username');
    if (!comment) {
      req.flash('error', 'Comment not found');
      return res.redirect('/comments');
    }
    res.render('comments/show', { comment });
  } catch (err) {
    console.error('Error fetching comment:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

