require("dotenv").config();
const express = require("express");
const app = express();
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("./config/passport-config");
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');

// Set environment variables
const { SECRET_SESSION, MONGO_URI } = process.env;
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + "/public"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(
  session({
    secret: SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next(); 
});

// Import routes
app.use("/auth", require("./controllers/auth"));
app.use("/dashboard", require("./controllers/dashboard"));
app.use("/profile", require("./controllers/profile"));
app.use("/posts", require("./controllers/post"));
app.use("/comments", require("./controllers/comment"));
app.use("/cats", require("./controllers/cats"));
app.use("/fanclub", require("./controllers/fanclub"));
app.use("/application-form", require("./controllers/application-form"));
app.use("/learn-more", require("./controllers/learn-more"));
app.use("/contact", require("./controllers/contact"));

// Home page
app.get("/", (req, res) => {
  res.render("home", {});
});

// Error handling for 404 responses
app.all('*', (req, res) => {
  res.status(404).render('404');
});

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

// Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
