// const express = require('express');
// const router = express.Router();
// const { EventForm } = require('../models');
// const isLoggedIn = require('../middleware/isLoggedIn');
// require('dotenv').config();

// // ========= EVENTS ROUTES ===============
// // Event Form
// router.get("/", (req, res) => {
//     const event = new EventForm();
//     res.render("event", { User, Cat, Post, Comment, Friend });
//   });

// // Create Event
// router.post("/", (req, res) => {
//     const { User, Cat, Post, Comment, Friend } = req.body;
//     res.render("event", { User, Cat, Post, Comment, Friend });
//   });

// module.exports = router