const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./db/db')
const { JSDOM } = require("jsdom");
// Set window from jsdom
const { window } = new JSDOM("");

// Also set global window before requiring jQuery
global.window = window;

const $ = global.jQuery = require('jquery');

// Load config
dotenv.config({ path: './config/config.env' })

// Passport config
require('./config/passport')(passport)
// we will catch this passport in the passport.js

connectDB()

const app = express()

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method Override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

app.use(function (req, res, next) {
    if (!req.user) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
    }
    next();
});

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Handlebars Helpers
const { formatDate, truncate, stripTags, editIcon, select, givePropVal, ternary } = require('./helpers/hbs')

// Handlebars
app.engine('.hbs', exphbs({
    helpers: {
        formatDate,
        truncate,
        stripTags,
        editIcon,
        select,
        givePropVal,
        ternary
    },
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', '.hbs')

// Sessions (Express session m/w)
app.use(session({
    secret: 'storyBooks',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))
// resave - we don't want to save the session if ntng is modified
// saveUninitialized - don't create a session untill something is stored

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())
// inorder to work passport for sessions we need express-session and make sure to put that m/w above this passport session

// Set global var
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
    // with the authentication m/w we access req user 
    // setting global var to null if it doesn't exist
})

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
// anything that is just / is gonna link to the routes in the file
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))
app.use('/profile', require('./routes/about'))

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
})
