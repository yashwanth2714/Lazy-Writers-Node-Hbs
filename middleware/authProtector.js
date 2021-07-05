module.exports = {
    ensureAuth(req, res, next) {
        console.log("auth ", req.headers.referer);
        console.log(req.isAuthenticated());
        if (req.isAuthenticated()) {
            return next()
        } else {
            res.redirect('/')
        }
    },
    ensureGuest(req, res, next) {
        console.log("guest ", req.headers.referer);
        if (req.isAuthenticated()) {
            console.log("hello");
            res.redirect('/dashboard')
        } else {
            return next()
        }
    }
    // We don't show the login page if the user is logged in
}