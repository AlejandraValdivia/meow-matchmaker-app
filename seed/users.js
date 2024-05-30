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

User.create({
    name: 'John Smith',
    email: 'johnsmith@email.com',
    phone: '111-222-3333',
    password: 'asdfghjkl',
})

User.create({ 
    name: 'Alejandra Valdivia',
    email: 'alexvcodes@gmail.com',
    phone: '111-222-3333',
    password: 'hellokitty',
})
User.find({})
.then(user => {
    console.log('---- USER ----', user);
})
.catch(error => {
    console.log('---- ERROR ----', error);
});
