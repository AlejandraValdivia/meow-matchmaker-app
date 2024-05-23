// const express = require('express');
// const router = express.Router();
// const passport = require('../config/passport-config');
// const axios = require('axios');
// const isLoggedIn = require('../middleware/isLoggedIn');

// // import Pokemon model
// // const { Pokemon } = require('../models');

// router.get('/', (req, res) => {
//     axios.get('https://pokeapi.co/api/v2/pokemon')
//     .then(response => {

//         const pokemonArray = [];

//         for (let i = 0; i < response.data.results.length; i++) {
//             let poke = response.data.results[i];
//             axios.get(poke.url)
//             .then(responseTwo => {

//                 const pokemonObject = {
//                     name: responseTwo.data.name,
//                     height: responseTwo.data.height,
//                     weight: responseTwo.data.weight,
//                     image: responseTwo.data.sprites.other.home['front_default'],
//                     type: responseTwo.data.types[0].type.name,
//                     move: responseTwo.data.moves[0].move.name,
//                     experience: responseTwo.data['base_experience'],
//                     id: responseTwo.data.id
//                 }
//                 // push inside array
//                 pokemonArray.push(pokemonObject); // 4
//                 if (pokemonArray.length === 20) {
//                     console.log(pokemonArray);
//                     res.render('pokemon/index', { pokemonArray: pokemonArray });
//                 }
//             })
//             .catch(error => console.log('--- ERROR ---\n', error));
//         }
        
//     })
//     .catch(error => {
//         console.log('----- ERROR inside GET / route -------\n', error);
//     });
// });

// router.get('/new', isLoggedIn, (req, res) => {
//     res.render('pokemon/new', {});
// });

// // search for a pokemon
// router.get('/search', isLoggedIn, (req, res) => {
//     res.render('pokemon/search', {});
// });


// module.exports = router;