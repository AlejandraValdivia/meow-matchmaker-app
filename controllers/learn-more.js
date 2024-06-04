const express = require('express');
const router = express.Router();
const { Post } = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');
require('dotenv').config();

// ======== LEARN MORE ROUTES ===============
router.get('/', isLoggedIn, async (req, res) => {
    try {
        console.log("Fetching posts...");
        const posts = await Post.find();
        console.log("Fetched posts:", posts);
        res.render('learn-more', { posts });
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).send('Server Error');
    }
});



module.exports = router