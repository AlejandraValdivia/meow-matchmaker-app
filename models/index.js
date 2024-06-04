const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI);

// import models
const User = require('./user');
const Cat = require('./cat');
const Post = require('./post');
const Comment = require('./comment');
const Friend = require('./friend');


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/meow-matchmaker', {
  useNewUrlParser: true,
  useUnifiedTopology: true, 
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("Failed to connect to MongoDB", err);
});

const db = mongoose.connection;

db.once('open', () => console.log(`Connected to MongoDB at ${db.host}: ${db.port}`));
db.on('error', (error) => console.log('Database error \n', error));

module.exports = {
    // models go here
    User,
    Cat,
    Post,
    Comment,
    Friend
}

