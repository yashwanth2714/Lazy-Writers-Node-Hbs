const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/authProtector')

const Story = require('../models/Story')

// @desc Login/Landing Page
// @route GET /

// ensureGuest: only a guest who is logged in will see the dashboard
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

// @desc Dashboard
// @route GET /dashboard

router.get('/dashboard', ensureAuth, async (req, res) => {
    // Inorder to pass the data into handlebars template and render it, we need to call .lean()
    try {
        console.log("db");
        const stories = await Story.find({ user: req.user.id }).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            stories
        })
    } catch (error) {
        console.log(error);
        res.render('error/500')
    }
})

module.exports = router