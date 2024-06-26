function isLoggedIn(req, res, next) {
    if (!req.user) {
        req.flash('error', 'You must be signed in to view this page. Please login...');
        res.redirect('/auth/login');
    } else {
        next();
    }
}

module.exports = isLoggedIn;