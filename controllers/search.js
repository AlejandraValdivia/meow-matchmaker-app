const express = require('express');
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const { CAT_API_KEY } = process.env;


// import Cat model
const { Cat } = require('../models');

// SEARCH CAT CONTROLLERS
// Route to show the search form
router.get('/', (req, res) => {
    res.render('search', { alerts: req.flash() });
  });
  
  router.get('/no-results', (req, res) => {
    res.render('no-results', { alerts: req.flash() });
  });
  
  // Route to process the search form
  router.get('/results', async (req, res) => {
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