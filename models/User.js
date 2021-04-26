const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        default: 'Click the edit icon to write about yourself...'
    },
    avatar: {
        type: Buffer
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User