const User = require('../models/user');

module.exports.loginForm = (req, res) => {
    res.render('login');
} 

module.exports.signUpForm = (req, res) => {
    res.render('signUp');
}

module.exports.signUp = async(req, res) => {
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
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/projectCard';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', "Goodbye!");
        res.redirect('/projectCard');
    });
}