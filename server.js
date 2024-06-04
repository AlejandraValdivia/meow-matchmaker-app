require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("./config/passport-config");
const isLoggedIn = require("./middleware/isLoggedIn");
const methodOverride = require('method-override');
const mongoose = require("mongoose");

// const commentRoutes = require('./controllers/comment');
// const postRoutes = require('./controllers/posts');
// const catRoutes = require('./controllers/cats');

const SECRET_SESSION = process.env.SECRET_SESSION;
const PORT = process.env.PORT || 3000;
const CAT_API_KEY = process.env.CAT_API_KEY;

// import model
const { User } = require("./models");
const { Cat } = require("./models");
const { Post } = require("./models");
const { Comment } = require("./models");
const { Friend } = require("./models");

//test model
Cat.find({}).then((cat) => console.log("--Cat--", cat));
User.find({}).then((user) => console.log("--User--", user));
Post.find({}).then((post) => console.log("--Post--", post));
Comment.find({}).then((comment) => console.log("--Comment--", comment));
Friend.find({}).then((friend) => console.log("--Friend--", friend));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/meow-matchmaker', {
  useNewUrlParser: true,
  useUnifiedTopology: true, 
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("Failed to connect to MongoDB", err);
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + "/public"));
app.use(
  session({
    secret: SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

// initial passport
app.use(passport.initialize());
app.use(passport.session());

// middleware for tracking users and alerts
app.use((req, res, next) => {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next(); 
});

// import auth routes
app.use("/auth", require("./controllers/auth"));
app.use('/', require('./controllers/cats'));
app.use("/cats", require("./controllers/cats"));
// app.use("/users", require("./controllers/users"));
app.use("/posts", require("./controllers/posts"));
// app.use("/comments", require("./controllers/comments"));
// app.use("/friends", require("./controllers/friends"));
app.use('/comments', require('./controllers/comment'));


// --------------------- Controllers ---------------------
// Home page
app.get("/", (req, res) => {
  res.render("home", {});
});

app.get("/fanclub", function (req, res) {
  res.render("fanclub/index", { User, Cat, Post, Comment, Friend });
});

// --- AUTHENTICATED ROUTE: go to user profile page ---
// Profile Routes
app.get('/profile', isLoggedIn, (req, res) => {
  const { name, email, phone } = req.user;
  res.render('profile', { name, email, phone });
});

app.get('/profile/edit', isLoggedIn, (req, res) => {
  const user = req.user;
  if (!user) {
    req.flash('error', 'User not found');
    return res.redirect('/profile');
  }
  res.render('profile/edit', { user });
});

app.get('/profile/delete', isLoggedIn, (req, res) => {
  const user = req.user;
  if (!user) {
    req.flash('error', 'User not found');
    return res.redirect('/profile');
  }
  res.render('profile/delete', { user });
});

// Route to handle profile update
app.put('/profile', isLoggedIn, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, email, phone }, { new: true });
    req.flash('success', 'Profile updated successfully');
    res.redirect('/profile', { user });
  } catch (err) {
    console.error('Error updating profile:', err);
    req.flash('error', 'Could not update profile');
    res.redirect('/profile/edit');
  }
});

// APPLICATION FORM
app.get("/application-form", (req, res) => {
  const { name, email, phone } = req.params;
  res.render("application-form", { name, email, phone });
});

// DASHBOARD
app.get("/dashboard", (req, res) => {
  const { User } = req.body;
  res.render("dashboard", { User });
});

// LEARN MORE CONTROLLERS
app.get("/learn-more", (req, res) => {
  const { User, Cat, Post, Comment, Friend } = req.body;
  res.render("learn-more", { User, Cat, Post, Comment, Friend });
});

// Route to the fan club
app.get("/fanclub", (req, res) => {
  const { User, Cat, Post, Comment, Friend } = req.body;
  res.render("fanclub/index", { User, Cat, Post, Comment, Friend });
});

// Event Form
app.get("/event", (req, res) => {
  const { User, Cat, Post, Comment, Friend } = req.body;
  res.render("event", { User, Cat, Post, Comment, Friend });
});

// Contact Form
app.get("/contact", (req, res) => {
  const { name, email, password } = req.body;
  res.render("contact", { name, email, password });
});

// ------------404 error page--------------
app.use((req, res, next) => {
  res.status(404).render("404");
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err);
  res.status(500).send("Internal Server Error");
});

// Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


