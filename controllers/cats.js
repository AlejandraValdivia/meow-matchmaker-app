const express = require('express');
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const { CAT_API_KEY } = process.env;
const isLoggedIn = require('../middleware/isLoggedIn');

// import Cat model
const { Cat } = require('../models');


// =================== Cats ===================
router.get("/cats", async (req, res) => {
    try {
      const response = await axios.get(
        `https://api.thecatapi.com/v1/breeds?limit=10&page=0`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "x-api-key": CAT_API_KEY,
          },
        }
      );
      const catsArray = [];
  
      console.log("---- RESPONSE ----", response.data); // array of objects
  
      for (let i = 0; i < response.data.length; i++) {
        const catData = response.data[i];
        console.log(catData);
       
        const catObject = {
          id: catData.id,
          name: catData.name,
          image: catData.image.url,
          description: catData.description,
          age: catData.life_span,
          origin: catData.origin,
          affectionLevel: catData.affection_level,
        };
        catsArray.push(catObject);
      }
  
      res.render("cats/index", { cats: catsArray });
    } catch (error) {
      console.error("----- ERROR in /api-test ------", error);
    }
  });
  
  // CAT CONTROLLERS
  router.get("/cats/:id", async (req, res) => {
    const catId = req.params.id;
    try {
      // Fetch the breed information
      const response = await axios.get(
        `https://api.thecatapi.com/v1/breeds/${catId}`,
        {
          headers: {
            accept: "application/json",
            "x-api-key": CAT_API_KEY,
          },
        }
      );
  
      if (response.data) {
        // Attempt to get image from the breed data directly
        let imageUrl = response.data.image?.url || "";
  
        // If imageUrl is empty, try fetching from another endpoint (if applicable)
        if (!imageUrl) {
          const imageResponse = await axios.get(
            `https://api.thecatapi.com/v1/images/search?breed_ids=${catId}`,
            {
              headers: {
                accept: "application/json",
                "x-api-key": CAT_API_KEY,
              },
            }
          );
  
          if (imageResponse.data && imageResponse.data.length > 0) {
            imageUrl = imageResponse.data[0].url || "";
          }
        }
  
        const cat = {
          _id: response.data.id,
          name: response.data.name,
          image: imageUrl,
          description: response.data.description,
          age: response.data.life_span,
          origin: response.data.origin,
          affectionLevel: response.data.affection_level,
        };
  
        console.log("----CAT----", cat);
        res.render("cats/show", { cat });
      } else {
        req.flash("error", "Cat not found");
        res.redirect("/cats");
      }
    } catch (error) {
      console.error("----- ERROR in /cats/:id route ------", error);
      req.flash("error", "Failed to fetch cat details");
      res.redirect("/cats");
    }
  });
  
// SEARCH CAT CONTROLLERS
// Route to show the search form
router.get('/search', (req, res) => {
  res.render('search', { alerts: req.flash() });
});

router.get('/no-results', (req, res) => {
  res.render('no-results', { alerts: req.flash() });
});
  

router.get('cats/:id', isLoggedIn, (req, res) => {
    const { id } = req.params;
    Cat.findById(id)
        .then(cat => {
            res.render('cats/show', { cat });
        })
        .catch(error => console.log('--- ERROR ---\n', error));
});

// Route to process the search form
router.get('/search/results', async (req, res) => {
  const { breed, origin, color } = req.query;
  const apiUrl = `https://api.thecatapi.com/v1/breeds`;
  if (!breed && !origin && !color) {
    console.log('---EMPY FORM---');
    req.flash('error', 'Please enter at least one search criteria');
    return res.redirect('/no-results');
  }

  try {
    const response = await axios.get(apiUrl, {
      headers: { 'x-api-key': process.env.CAT_API_KEY }
    });
    let cats = response.data;

    if (breed) {
      cats = cats.filter(cat => cat.name.toLowerCase().includes(breed.toLowerCase()));
    }
    if (origin) {
      cats = cats.filter(cat => cat.origin.toLowerCase().includes(origin.toLowerCase()));
    }
    if (color) {
      cats = cats.filter(cat => cat.description.toLowerCase().includes(color.toLowerCase()));
    }
    if (cats.length === 0) {
      req.flash('error', 'No results found for the given search criteria');
      return res.redirect('/no-results');
    }

    res.render('results', { cats, alerts: req.flash() });
  } catch (error) { 
    console.error(error);
    req.flash('error', 'Unable to fetch data from The Cat API');
    res.redirect('/search');
    }

});


module.exports = router;