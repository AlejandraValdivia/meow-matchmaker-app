// sudo code goes here

// API
router.get('/user', isLoggedIn, (req, res) => {
    User.findOne({ user_id: req.user._id });
    res.render('profile', { name: name });
});







//we can get the data from mongodb and or unsplashapi