// sudo code goes here

// API
app.get('/user', isLoggedIn, (req, res) => {
    User.findOne({ user_id: req.user._id });
    res.render('profile', { name, email, phone, password });
});

app.get('/user/new', isLoggedIn, (req, res) => {
    User.findOne({ user_id: req.user._id });
    res.render('profile', { name, email, phone, password });
});









//we can get the data from mongodb and or unsplashapi