const express = require("express");
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
require("dotenv").config();

// import User model
const { User } = require("../models");

// ======== PROFILE ROUTES ===============
// --- AUTHENTICATED ROUTE: go to user profile page ---
router.get('/', isLoggedIn, (req, res) => {
    const { name, email, phone, username } = req.user;
    res.render('profile', { name, email, phone, username });
});

router.get('/edit', isLoggedIn, (req, res) => {
    const user = req.user;
    if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/profile');
    }
    res.render('profile/edit', { user });
});

// Show Delete a profile
router.get('/:id/delete', isLoggedIn, async (req, res) => {
    try {
        const userId = await User.findById(req.params.id);
        res.render('profile/delete', { userId });
      } catch (err) {
        console.error('Error fetching profile for delete:', err);
        res.status(500).send('Server Error');
      }
});

// DELETE Profile
router.delete('/:id', isLoggedIn, async (req, res) => {
    console.log('DELETE request received for ID:', req.params.id);
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            console.error('User not found with ID:', req.params.id);
            req.flash('error', 'User not found.');
            return res.status(404).send('User Not Found');
        }

        await User.findByIdAndDelete(req.params.id);
        req.flash('success', 'Profile deleted successfully.');
        res.redirect('/auth/signup');
    } catch (err) {
        console.error('Error deleting user profile:', err);
        req.flash('error', 'Failed to delete profile.');
        res.status(500).send('Server Error');
    }
});


// Route to handle profile update
router.put('/', isLoggedIn, async (req, res) => {
    try {
        const { name, email, phone, username } = req.body;
        const user = await User.findByIdAndUpdate(req.user._id, { name, email, phone, username }, { new: true });
        req.flash('success', 'Profile updated successfully');
        res.redirect('/profile');
    } catch (err) {
        console.error('Error updating profile:', err);
        req.flash('error', 'Could not update profile');
        res.redirect('/profile/edit');
    }
});

module.exports = router;
