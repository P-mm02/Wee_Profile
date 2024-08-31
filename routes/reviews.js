const express = require('express');
const router = express.Router();
const reviews = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateReview, isAdminDeleteReview } = require('../middleware');

router.route('/')
    .get(catchAsync( reviews.index ))
    .post(isLoggedIn, validateReview, catchAsync( reviews.add ));

router.route('/:id')
    .get(isLoggedIn, isAdminDeleteReview, catchAsync( reviews.delete ))
    .delete(isLoggedIn, isAdminDeleteReview, catchAsync( reviews.delete ));


module.exports = router;