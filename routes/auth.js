const express = require('express')
const passport = require('passport')
const router = express.Router()

// @desc Auth with Google
// @route GET /auth/google

router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

// @desc Google auth callback
// @route GET /auth/google/callback

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/dashboard')
    }
)

// @desc Logout User
// @route GET /auth/logout
router.get('/logout', (req, res) => {
    req.logout()
    req.session.destroy((err) => {
        if (err) {
            return res.render('error/404')
        } else {
            req.session = null;
            console.log("logout successful");
            return res.redirect('/');
        }
    });

    //res.redirect('/')
})
// with the password middleware once we login, we will have logout method on the req object

module.exports = router