const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI);

// import models
const User = require('./user');
const Cat = require('./cat');
const Post = require('./post');
const Comment = require('./comment');
const Friend = require('./friend');
const ApplicationForm = require('./application-form');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

db.once('open', () => console.log(`Connected to MongoDB at ${db.host}: ${db.port}`));
db.on('error', (error) => console.log('Database error \n', error));

module.exports = {
    // models go here
    User,
    Cat,
    Post,
    Comment,
    Friend,
    ApplicationForm
}

