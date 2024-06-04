require("dotenv").config();
const express = require("express");
const app = express();
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("./config/passport-config");
const methodOverride = require('method-override');



const SECRET_SESSION = process.env.SECRET_SESSION;
const PORT = process.env.PORT || 3000;

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
app.use("/profile", require("./controllers/profile"));
app.use("/posts", require("./controllers/post"));
app.use("/comments", require("./controllers/comment"));


// --------------------- Models ---------------------           
const { User, Cat, Post, Comment, Friend } = require("./models");


// --------------------- Controllers ---------------------
// Home page
app.get("/", (req, res) => {
  res.render("home", {});
});

app.get("/fanclub", function (req, res) {
  res.render("fanclub/index", { User, Cat, Post, Comment, Friend });
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


