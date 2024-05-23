require("dotenv").config();
const express = require("express");
const app = express();
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("./config/passport-config");
const isLoggedIn = require("./middleware/isLoggedIn");
const SECRET_SESSION = process.env.SECRET_SESSION;
const PORT = process.env.PORT || 3000;

// import model
const { User } = require('./models');

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(
  session({
    secret: SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// middleware for tracking users and alerts
app.use((req, res, next) => {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next(); // next() means go to the said route
});

app.get("/", (req, res) => {
  res.render("home", {});
});

// ======= GET ROUTES =======
app.get("/auth/signup", (req, res) => {
  res.render("auth/signup", {});
});

// --- go to login page ---
app.get("/auth/login", (req, res) => {
  res.render("auth/login", {});
});

// ======= POST ROUTES =======
// --- grab data from req.body and create user + redirect + error handling
// --- we need the name, phone, password and email
app.post("/auth/signup", async (req, res) => {
  res.send(req.body);
  // create phone number error, then we can address a solution
  // search for the email in database (unique)
  try {
    const findUser = await User.findOne({ email: req.body.email });
    // if findUser is null, then we can create a new user
    if (!findUser) {
      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
      });
    }
  } catch (error) {
    console.error("--- ERROR IN SINGUP POST----\n", error);
    if (error.errors.phone.name === "validatorError") {
        req.flash('error', 'Phone number needs to be in format XXX-XXX-XXXX');
        res.redirect('/auth/signup');
    }
  }
});

app.post("/auth/login", (req, res) => {
  res.send(req.body);
});

const server = app.listen(PORT, () => {
  console.log("You are listening 🎧 on PORT", PORT);
});

module.exports = server;
