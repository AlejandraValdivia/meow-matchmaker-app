const express = require('express');
const router = express.Router();
const { Post } = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');
require('dotenv').config();

// ======== POSTS ROUTES ===============
// All posts
router.get('/', isLoggedIn, async (req, res) => {
  try {
    console.log("Fetching posts...");
    const posts = await Post.find();
    console.log("Fetched posts:", posts);
    res.render('posts/index', { posts });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).send('Server Error');
  }
});

// New post
router.get('/new', isLoggedIn, (req, res) => {
  res.render('posts/new');
});

// Create a new post
router.post('/', isLoggedIn, async (req, res) => {
  try {
    const { title, content, username } = req.body;
    if (!title || !content || !username) {
      req.flash('error', 'All fields are required');
      return res.redirect('/posts/new');
    }
    const newPost = new Post({ title, content, username });
    await newPost.save();
    req.flash('success', 'Post created successfully');
    res.redirect('/posts');
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).send('Server Error');
  }
});

// Edit a post
router.get('/:id/edit', isLoggedIn, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render('posts/edit', { post });
  } catch (err) {
    console.error('Error fetching post for edit:', err);
    res.status(500).send('Server Error');
  }
});

// Update a post - PUT request to /posts/:id
router.put('/:id', isLoggedIn, async (req, res) => {
  try {
    const { title, content, username} = req.body;
    if (!title || !content || !username) {
      req.flash('error', 'All fields are required');
      return res.redirect(`/posts/${req.params.id}/edit`);
    }
    await Post.findByIdAndUpdate(req.params.id, { title, content, username });
    req.flash('success', 'Post updated successfully');
    res.redirect('/posts');
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).send('Server Error');
  }
});

// Show Delete a post
router.get('/:id/delete', isLoggedIn, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render('posts/delete', { post });
  } catch (err) {
    console.error('Error fetching post for delete:', err);
    res.status(500).send('Server Error');
  }
});

// Delete a post 
router.delete('/:id', isLoggedIn, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    req.flash('success', 'Post deleted successfully');
    res.redirect('/posts');
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).send('Server Error');
  }
});

// Show a single post
router.get('/:id', isLoggedIn, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('username');
    if (!post) {
      req.flash('error', 'Post not found');
      return res.redirect('/posts');
    }
    res.render('posts/show', { post });
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
