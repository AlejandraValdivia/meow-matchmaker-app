// models
const User = require("./user");
const ApplicationForm = require("./application-form");
const Cat = require("./cat");
const Comment = require("./comment");
const Contact = require("./contact");
const Post = require("./post");

const mongoose = require("mongoose");
require('dotenv').config();

const uri = process.env.MONGO_URI;
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

// export models
module.exports = {
  ApplicationForm,
  Cat,
  Comment,
  Contact,
  Post,
  User,
};
