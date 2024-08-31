const express = require('express');
const router = express.Router({ mergeParams: true });
const projectCard = require('../controllers/projectCard')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateProjectCard } = require('../middleware');

router.route('/')
    .get(catchAsync( projectCard.index ))    
    .post(isLoggedIn, validateProjectCard, catchAsync( projectCard.add ));
router.get('/addProject', isLoggedIn, catchAsync( projectCard.addForm ))

router.get('/edit', isLoggedIn, catchAsync( projectCard.editPage));
router.route('/edit/:id')
    .get(isLoggedIn, catchAsync( projectCard.editForm))
    .put(isLoggedIn, validateProjectCard, catchAsync( projectCard.edit));

router.route('/delete')
    .get(isLoggedIn, catchAsync( projectCard.deleteForm ))
    .delete(isLoggedIn, catchAsync( projectCard.delete ));

module.exports = router;

/* Note:{ mergeParams: true } Child Router: Use child routers when you need to organize routes into modules, apply specific middleware, manage complex nested routes, or maintain clean and modular code. */