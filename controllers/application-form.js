const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
require('dotenv').config();

const { User } = require('../models');

// =================== Application Form ===================

router.get("/", isLoggedIn, async (req, res) => {
    try {
        console.log("Fetching user...");
        const user = await User.find();
        console.log("Fetched user:", user);
        res.render('application-form', { user });
      } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).send('Server Error');
      }
});
    

module.exports = router
