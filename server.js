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
app.use(methodOverride('_method'));
// const { TheCatAPI } = require("@thatapicompany/thecatapi");

const SECRET_SESSION = process.env.SECRET_SESSION;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const PORT = process.env.PORT || 3000;
const RAPID_API_KEY = process.env.RAPID_API_KEY;
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

    //console.log("---- RESPONSE ----", response.data); // array of objects

    for (let i = 0; i < response.data.length; i++) {
      const catData = response.data[i];
      // console.log(catData);
     
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
// app.use('/', require('./controllers/cat'));
// app.use("/cat", require("./controllers/cat"));


// --- AUTHENTICATED ROUTE: go to user profile page ---
app.get('/profile', isLoggedIn, (req, res) => {
  const { name, email, phone } = req.user;
  res.render('profile', { name, email, phone });
});

app.get("/profile/edit",  (req, res) => {
  const user = req.user;
  if (!user) {
    req.flash('error', 'User not found');
  }
  res.render("profile/edit", { user, alerts: req.flash() });
});

app.get("/profile/delete",  (req, res) => {
  const user = req.user;
  if (!user) {
    req.flash('error', 'User not found');
  }
  res.render("profile/delete", { user, alerts: req.flash() });
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
  const { User } = req.body;
  res.render("dashboard", { User });
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

// SEARCH CAT CONTROLLERS
// Route to show the search form
app.get('/search', (req, res) => {
  res.render('search', { alerts: req.flash() });
});

app.get('/no-results', (req, res) => {
  res.render('no-results', { alerts: req.flash() });
});


// Route to process the search form
app.get('/search/results', async (req, res) => {
  const { breed, origin, color } = req.query;
  const apiUrl = `https://api.thecatapi.com/v1/breeds`;
  if (!breed && !origin && !color) {
    console.log('---EMPY FORM---');
    req.flash('error', 'Please enter at least one search criteria');
    return res.redirect('/no-results');
  }

  try {
    const response = await axios.get(apiUrl, {
      headers: { 'x-api-key': process.env.CAT_API_KEY }
    });
    let cats = response.data;

    if (breed) {
      cats = cats.filter(cat => cat.name.toLowerCase().includes(breed.toLowerCase()));
    }
    if (origin) {
      cats = cats.filter(cat => cat.origin.toLowerCase().includes(origin.toLowerCase()));
    }
    if (color) {
      cats = cats.filter(cat => cat.description.toLowerCase().includes(color.toLowerCase()));
    }
    if (cats.length === 0) {
      req.flash('error', 'No results found for the given search criteria');
      return res.redirect('/no-results');
    }

    res.render('results', { cats, alerts: req.flash() });
  } catch (error) { 
    console.error(error);
    req.flash('error', 'Unable to fetch data from The Cat API');
    res.redirect('/search');
    }

});

// search by image
app.get('/images/search', async (req, res) => {
  const { image } = req.query;
  if (!image) {
    req.flash('error', 'Please enter an image URL');
    return res.redirect('/no-results');
  }

  try {
    const response = await axios.get(
      `https://api.thecatapi.com/v1/images/search?limit=20&image_url=${encodeURIComponent(image)}`,
      {
        headers: {
          accept: "application/json",
          "x-api-key": process.env.CAT_API_KEY,
        },
      }
    );

    const images = response.data;

    //console.log(images[0].url);

    res.render('images/search', { images, alerts: req.flash() });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Unable to fetch data from The Cat API');
    res.redirect('/search');
  }
});

// 404 error page
// app.get("*", (req, res) => {
//   res.render("404", {});
// });

// Route to the fan club
app.get("/fanclub", (req, res) => {
  const { User, Cat, Post, Comment, Friend } = req.body;
  res.render("fanclub/index", { User, Cat, Post, Comment, Friend });
});

// Route to the posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find({});
    res.render('posts/index', { posts });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/posts/new', (req, res) => {
  res.render('posts/new');
});

app.post('/posts', async (req, res) => {
  try {
    const { title, content, username } = req.body;
    const newPost = new Post({ title, content, username });
    await newPost.save();
    req.flash('success', 'Post created successfully');
    res.redirect('/posts');
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/posts/:id/edit', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render('posts/edit', { post });
  } catch (err) {
    console.error('Error fetching post for edit:', err);
    res.status(500).send('Server Error');
  }
});

app.put('/posts/:id', async (req, res) => {
  try {
    const { title, content, username } = req.body;
    await Post.findByIdAndUpdate(req.params.id, { title, content, username });
    req.flash('success', 'Post updated successfully');
    res.redirect('/posts');
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/posts/:id/delete', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render('posts/delete', { post });
  } catch (err) {
    console.error('Error fetching post for delete:', err);
    res.status(500).send('Server Error');
  }
});

app.delete('/posts/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    req.flash('success', 'Post deleted successfully');
    res.redirect('/posts');
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).send('Server Error');
  }
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
//         res.render('images/search', { catImage: catImage});
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
