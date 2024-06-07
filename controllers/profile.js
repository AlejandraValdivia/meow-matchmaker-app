const express = require("express");
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const { User } = require("../models");
require("dotenv").config();

// Show profile page
router.get('/', isLoggedIn, (req, res) => {
    const { name, email, phone, username } = req.user;
    res.render('profile/index', { name, email, phone, username });
});

// Show edit profile page
router.get('/edit', isLoggedIn, (req, res) => {
    const { name, email, phone, username } = req.user;
    res.render('profile/edit', { name, email, phone, username });
});

// Handle profile update
router.put('/', isLoggedIn, async (req, res) => {
    try {
        const { name, email, phone, username } = req.body;
        await User.findByIdAndUpdate(req.user._id, { name, email, phone, username }, { new: true });
        req.flash('success', 'Profile updated successfully');
        res.redirect('/profile');
    } catch (err) {
        console.error('Error updating profile:', err);
        req.flash('error', 'Could not update profile');
        res.redirect('/profile/edit');
    }
});

// Show delete profile confirmation page
router.get('/delete', isLoggedIn, (req, res) => {
    const { name, email, phone, username } = req.user;
    res.render('profile/delete', { name, email, phone, username });
});

// Handle profile deletion
router.delete('/', isLoggedIn, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id);
        console.log('Fetching user:', req.user._id);
        req.flash('success', 'Profile deleted successfully');
        res.redirect('/auth/login');
    } catch (err) {
        console.error('Error deleting profile:', err);
        req.flash('error', 'Could not delete profile');
        res.redirect('/profile');
    }
});

module.exports = router;
