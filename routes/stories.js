const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/authProtector')

const Story = require('../models/Story')

// @desc Show add page
// @route GET /stories/add

router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

// @desc Process add form
// @route POST /stories

router.post('/', ensureAuth, async (req, res) => {
    try {
        // We get the user data from req.user and saving the id in the user property which refers to the owner of the stories
        // req.body actually contains the form data from add route
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error);
        res.render('error/500')
    }
})

// @desc Show all stories
// @route GET /stories

router.get('/', ensureAuth, async (req, res) => {
    try {
        console.log("hello");
        const stories = await Story.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()
        console.log(stories);
        res.render('stories/index', {
            stories
        })
    } catch (error) {
        console.log(error);
        res.render('error/500')
    }
})

// @desc Show edit page
// @route GET /stories/edit/id

router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findOne({ _id: req.params.id }).lean()
        if (!story) {
            return res.render('error/404')
        }

        if (story.user != req.user.id) {
            res.redirect("/stories")
        } else {
            res.render('stories/edit', {
                story
            })
        }
    } catch (error) {
        console.log(error);
        res.render('error/500')
    }
})

// @desc Update story
// @route PUT /stories/:id

router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean()

        if (!story) {
            return res.render('error/404')
        }

        if (story.user != req.user.id) {
            res.redirect("/stories")
        } else {
            story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true
            })
        }

        res.redirect("/dashboard")
    } catch (error) {
        console.log(error);
        res.render('error/500')
    }
})

// @desc Get Single story
// @route GET /stories/:id

router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id)
            .populate('user')
            .lean()

        if (!story) {
            return res.render('error/404')
        }

        res.render('stories/show', {
            story
        })
    } catch (error) {
        console.log(error);
        res.render('error/500')
    }
})

// @desc Delete story
// @route DELETE /stories/:id

router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        console.log(req.params.id);
        let story = await Story.findById(req.params.id);
        if (story) {
            let result = await Story.findByIdAndDelete(req.params.id);
            console.log("deleted story");
            console.log(result);
        }
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        res.render('error/500')
    }
})

// @desc User stories
// @route GET /stories/user/:userId

router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        })
            .populate('user')
            .lean()

        res.render('stories/index', {
            stories
        })
    } catch (error) {
        console.log(error);
        res.render('error/500')
    }
})

module.exports = router