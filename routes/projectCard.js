const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ProjectCard = require('../models/projectCard');
const { isLoggedIn, validateProjectCard } = require('../middleware');

router.get('/', catchAsync( async(req, res) => {
    const cards = await ProjectCard.find({}).populate('creator', 'username');
    /* console.log(cards) */
    res.render('home',{cards})
}));
router.get('/addProject', isLoggedIn, catchAsync( async(req, res) => {
    const cards = await ProjectCard.find({}).populate('creator', 'username');
    res.render('projectCards/addProject',{cards})
}));
router.post('/', isLoggedIn, validateProjectCard, catchAsync( async (req, res) => {    
    const card = new ProjectCard(req.body.projectCard);
    card.creator = req.user._id    
    await card.save();
    req.flash('success', 'Successfully Add Project!');
    res.redirect('/projectCard');
}));

router.get('/edit', isLoggedIn, catchAsync( async(req, res) => {
    const cards = await ProjectCard.find({}).populate('creator', 'username'); 
    res.render('projectCards/editProject',{cards,cardSelected:cards[0],script:"<script></script>"})   
}));
router.get('/edit/:id', isLoggedIn, catchAsync( async(req, res) => {
    const cards = await ProjectCard.find({}).populate('creator', 'username');
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
    const card = await ProjectCard.findById(req.params.id)    
    if (!card.creator.equals(req.user._id)) {
        req.flash('error', 'You can only edit your own projects if you are not an admin.')
        return res.redirect(`${card._id}`);
    }
    await ProjectCard.findByIdAndUpdate(req.params.id, { ...req.body.projectCard });
    req.flash('success', 'Successfully Edit Project!');
    res.redirect(`/projectCard/edit`)
}));

router.get('/delete', isLoggedIn, catchAsync( async(req, res) => {
    const cards = await ProjectCard.find({}).populate('creator', 'username');
    res.render('projectCards/deleteProject',{cards})
}));
router.delete('/delete', isLoggedIn, catchAsync(async (req, res) => {
    const selectedCards = req.body.selectedCards;
    const cards = await ProjectCard.find({ _id: { $in: selectedCards } });

    for (let card of cards) {
        if (!card.creator.equals(req.user._id)) {
            req.flash('error', 'You can only delete your own projects if you are not an admin.');
            return res.redirect('delete');
        }
    }

    await ProjectCard.deleteMany({ _id: { $in: selectedCards } });
    req.flash('success', 'Successfully deleted selected projects!');
    res.redirect('/projectCard');
}));

module.exports = router;

/* Note:{ mergeParams: true } Child Router: Use child routers when you need to organize routes into modules, apply specific middleware, manage complex nested routes, or maintain clean and modular code. */