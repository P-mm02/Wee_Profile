const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const { isLoggedIn, validateReview, isAdminDeleteReview } = require('../middleware');

router.get('/' , catchAsync( async(req, res) => {
    const reviews = await Review.find({}).populate('creator', 'username').sort({ createdAt: -1 })
    res.render('reviews',{reviews})
}));


router.post('/', isLoggedIn, validateReview, catchAsync( async(req, res) => {
    await new Review({...req.body.reviews, creator: req.user._id}).save();
    req.flash('success', 'Successfully Add Review!');
    res.redirect('/reviews')
}));
router.get('/:id' , isLoggedIn, isAdminDeleteReview, catchAsync( async(req, res) => {    
    await Review.deleteOne({ _id: req.params.id });
    req.flash('success', 'Successfully Delete Review!');
    res.redirect('/reviews');
}));
/* router.delete('/:id', isLoggedIn, isAdminDeleteReview, catchAsync( async (req, res) => {    
    await Review.deleteOne({ _id: req.params.id });
    req.flash('success', 'Successfully Delete Review!');
    res.redirect('/reviews');
})); */


module.exports = router;