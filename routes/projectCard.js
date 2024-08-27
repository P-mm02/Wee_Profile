const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ProjectCard = require('../models/projectCard');
const { ProjectCardSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn } = require('../middleware');

const validateProjectCard = (req, res, next) => {
    const { error } = ProjectCardSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync( async(req, res) => {
    const cards = await ProjectCard.find({});
    res.render('home',{cards})
}));
router.get('/addProject', isLoggedIn, catchAsync( async(req, res) => {
    const cards = await ProjectCard.find({});
    res.render('projectCards/addProject',{cards})
}));
router.post('/', isLoggedIn, validateProjectCard, catchAsync( async (req, res) => {
    const card = new ProjectCard(req.body.projectCard);    
    await card.save();
    req.flash('success', 'Successfully Add Project!');
    res.redirect('/projectCard');
}));
router.get('/edit', isLoggedIn, catchAsync( async(req, res) => {
    const cards = await ProjectCard.find({}); 
    res.render('projectCards/editProject',{cards,cardSelected:cards[0],script:"<script></script>"})   
}));
router.get('/edit/:id', isLoggedIn, catchAsync( async(req, res) => {
    const cards = await ProjectCard.find({});
    cardSelected = await ProjectCard.findById(req.params.id)
    if (!cardSelected) {
        req.flash('error', 'Can not find that Project!');
        return res.redirect('/projectCard/edit');
    }
    res.render('projectCards/editProject', {
        cards,
        cardSelected,
        script: "<script>document.getElementById('projectCardEditCon').classList.remove('hidden');</script>"
    });
}));
router.put('/edit/:id', isLoggedIn, validateProjectCard, catchAsync( async (req, res) => {
    await ProjectCard.findByIdAndUpdate(req.params.id, { ...req.body.projectCard });
    req.flash('success', 'Successfully Edit Project!');
    res.redirect(`/projectCard/edit`)
}));
router.get('/delete', isLoggedIn, catchAsync( async(req, res) => {
    const cards = await ProjectCard.find({});
    res.render('projectCards/deleteProject',{cards})
}));
router.delete('/delete', isLoggedIn, catchAsync( async (req, res) => {
    const selectedCards = req.body.selectedCards
    await ProjectCard.deleteMany({
        _id: { $in: selectedCards }
    });
    req.flash('success', 'Successfully Delete Project!');
    res.redirect('/projectCard');
}));

module.exports = router;

/* Note:{ mergeParams: true } Child Router: Use child routers when you need to organize routes into modules, apply specific middleware, manage complex nested routes, or maintain clean and modular code. */