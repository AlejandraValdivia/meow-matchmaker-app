const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');

// =================== Dashboard ===================
router.get('/', isLoggedIn, async (req, res) => {
    const { User } = await req.body;
    res.render('dashboard', { User });
});


module.exports = router