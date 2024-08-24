const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const { ReviewSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');

const validateReview = (req, res, next) => {
    const { error } = ReviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


router.get('/', catchAsync( async(req, res) => {
    const reviews = await Review.find({}).sort({ createdAt: -1 })
    res.render('reviews',{reviews})
}));
router.post('/', validateReview, catchAsync( async(req, res) => {
    await new Review(req.body.reviews).save();
    res.redirect('/reviews')
}));
router.delete('/:id', catchAsync( async (req, res) => {
    await Review.deleteOne({ _id: req.params.id });
    res.redirect('/reviews');
}));


module.exports = router;