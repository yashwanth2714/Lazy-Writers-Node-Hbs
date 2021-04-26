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
    // if we logged in and try to go to the landing page, I don't want them to see the login
}