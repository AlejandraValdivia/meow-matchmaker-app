require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("./config/passport-config");
const isLoggedIn = require("./middleware/isLoggedIn");
const SECRET_SESSION = process.env.SECRET_SESSION;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const PORT = process.env.PORT || 3000;
const RAPID_API_KEY = process.env.RAPID_API_KEY;
const CAT_API_KEY = process.env.CAT_API_KEY;
// import model
const { User } = require("./models");
//test model
User.find({}).then((user) => console.log("--User--", user));

const { Cat } = require("./models");
const { Post } = require("./models");
const { Comment } = require("./models");
const { Friend } = require("./models");
Cat.find({}).then((cat) => console.log("--Cat--", cat));

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

// initial passport
app.use(passport.initialize());
app.use(passport.session());

// middleware for tracking users and alerts
app.use((req, res, next) => {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next(); // going to said route
});

// --------------------- Controllers ---------------------
// Home page
app.get("/", (req, res) => {
  res.render("home", {});
});

app.get("/cats", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.thecatapi.com/v1/breeds?limit=10&page=0`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-api-key": CAT_API_KEY,
        },
      }
    );
    const catsArray = [];

    console.log("---- RESPONSE ----", response.data); // array of objects
    // show the results
    // what do we need
    // name
    for (let i = 0; i < response.data.length; i++) {
      const catData = response.data[i];
      console.log(catData);
      // create an object
      const catObject = {
        id: catData.id,
        name: catData.name,
        image: catData.image.url,
        description: catData.description,
        age: catData.life_span,
        origin: catData.origin,
        affectionLevel: catData.affection_level,
      };
      catsArray.push(catObject);
    }

    //console.log(catsArray);
    res.render("cats/index", { cats: catsArray });
  } catch (error) {
    console.error("----- ERROR in /api-test ------", error);
  }
});

app.get("/fanclub", function (req, res) {
  res.render("fanclub/index", { User, Cat, Post, Comment, Friend });
});

// import auth routes
app.use("/auth", require("./controllers/auth"));
app.use("/cat", require("./controllers/cat"));
// app.use('/', require('./controllers/cat'));

// --- AUTHENTICATED ROUTE: go to user profile page ---
app.get("/profile", isLoggedIn, (req, res) => {
  const { name, email, phone } = req.user;
  res.render("profile", { name, email, phone });
});

app.get("/application-form", (req, res) => {
  const { name, email, phone } = req.params;
  res.render("application-form", { name, email, phone });
});

app.post("/application-form", (req, res) => {
  const { name, email, phone } = req.user;
  res.render("application-form", { name, email, phone });
});

app.get("/dashboard", (req, res) => {
  const { User, Cat, Post, Comment, Friend } = req.body;
  res.render("dashboard", { User, Cat, Post, Comment, Friend });
});

// LEARN MORE CONTROLLERS
app.get("/learn-more", (req, res) => {
  const { User, Cat, Post, Comment, Friend } = req.body;
  res.render("learn-more", { User, Cat, Post, Comment, Friend });
});

// any authenticated route will need to have isLoggedIn before controller
// app.get('/pokemon', isLoggedIn, (req, res) => {
//      get data
//      render page + send data to page
// });

// CAT CONTROLLERS
// app.get('/cats', async (req, res) => {
//   const { User, Cat, Post, Comment, Friend } = req.body;
//   res.render('cats/index', { Cat });
// });
app.get("/cats", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.thecatapi.com/v1/breeds?limit=10&page=0`,
      {
        headers: {
          accept: "application/json",
          "x-api-key": CAT_API_KEY,
        },
      }
    );
    const catsArray = response.data.map((catData) => ({
      _id: catData.id, // Ensure the property name matches the template
      name: catData.name,
      image: catData.image?.url || "", // Handle possible undefined image
      description: catData.description,
      age: catData.life_span,
      origin: catData.origin,
      affectionLevel: catData.affection_level,
    }));

    res.render("cats/index", { cats: catsArray });
  } catch (error) {
    console.error("----- ERROR in /cats route ------", error);
    req.flash("error", "Failed to fetch cats");
    res.redirect("/");
  }
});

app.get("/cats/:id", async (req, res) => {
  const catId = req.params.id;
  try {
    // Fetch the breed information
    const response = await axios.get(
      `https://api.thecatapi.com/v1/breeds/${catId}`,
      {
        headers: {
          accept: "application/json",
          "x-api-key": CAT_API_KEY,
        },
      }
    );

    if (response.data) {
      // Attempt to get image from the breed data directly
      let imageUrl = response.data.image?.url || "";

      // If imageUrl is empty, try fetching from another endpoint (if applicable)
      if (!imageUrl) {
        const imageResponse = await axios.get(
          `https://api.thecatapi.com/v1/images/search?breed_ids=${catId}`,
          {
            headers: {
              accept: "application/json",
              "x-api-key": CAT_API_KEY,
            },
          }
        );

        if (imageResponse.data && imageResponse.data.length > 0) {
          imageUrl = imageResponse.data[0].url || "";
        }
      }

      const cat = {
        _id: response.data.id,
        name: response.data.name,
        image: imageUrl,
        description: response.data.description,
        age: response.data.life_span,
        origin: response.data.origin,
        affectionLevel: response.data.affection_level,
      };

      console.log("----CAT----", cat);
      res.render("cats/show", { cat });
    } else {
      req.flash("error", "Cat not found");
      res.redirect("/cats");
    }
  } catch (error) {
    console.error("----- ERROR in /cats/:id route ------", error);
    req.flash("error", "Failed to fetch cat details");
    res.redirect("/cats");
  }
});

// 404 error page
app.get("/cats/results", async (req, res) => {
  const catId = req.params.id;
  try {
    const foundCat = await Cat.findOne({ cat: req.params.id });
    if (
      foundCat._id &&
      foundCat.name &&
      foundCat.image &&
      foundCat.description &&
      foundCat.age &&
      foundCat.origin &&
      foundCat.affectionLevel
    ) {
      res.render("cats/results", { cat: foundCat });
    } else {
      axios
        .get(`https://api.thecatapi.com/v1/breeds/${catId}`)
        .then((response) => {
          console.log(response);
          const cat = {
            _id: response.data.id,
            name: response.data.name,
            image: imageUrl,
            description: response.data.description,
            age: response.data.life_span,
            origin: response.data.origin,
            affectionLevel: response.data.affection_level,
          };
          res.render("cats/results", { cat });
        })
        .catch((error) => {
          if (error.name === "AxiosError") {
            return res.render("cats/no-results", {});
          }
        });
    }
  } catch (error) {
    res.render("cats/no-results", {});
  }
});

// Route to the fan club
app.get("/fanclub", (req, res) => {
  const { User, Cat, Post, Comment, Friend } = req.body;
  res.render("fanclub/index", { User, Cat, Post, Comment, Friend });
});
// POST CONTROLLERS
app.get("/post", (req, res) => {
  const { User, Cat, Post, Comment, Friend } = req.body;
  res.render("post", { User, Cat, Post, Comment, Friend });
});

app.get("/post/new", (req, res) => {
  const { User, Cat, Post, Comment, Friend } = req.body;
  res.render("post/new", { User, Cat, Post, Comment, Friend });
});

app.get("/post/:id/edit", (req, res) => {
  res.render("post/edit", {});
});

app.put("/post/:id/edit", (req, res) => {
  res.render("post/edit", {});
});

app.get("/post/search", (req, res) => {
  res.render("post/search", {});
});

app.delete("/post/:id", (req, res) => {
  res.render("post/edit", {});
});

app.get("/post/:id/delete", (req, res) => {
  res.render("post/edit", {});
});

app.get("/post/:id/comment", (req, res) => {
  res.render("post/edit", {});
});

app.get("/post/:id/edit", (req, res) => {
  res.render("post/edit", {});
});

app.put("/post/:id/edit", (req, res) => {
  res.render("post/edit", {});
});

app.get("/post/:id/delete", (req, res) => {
  res.render("post/edit", {});
});

// COMMENTS CONTROLLERS
app.get("/comment", (req, res) => {
  const { User, Cat, Post, Comment, Friend } = req.body;
  res.render("comment", { User, Cat, Post, Comment, Friend });
});

app.get("/comment/new", (req, res) => {
  const { User, Cat, Post, Comment, Friend } = req.body;
  res.render("comment/new", { User, Cat, Post, Comment, Friend });
});

app.get("/comment/:id", (req, res) => {
  const { User, Cat, Post, Comment, Friend } = req.body;
  res.render("comment/show", { User, Cat, Post, Comment, Friend });
});

app.get("/comment/:id/edit", (req, res) => {
  const { User, Cat, Post, Comment, Friend } = req.body;
  res.render("comment/edit", { User, Cat, Post, Comment, Friend });
});

app.put("/comment/:id/edit", (req, res) => {
  const { User, Cat, Post, Comment, Friend } = req.body;
  res.render("comment/edit", { User, Cat, Post, Comment, Friend });
});

app.get("/comment/:id/delete", (req, res) => {
  const { User, Cat, Post, Comment, Friend } = req.body;
  res.render("comment/edit", {});
});

app.get("/comment/:id/comment", (req, res) => {
  const { User, Cat, Post, Comment, Friend } = req.body;
  res.render("comment/edit", {});
});

app.get("/comment/:id/edit", (req, res) => {
  const { User, Cat, Post, Comment, Friend } = req.body;
  res.render("comment/edit", {});
});

app.put("/comment/:id/edit", (req, res) => {
  const { User, Cat, Post, Comment, Friend } = req.body;
  res.render("comment/edit", {});
});

app.get("/comment/:id/delete", (req, res) => {
  const { User, Cat, Post, Comment, Friend } = req.body;
  res.render("comment/edit", {});
});

app.get("/event", (req, res) => {
  const { User, Cat, Post, Comment, Friend } = req.body;
  res.render("event", { User, Cat, Post, Comment, Friend });
});

// Contact Form
app.get("/contact", (req, res) => {
  const { name, email, password } = req.body;
  res.render("contact", { name, email, password });
});

// app.get('/images/search', (req, res) => {
//     axios
//     .get('https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=1')
//     .then((response) => {
//         const catImage = {
//             id: response.data.id,
//             image: response.data.url,
//         }
//         console.log(catImage);
//         res.send(catImage);
//         res.render('search', { catImage: catImage});
// })
// .catch((err) => {
//     console.error(err);
//     });
// })

// --- AUTHENTICATED ROUTE: go to user profile page ---
// app.get('/users/:id ', isLoggedIn, (req, res) => {
//     let { id } = req.params;
//     User.findById(id)
//         .then(user => {
//             res.render('profile', { user });
//         })
//         .catch(error => console.log('--- ERROR ---\n', error));
// });

// -------------- UNCOMMENT BELOW TO get random photo
// app.get("/unsplash-api-test", (req, res) => {
//   axios
//     .get("https://api.unsplash.com/photos/random", {
//       headers: {
//         Authorization: "Client-ID" + process.env.UNSPLASH_ACCESS_KEY,
//       },
//       params: {
//         query: "cat",
//         count: 20,
//       },
//     })
//     .then((response) => {
//       res.json(response.data);
// const catObj = {
//   name: response.data.name,
//   url: response.data.urls.regular,
//   description: response.data.description,
//   id: response.data.id,
//   color: response.data.color,
//   links: response.data.links,
//   user: response.data.user,
//   location: response.data.location,
// };
// res.render("cats", { cats: catObj });
// console.log("----cats data:\n", catObj);
//     })
//     .catch((error) => {
//       console.log("Error:", error);
//res.status(500).send("Error fetching random photo");
//     });
// });

// Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
