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
const UNSPLASH_CLIENT_ID = process.env.ACCESS_ID;
// const NY_CLIENT_ID = process.env.NEW_YORK_TIMES_CLIENT_ID;
console.log("Client ID: " + UNSPLASH_CLIENT_ID);
console.log('----ACCESS ID-----', process.env.ACCESS_ID);

// ------ Middleware---------
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use("/", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// add MIDDLEWARE for PUT and DELETE methods

 const unsplasUrl = 'https://api.unsplash.com/photos/random';
 console.log(unsplasUrl);

app.get("/", (req, res) => {
  axios
    .get("https://api.unsplash.com/photos/random", {
      headers: {
        Authorization: "Client-ID" + process.env.UNSPLASH_CLIENT_ID,
      },
      query: "cats",
      count: 20
    })
    .then((response) => {
      res.json(response.data);
      const unsplashObj = {
        name: response.data.name,
        url: response.data.urls.regular,
        description: response.data.description,
        id: response.data.id,
        color: response.data.color,
        links: response.data.links,
        
        
      };
      res.render("home", { unsplash: unsplashObj });
      console.log("---unsplash data:\n", unsplashObj);
         })
        .catch((error) => {
          console.log("Error:", error);
      res.status(500).send("Error fetching random photo");
    });
});

const passport = require('../config/passport-config');

const isLoggedIn = require('../middleware/isLoggedIn');

// import Cat model
const { Cat } = require('../models');

router.get('/cats', (req, res) => {
    axios.get('https://api.unsplash.com/photos/random')
    .then(response => {

        const catArray = [];

        for (let i = 0; i < response.data.results.length; i++) {
            let cat = response.data.results[i];
            axios.get(cat.url)
            .then(responseTwo => {

                const catObject = {
                    id: response.data.id,
                    name: responseTwo.data.name,
                    age: responseTwo.data.age,
                    breed: responseTwo.data.breed,
                    image: responseTwo.data.sprites.other.home['front_default'],
                    status: responseTwo.data.status,
                    description: responseTwo.data.description,
                    
                }
                // push inside array
                catArray.push(catObject); // 4
                if (catArray.length === 20) {
                    console.log(catArray);
                    res.render('cats', { catArray: catArray });
                }
            })
            .catch(error => console.log('--- ERROR ---\n', error));
        }
        
    })
    .catch(error => {
        console.log('----- ERROR inside GET / route -------\n', error);
    });
});


router.get('/cats', isLoggedIn, (req, res) => {
    res.render('cats/index', {});
});

router.get('/new', isLoggedIn, (req, res) => {
    res.render('cat/new', {});
});

//search for a cat
router.get('/search', isLoggedIn, (req, res) => {
    res.render('cat/search', {});
});

router.get('/:id', isLoggedIn, (req, res) => {
    const { id } = req.params;
    Cat.findById(id)
        .then(cat => {
            res.render('cat/show', { cat });
        })
        .catch(error => console.log('--- ERROR ---\n', error));
});

router.get('/results', isLoggedIn, (req, res) => {
    res.render('cat/results', {});
});

module.exports = router;