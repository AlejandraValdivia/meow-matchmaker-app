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
User.find({})
.then(user => console.log('--User--', user));
 
const { Cat } = require("./models");
const { post } = require("./controllers/auth");
Cat.find({})
 .then(cat => console.log('--Cat--', cat));

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
  res.render("home", { });
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
        name: catData.name,
        image: catData.image.url,
        description: catData.description,
        age: catData.life_span,
        origin: catData.origin,
        affectionLevel: catData.affection_level
      };
      catsArray.push(catObject);
    }
    
    console.log(catsArray);
    res.render("cats/index", { cats: catsArray });
  } catch (error) {
    console.error("----- ERROR in /api-test ------", error);
  }
});

app.get("/fanclub", function (req, res) {
    res.render("fanclub/index", { name, email, User, username });
});

app.get("/application", function (req, res) {
res.render("application/index", { name, email, User, username });
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

// import auth routes
app.use('/auth', require('./controllers/auth'));
app.use('/cat', require('./controllers/cat'));
// app.use('/', require('./controllers/cat'));

// --- AUTHENTICATED ROUTE: go to user profile page --- 
app.get('/profile', isLoggedIn, (req, res) => {
    const { name, email, phone } = req.user;
    res.render('profile', { name, email, phone });
});

app.get('/application-form', (req, res) => {
    const { name, email, phone } = req.user;
    res.render('application-form', { name, email, phone });
});

app.post('/application-form', (req, res) => {
    const { name, email, phone } = req.user;
    res.render('application-form', { name, email, phone });
});

app.get('/dashboard', (req, res) => {
    const { User, Cat, Post, Comment, Friend } = req.body;
    res.render('dashboard', { User, Cat, Post, Comment, Friend });
});

// any authenticated route will need to have isLoggedIn before controller
// app.get('/pokemon', isLoggedIn, (req, res) => {
//      get data
//      render page + send data to page
// });

// CAT CONTROLLERS
// app.get('/cat', isLoggedIn, (req, res) => {
//     res.render('cat/index', {});
// });

// app.get('/cat/search', isLoggedIn, (req, res) => {
//     res.render('cat/search', {});
// });

// app.delete('/cat/:id', isLoggedIn, (req, res) => {
//     res.render('cat/edit', {});
// });

// POST CONTROLLERS
app.get('/post', (req, res) => {
    res.render('post/index', { });
});

app.get('/post/new', (req, res) => {
    res.render('post/new', {});
});

app.get('/post/:id', (req, res) => {
    res.render('post/show', {});
});

app.get('/post/:id/edit', (req, res) => {
    res.render('post/edit', {});
});

app.put('/post/:id/edit', (req, res) => {
    res.render('post/edit', {});
});

app.get('/post/search', (req, res) => {
    res.render('post/search', {});
});

app.delete('/post/:id', (req, res) => {
    res.render('post/edit', {});
});

app.get('/post/:id/delete', (req, res) => {
    res.render('post/edit', {});
});
app.get('/post/:id/like', (req, res) => {
    res.render('post/edit', {});
});
app.get('/post/:id/unlike', (req, res) => {
    res.render('post/edit', {});
});
app.get('/post/:id/comment', (req, res) => {
    res.render('post/edit', {});
});
app.get('/post/:id/edit', (req, res) => {
    res.render('post/edit', {});
});
app.put('/post/:id/edit', (req, res) => {
    res.render('post/edit', {});
});
app.get('/post/:id/delete', (req, res) => {
    res.render('post/edit', {});
}
);
// COMMENTS CONTROLLERS
app.get('/comment', (req, res) => {
    res.render('comment/index', { CommentController});
});

app.get('/comment/new', (req, res) => {
    res.render('comment/new', { CommentController});
});

app.get('/comment/:id', (req, res) => {
    res.render('comment/show', { CommentController});
});

app.get('/comment/:id/edit', (req, res) => {
    res.render('comment/edit', { CommentController});
});

app.put('/comment/:id/edit', (req, res) => {
    res.render('comment/edit', { CommentController});
});

app.get('/comment/:id/delete', (req, res) => {
    res.render('comment/edit', {});
});

app.get('/comment/:id/like', (req, res) => {
    res.render('comment/edit', {});
});

app.get('/comment/:id/unlike', (req, res) => {
    res.render('comment/edit', {});
});

app.get('/comment/:id/comment', (req, res) => {
    res.render('comment/edit', {});
});

app.get('/comment/:id/edit', (req, res) => {
    res.render('comment/edit', {});
});
app.put('/comment/:id/edit', (req, res) => {
    res.render('comment/edit', {});
});
app.get('/comment/:id/delete', (req, res) => {
    res.render('comment/edit', {});
});






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
