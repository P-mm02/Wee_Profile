const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const projectCard = require('./routes/projectCard')
const reviews = require('./routes/reviews')


mongoose.connect('mongodb://localhost:27017/projectCards');

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
        maxAge: 1000 * 60 * 10
        /* expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7 */
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error');
    next()
})

app.use('/projectCard', projectCard)
app.use('/reviews', reviews)

app.get('/', (req, res) => {
    res.redirect('/projectCard')
});

app.get('/login', (req, res) => {
    res.render('login')
});
app.get('/signUp', (req, res) => {
    res.render('signUp')
});
app.get('/resume', (req, res) => {
    res.render('resume')
});

app.all('*', (req, res, next) => {    
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    /* console.log('err: '+err)
    console.log('err.statusCode: '+err.statusCode) */
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err, statusCode })
})

app.listen(3333, () => {
    console.log('Serving on port 3333')
})