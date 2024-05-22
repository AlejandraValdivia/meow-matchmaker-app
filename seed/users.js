const { User } = require('../models');

// Create a user
User.create({
    name: 'Kevin Jones',
    email: 'kevinjones@email.com',
    phone: '888-444-1010',
    password: 'poiuytrewq',
})
.then(user => {
    console.log('---- NEW USER ----', user);
})
.catch(error => {
    console.log('---- ERROR ----', error);
});
