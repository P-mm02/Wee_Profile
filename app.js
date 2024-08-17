const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ProjectCard = require('./models/projectCard');

mongoose.connect('mongodb://localhost:27017/projectCards');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.redirect('/home')
});
app.get('/home', async(req, res) => {
    const cards = await ProjectCard.find({});
    /* console.log(cards); */
    res.render('home',{cards})
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

app.post('/projectCard', async (req, res) => {
    const card = new ProjectCard(req.body.projectCard);
    console.log(card);
    await card.save();
    res.redirect('/home');
});

app.post('/deleteProject', async (req, res) => {
    const selectedCards = req.body.selectedCards
    const result = await ProjectCard.deleteMany({
        _id: { $in: selectedCards }
    });
    console.log(`Deleted ${result.deletedCount} project: ` + selectedCards);
    res.redirect('/home');
});

/* app.get('/makeProjectCard', async(req,res)=>{
    const card = new ProjectCard({
        projectName: 'Test1111111111111',
        projectYear: '2999',
        projecthref: '/resume'
    })
    await card.save();
    res.send(card)
}) */

app.listen(3333, () => {
    console.log('Serving on port 3333')
})