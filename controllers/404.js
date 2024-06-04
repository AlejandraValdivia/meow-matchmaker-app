const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');

// ========= 404 ROUTES ===============
router.get("/", (req, res, next) => {
  res.render("404");
  res.status(500).render("error");
});

router.use((err, req, res, next) => {
  console.error("Internal Server Error:", err);
  res.status(500).render("error");
});

router.use((req, res, next) => {
  res.status(404).render("404");
});

//     // ------------404 error page--------------
// app.use((req, res, next) => {
//     res.status(404).render("404");
//   });
  
//   // Global error handling middleware
//   app.use((err, req, res, next) => {
//     console.error("Internal Server Error:", err);
//     res.status(500).send("Internal Server Error");
//   });
module.exports = router