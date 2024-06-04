const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');

// ========= CONTACT ROUTES ===============
// Contact Form
router.get("/", (req, res) => {
        const { name, email, password } = req.body;
        res.render("contact", { name, email, password });
    });






module.exports = router