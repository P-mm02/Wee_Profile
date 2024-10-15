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
            let role = 'Visitor'
            if (testerToken) {
                const testerTokenCheck = await tokenModel.find({token: testerToken});
                if (testerTokenCheck.length > 0) {
                    role = 'Tester'
                } else {
                    role = 'Visitor'
                    req.flash('error', 'Tester Token does not correct!');
                    return res.redirect('signUp');
                }
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

module.exports.loginToken = (req, res) => {
    req.flash('success', 'Successfully generate new user and logged in!');
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

module.exports.check = async(req, res, next) => {    
    const { username, email } = req.body;    
    
    if (username) {
        const userWithUsername = await User.findOne({ username });
        if (userWithUsername) {
            return res.json({ success: false, message: 'This username is already taken!' });
        }
        res.json({ success: true, message: 'Available' });
    }
    if (email) {
        const userWithEmail = await User.findOne({ email });
        if (userWithEmail) {
            return res.json({ success: false, message: 'This email is already taken!' });
        }
        res.json({ success: true, message: 'Available' });
    }
}