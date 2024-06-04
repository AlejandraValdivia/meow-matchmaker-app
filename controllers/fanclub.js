const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
require('dotenv').config();


// =================== Fan Club ===================
router.get('/', isLoggedIn, async (req, res) => {
    const { User, Cat, Post, Comment, Friend } = req.body;
    res.render('fanclub/index', { User, Cat, Post, Comment, Friend });
});



module.exports = router