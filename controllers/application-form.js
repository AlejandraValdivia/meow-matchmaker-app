const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");
require("dotenv").config();

const { ApplicationForm } = require("../models");

router.get("/", isLoggedIn, async (req, res) => {
  try {
    const userForms = await ApplicationForm.find({ user_id: req.user._id });
    console.log("Alerts:", req.flash()); // Debug log
    res.render("application-form", { userForms, alerts: req.flash() });
  } catch (err) {
    console.error("Error fetching user forms:", err);
    res.status(500).send("Server Error");
  }
});

router.post("/", isLoggedIn, async (req, res) => {
  try {
    const { name, email, phoneNumber, origin, services } = req.body;
    const newForm = new ApplicationForm({
      user_id: req.user._id,
      name,
      email,
      phoneNumber,
      origin,
      services,
    });

    await newForm.save();
    req.flash("success", "Application form submitted successfully.");
    console.log('After setting flash message', req.flash("success")); // Debug log
    res.redirect("/application-form");
  } catch (err) {
    console.error("Error saving new application form:", err);
    req.flash("error", "Failed to submit application form.");
    res.redirect("/application-form");
  }
});

module.exports = router;
