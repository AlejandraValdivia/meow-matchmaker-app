const express = require('express');
const router = express.Router();
const { Contact } = require('../models');

// Show the contact form
router.get('/', (req, res) => {
    res.render('contact');
});

// Handle contact form submission
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        await Contact.create({ name, email, message });
        req.flash('success', "Form submitted successfully, We'll contact you shortly");
        res.redirect('/contact');
    } catch (err) {
        console.error('Error submitting contact form:', err);
        req.flash('error', 'Could not submit form. Please try again later.');
        res.redirect('/contact');
    }
});

module.exports = router;

