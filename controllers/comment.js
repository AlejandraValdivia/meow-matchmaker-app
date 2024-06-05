const express = require('express');
const router = express.Router();
const { Comment } = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');
require('dotenv').config();

// ======== GET COMMENTS ROUTES ===============
// Get all comments for a specific post
router.get('/', isLoggedIn, async (req, res) => {
  try {
    console.log("Fetching comments...");
    const comments = await Comment.find();
    console.log("Fetched comments:", comments);
    res.render('comments', { comments });
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).send('Server Error');
  }
});

// New comment form
router.get('/new', isLoggedIn, (req, res) => {
  const { postId } = req.params;
  console.log(postId);
  res.render('/new', {} );
});

// Create a new comment
router.post('/', isLoggedIn, async (req, res) => {
  try {
    const { content } = req.body;
    console.log(content);
    const newComment = new Comment({
      content,
      postId: req.params.postId,
      username: req.user.username,
      title: req.user.title,
      content: content
    });
    await newComment.save();
    req.flash('success', 'Comment added successfully');
    res.redirect(`/comments/${req.params.postId}`);
  } catch (err) {
    req.flash('error', 'Could not add comment');
    res.redirect(`/comments/${req.params.postId}/new`);
  }
});

// Edit a post
router.get('/:id/edit', isLoggedIn, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    res.render('comments/edit', { comment });
  } catch (err) {
    console.error('Error fetching comments for edit:', err);
    res.status(500).send('Server Error');
  }
});

// Update a post - PUT request to /comments/:id
router.put('/:id', isLoggedIn, async (req, res) => {
  try {
    const { title, content, username } = req.body;
    if (!title || !content || !username) {
      req.flash('error', 'All fields are required');
      return res.redirect(`/comments/${req.params.id}/edit`);
    }
    await Post.findByIdAndUpdate(req.params.id, { title, content, username });
    req.flash('success', 'Post updated successfully');
    res.redirect('/comments');
  } catch (err) {
    console.error('Error updating comment:', err);
    res.status(500).send('Server Error');
  }
});

// Show Delete a post
router.get('/:id/delete', isLoggedIn, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    res.render('comments/delete', { comment });
  } catch (err) {
    console.error('Error fetching comments for delete:', err);
    res.status(500).send('Server Error');
  }
});

// Delete a post 
router.delete('/:id', isLoggedIn, async (req, res) => {
  try {
    await 
    
    Comment.findByIdAndDelete(req.params.id);
    req.flash('success', 'Comment deleted successfully');
    res.redirect('/comments');
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).send('Server Error');
  }
});

// Show a single comment
router.get('/:id', isLoggedIn, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('username');
    if (!comment) {
      req.flash('error', 'comment not found');
      return res.redirect('/comments');
    }
    res.render('comments/show', { comment });
  } catch (err) {
    console.error('Error fetching comment:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

