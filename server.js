require("dotenv").config();
const express = require("express");
const app = express();
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("./config/passport-config");
const methodOverride = require('method-override');

const { User } = require('./models');

User.find({})
.then(user => {
  console.log('---- USER ----', user);
})
.catch(error => {
  console.log('---- ERROR ----', error);
});

// set environment variables
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
app.use("/dashboard", require("./controllers/dashboard"));
app.use("/profile", require("./controllers/profile"));
app.use("/posts", require("./controllers/post"));
app.use("/cats", require("./controllers/cats"));
app.use("/fanclub", require("./controllers/fanclub"));
app.use("/application-form", require("./controllers/application-form"));
app.use("/learn-more", require("./controllers/learn-more"));
app.use("/event", require("./controllers/event"));
app.use("/contact", require("./controllers/contact"));


// Home page
app.get("/", (req, res) => {
  res.render("home", {});
});

// Error handling for 404 responses
app.all('*', (req, res) => {
  res.status(404);
  res.render("404");
});

// Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


