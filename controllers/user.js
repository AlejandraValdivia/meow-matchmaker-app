const express = require("express");
const router = express.Router();
const passport = require("../config/passport-config");

// import User model
const { User } = require("../models");

// ======== GET ROUTES ===============
// User routes 
router.get('/profile', isLoggedIn, (req, res) => {
    User.findOne({ user_id: req.user._id });
    res.render('profile', { name, email, phone, password });
});

router.get('/profile/new', isLoggedIn, (req, res) => {
    User.findOne({ user_id: req.user._id });
    res.render('profile', { name, email, phone, password });
});









