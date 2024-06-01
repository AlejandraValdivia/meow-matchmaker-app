const { name } = require('ejs');
const express = require('express');
const router = express.Router();

const app = express(); // our app
const axios = require("axios");
const PORT = process.env.PORT || 3000;
const methodOverride = require("method-override");
URL = require("url").URL;
require("dotenv").config();
const dotenv = require("dotenv");
dotenv.config();

// ------ Middleware---------
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use("/", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// add MIDDLEWARE for PUT and DELETE methods

const isLoggedIn = require('../middleware/isLoggedIn');

// import Cat model
const { Cat } = require('../models');

// ------ Routes -------
// router.get('/cats', async (req, res) => {
//     const cats = await Cat.find({});
//     res.render('cats/index', { cats});
// });

// router.get('/cats/:id', async (req, res) => {
//     const cat = await Cat.findById({ id: req.params.id });
//     if (!cat) {
//         req.flash('error', 'Cat not found');
//         return res.redirect('/cats/index');
//     }
//     res.render('cats/show', { cat});
// });



router.get('cats/:id', isLoggedIn, (req, res) => {
    const { id } = req.params;
    Cat.findById(id)
        .then(cat => {
            res.render('cats/show', { cat });
        })
        .catch(error => console.log('--- ERROR ---\n', error));
});

// router.get('/results', isLoggedIn, (req, res) => {
//     res.render('cats/results', {});
// });

module.exports = router;