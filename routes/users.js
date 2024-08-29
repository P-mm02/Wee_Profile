const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport')
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { storeReturnTo } = require('../middleware');

router.get('/login', (req, res) => {
    res.render('login')
});
router.get('/signUp', (req, res) => {
    res.render('signUp')
});

router.post('/signUp', catchAsync( async(req, res) => {
    const {email, username, password, passwordConfirm, testerToken} = req.body
    if (password === passwordConfirm) {
        try {
            let role = ''
            if (testerToken) {
                role = 'Tester'
            } else {
                role = 'Vistor'
            }
            const user = new User({email, username, testerToken, role})
            const registerUser = await User.register(user, password)
            req.login(registerUser, (err) => {
                if (err) return next(err);
                req.flash('success', 'Successfully registered and logged in!');
                res.redirect('/projectCard');
            });
        } catch (e) {
            req.flash('error', e.message)
            res.redirect('signUp')
        }    
    } else {
        req.flash('error', 'Invalid password confirmation')
        res.redirect('signUp')
    }
}));

router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
        req.flash('success', 'Welcome back!');
        const redirectUrl = res.locals.returnTo || '/projectCard';
        res.redirect(redirectUrl);
    });

router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', "Goodbye!");
        res.redirect('/projectCard');
    });
});




module.exports = router;