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

// =================== Cats ===================
// router.get("/cats", async (req, res) => {
//     try {
//       const response = await axios.get(
//         `https://api.thecatapi.com/v1/breeds?limit=10&page=0`,
//         {
//           method: "GET",
//           headers: {
//             accept: "application/json",
//             "x-api-key": CAT_API_KEY,
//           },
//         }
//       );
//       const catsArray = [];
  
//       console.log("---- RESPONSE ----", response.data); // array of objects
  
//       for (let i = 0; i < response.data.length; i++) {
//         const catData = response.data[i];
//         console.log(catData);
       
//         const catObject = {
//           id: catData.id,
//           name: catData.name,
//           image: catData.image.url,
//           description: catData.description,
//           age: catData.life_span,
//           origin: catData.origin,
//           affectionLevel: catData.affection_level,
//         };
//         catsArray.push(catObject);
//       }
  
//       res.render("cats/index", { cats: catsArray });
//     } catch (error) {
//       console.error("----- ERROR in /api-test ------", error);
//     }
//   });
  
//   // CAT CONTROLLERS
//   router.get("/cats/:id", async (req, res) => {
//     const catId = req.params.id;
//     try {
//       // Fetch the breed information
//       const response = await axios.get(
//         `https://api.thecatapi.com/v1/breeds/${catId}`,
//         {
//           headers: {
//             accept: "application/json",
//             "x-api-key": CAT_API_KEY,
//           },
//         }
//       );
  
//       if (response.data) {
//         // Attempt to get image from the breed data directly
//         let imageUrl = response.data.image?.url || "";
  
//         // If imageUrl is empty, try fetching from another endpoint (if applicable)
//         if (!imageUrl) {
//           const imageResponse = await axios.get(
//             `https://api.thecatapi.com/v1/images/search?breed_ids=${catId}`,
//             {
//               headers: {
//                 accept: "application/json",
//                 "x-api-key": CAT_API_KEY,
//               },
//             }
//           );
  
//           if (imageResponse.data && imageResponse.data.length > 0) {
//             imageUrl = imageResponse.data[0].url || "";
//           }
//         }
  
//         const cat = {
//           _id: response.data.id,
//           name: response.data.name,
//           image: imageUrl,
//           description: response.data.description,
//           age: response.data.life_span,
//           origin: response.data.origin,
//           affectionLevel: response.data.affection_level,
//         };
  
//         console.log("----CAT----", cat);
//         res.render("cats/show", { cat });
//       } else {
//         req.flash("error", "Cat not found");
//         res.redirect("/cats");
//       }
//     } catch (error) {
//       console.error("----- ERROR in /cats/:id route ------", error);
//       req.flash("error", "Failed to fetch cat details");
//       res.redirect("/cats");
//     }
//   });
  
//   // SEARCH CAT CONTROLLERS
//   // Route to show the search form
//   router.get('/search', (req, res) => {
//     res.render('search', { alerts: req.flash() });
//   });
  
//   router.get('/no-results', (req, res) => {
//     res.render('no-results', { alerts: req.flash() });
//   });
  


// router.get('cats/:id', isLoggedIn, (req, res) => {
//     const { id } = req.params;
//     Cat.findById(id)
//         .then(cat => {
//             res.render('cats/show', { cat });
//         })
//         .catch(error => console.log('--- ERROR ---\n', error));
// });

// // router.get('/results', isLoggedIn, (req, res) => {
// //     res.render('cats/results', {});
// // });

module.exports = router;