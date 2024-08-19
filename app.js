const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const { ProjectCardSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ProjectCard = require('./models/projectCard');
const ExpressError = require('./utils/ExpressError');

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

const validateProjectCard = (req, res, next) => {
    const { error } = ProjectCardSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


app.get('/', (req, res) => {
    res.redirect('/home')
});
app.get('/home', catchAsync( async(req, res) => {
    const cards = await ProjectCard.find({});
    res.render('home',{cards})
}));
app.get('/deleteProject', catchAsync( async(req, res) => {
    const cards = await ProjectCard.find({});
    res.render('projectCards/deleteProject',{cards})
}));
app.get('/editProject', catchAsync( async(req, res) => {
    const cards = await ProjectCard.find({}); 
    res.render('projectCards/editProject',{cards,cardSelected:cards[0],script:"<script></script>"})   
}));
app.get('/editProject/:id', catchAsync( async(req, res) => {
    const cards = await ProjectCard.find({}); 
    cardSelected = await ProjectCard.findById(req.params.id)
    res.render('projectCards/editProject', {
        cards,
        cardSelected,
        script: "<script>document.getElementById('projectCardEditCon').classList.remove('hidden');</script>"
    });
}));

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

app.post('/projectCard', validateProjectCard, catchAsync( async (req, res) => {

    const card = new ProjectCard(req.body.projectCard);    
    await card.save();
    res.redirect('/home');
}));

app.put('/editProject/:id', validateProjectCard, catchAsync( async (req, res) => {
    await ProjectCard.findByIdAndUpdate(req.params.id, { ...req.body.projectCard });
    res.redirect(`/editProject`)
}));

app.delete('/deleteProject', catchAsync( async (req, res) => {
    const selectedCards = req.body.selectedCards
    await ProjectCard.deleteMany({
        _id: { $in: selectedCards }
    });
    res.redirect('/home');
}));

app.all('*', (req, res, next) => {    
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    console.log('err: '+err)
    console.log('err.statusCode: '+err.statusCode)
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err, statusCode })
})

app.listen(3333, () => {
    console.log('Serving on port 3333')
})