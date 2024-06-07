const express = require('express');
const router = express.Router();
const { ApplicationForm } = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');

// Show the application form
router.get('/', isLoggedIn, (req, res) => {
    res.render('application-form');
});

// Handle application form submission
router.post('/', isLoggedIn, async (req, res) => {
    try {
        const { name, email, phoneNumber, origin, services, message } = req.body;
        await ApplicationForm.create({ 
            user_id: req.user._id,
            name,
            email,
            phoneNumber,
            origin,
            services,
            message
        });
        req.flash('success', "Form submitted successfully, we'll contact you shortly");
        res.redirect('/application-form');
    } catch (err) {
        console.error('Error submitting application form:', err);
        req.flash('error', 'Could not submit form. Please try again later.');
        res.redirect('/application-form');
    }
});

module.exports = router;
