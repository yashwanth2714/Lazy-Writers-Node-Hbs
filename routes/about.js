const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/authProtector')
const User = require('../models/User')
const Story = require('../models/Story')
const multer = require('multer')
const sharp = require('sharp')

// @desc Show Profile
// @route GET /profile/

router.get('/', ensureAuth, async (req, res) => {
    try {
        const publicStories = await Story.find({ user: req.user._id, status: 'public' }).lean()
        const privateStories = await Story.find({ user: req.user._id, status: 'private' }).lean()

        res.render('about', {
            publicStories: publicStories.length,
            privateStories: privateStories.length
        })
    } catch (error) {
        console.log(error);
        res.render('error/404')
    }
})

// @desc Edit Profile
// @route GET /profile/edit

router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id }).lean()
        res.render('editProfile', {
            user
        })
    } catch (error) {
        console.log(error);
        res.render('error/404')
    }
})

// @desc Update Profile
// @route PUT /profile/userId

router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let user = await User.findById(req.params.id).lean()

        if (!user) {
            res.render('error/404')
        }
        console.log(req.body);
        await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true
        })

        res.redirect('/profile')
    } catch (error) {
        console.log(error);
        res.render('error/500')
    }
})

// @desc Delete Profile
// @route PUT /profile/userId

router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        let user = await User.findById(req.params.id).lean()

        if (!user) {
            res.render('error/404')
        }
        console.log(user);
        let stories = await Story.deleteMany({ "user": req.params.id })
        console.log("deleted stories")
        console.log(stories)
        await User.findByIdAndDelete(req.params.id);
        res.redirect("/")
    } catch (error) {
        console.log(error);
        res.render('error/500')
    }
})

const profileUpload = multer({

    limits: {
        fileSize: 2000000
    },
    fileFilter(req, file, cb) {
        console.log(file);
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please provide a valid image'))
        }
        cb(undefined, true)
    }
})

// @desc Update Profile Image
// @route post /profile/image

router.post("/:id/avatar", ensureAuth, profileUpload.single('avatar'), async (req, res) => {

    // no need this bec we set accept attr as images in the input field
    // if(!req.file) {
    //     return res.status(204).send({error: 'Please provide a image'})
    // }
    console.log(req.file);
    const buffer = await sharp(req.file.buffer).resize({ width: 256, height: 256 }).png().toBuffer()
    backURL = req.header('Referer') || '/profile';
    req.user.avatar = buffer;
    req.user.image = (req.protocol + '://' + req.get('host') + req.originalUrl);
    await req.user.save()
    res.redirect(backURL)

}, (error, req, res, next) => {
    res.status(204).send()
})

router.get("/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error
        }
        console.log(user.avatar);
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router
