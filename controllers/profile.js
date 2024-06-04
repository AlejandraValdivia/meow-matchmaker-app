const express = require("express");
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
require("dotenv").config();

// import User model
const { User } = require("../models");

// ======== GET ROUTES ===============
// --- AUTHENTICATED ROUTE: go to user profile page ---
router.get('/', isLoggedIn, (req, res, next) => {
    const { name, email, phone } = req.user;
    res.render('profile', { name, email, phone });
});

router.get('/edit', isLoggedIn, (req, res, next) => {
    const user = req.user;
    if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/profile');
    }
    res.render('profile/edit', { user });
});

router.get('/delete', isLoggedIn, (req, res, next) => {
    const user = req.user;
    if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/profile');
    }
    res.render('profile/delete', { user });
});

// Route to handle profile update
router.put('/', isLoggedIn, async (req, res, next) => {
    try {
        const { name, email, phone } = req.body;
        const user = await User.findByIdAndUpdate(req.user._id, { name, email, phone }, { new: true });
        req.flash('success', 'Profile updated successfully');
        res.redirect('/profile');
    } catch (err) {
        console.error('Error updating profile:', err);
        req.flash('error', 'Could not update profile');
        res.redirect('/profile/edit');
    }
});

module.exports = router;
