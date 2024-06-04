const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');

// ========= EVENTS ROUTES ===============
// Event Form
router.get("/", (req, res) => {
    const { User, Cat, Post, Comment, Friend } = req.body;
    res.render("event", { User, Cat, Post, Comment, Friend });
  });

module.exports = router