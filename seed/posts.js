const { Post } = require('../models');

// Create a Post object
Post.create({
    title: 'A post about cats',
    content: 'I love cats',
    username: '000',
})
.then(post => {
    console.log('---- NEW POST ----', post);
})
.catch(error => {
    console.log('---- ERROR ----', error);
});