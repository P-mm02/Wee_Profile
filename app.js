const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/projectCard');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home')
});
app.get('/home', (req, res) => {
    res.render('home')
});
app.get('/resume', (req, res) => {
    res.render('resume')
});
app.get('/CV', (req, res) => {
    res.render('home')
});
app.get('/YelpCapm', (req, res) => {
    res.render('home')
});
app.get('/WeeDex', (req, res) => {
    res.render('home')
});

app.listen(3333, () => {
    console.log('Serving on port 3000')
})