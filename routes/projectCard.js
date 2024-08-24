const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ProjectCard = require('../models/projectCard');
const { ProjectCardSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');

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
router.post('/', validateProjectCard, catchAsync( async (req, res) => {
    const card = new ProjectCard(req.body.projectCard);    
    await card.save();
    res.redirect('/home');
}));
router.get('/edit', catchAsync( async(req, res) => {
    const cards = await ProjectCard.find({}); 
    res.render('projectCards/editProject',{cards,cardSelected:cards[0],script:"<script></script>"})   
}));
router.get('/edit/:id', catchAsync( async(req, res) => {
    const cards = await ProjectCard.find({}); 
    cardSelected = await ProjectCard.findById(req.params.id)
    res.render('projectCards/editProject', {
        cards,
        cardSelected,
        script: "<script>document.getElementById('projectCardEditCon').classList.remove('hidden');</script>"
    });
}));
router.put('/edit/:id', validateProjectCard, catchAsync( async (req, res) => {
    await ProjectCard.findByIdAndUpdate(req.params.id, { ...req.body.projectCard });
    res.redirect(`/projectCard/edit`)
}));
router.get('/delete', catchAsync( async(req, res) => {
    const cards = await ProjectCard.find({});
    res.render('projectCards/deleteProject',{cards})
}));
router.delete('/delete', catchAsync( async (req, res) => {
    const selectedCards = req.body.selectedCards
    await ProjectCard.deleteMany({
        _id: { $in: selectedCards }
    });
    res.redirect('/home');
}));

module.exports = router;