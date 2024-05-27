const { Cat } = require('../models');

// Create a user
Cat.create({
    name: 'puffy',
    breed: 'persian'
})
.then(user => {
    console.log('---- NEW CAT ----', cat);
})
.catch(error => {
    console.log('---- ERROR ----', error);
});