if(process.env.NODED_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const ExpressError = require('./utils/ExpressError');
const User = require('./models/user')


const projectCard = require('./routes/projectCard')
const reviews = require('./routes/reviews')
const users = require('./routes/users')
const resume = require('./routes/resume')


mongoose.connect('mongodb://localhost:27017/weeProfile');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const sessionConfig = {
    secret: 'WeeSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
        /* expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7 */
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser((User.deserializeUser()))

app.use((req, res, next) => {    
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error');
    next()
})

app.use('/projectCard', projectCard)
app.use('/reviews', reviews)
app.use('/users', users)
app.use('/resume', resume)

app.get('/', (req, res) => {
    res.redirect('/projectCard')
});



app.all('*', (req, res, next) => {    
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    console.log('err, statusCode', err, statusCode);
    res.status(statusCode).render('error', { err, statusCode })
})

app.listen(3333, () => {
    console.log('Serving on port 3333')
})