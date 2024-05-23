const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { validPassword } = require("../utils");
const { User } = require("../models");

const STRATEGY = new LocalStrategy(
  {
    usernameField: "email", // username field instead of the email
    passwordField: "password",
  },
  async (email, password, callback) => {
    try {
      const user = await User.findOne({ email });
      if (!user || !validPassword(password, user.password)) {
        // user.password is the hashed password and is going to compare it to the one the user entered
        callback(null, false);
      } else {
        callback(null, user);
      }
    } catch (error) {
      console.log("---Error: \n" + error);
    }
  }
);

passport.serializeUser((user, callback) => {
  callback(null, user.email); // might switch to user.id
});

passport.deserializeUser(async (email, callback) => {
  try {
    const user = await User.findOne({ email });

    if (user) {
      callback(null, user);
    }
  } catch (error) {
    console.log("----ERROR IN PASSPORT CONFIG---- \n", error);
  }
});

passport.use(STRATEGY);

module.exports = passport;
