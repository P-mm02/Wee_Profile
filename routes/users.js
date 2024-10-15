const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } = require('../middleware');

router.route('/login')
    .get(users.loginForm)
    .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/users/login'}), users.login);


router.post('/loginToken', storeReturnTo, passport.authenticate('token', { failureFlash: true, failureRedirect: '/users/login' }), users.loginToken);

router.route('/signUp')
    .get(users.signUpForm)
    .post(catchAsync( users.signUp));

router.post('/signUp/check', catchAsync( users.check ));

router.post('/logout', users.logout);




module.exports = router;