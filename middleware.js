const { ProjectCardSchema, ReviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {        
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/users/login');
    }    
    next();
}

module.exports.storeReturnTo = (req, res, next) => {    
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateProjectCard = (req, res, next) => {
    const { error } = ProjectCardSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = ReviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAdminDeleteReview = (req, res, next) => {
    if (req.user.role !== 'Admin') {
        req.flash('error', 'Only admin can delete reviews!')
        return res.redirect(`/reviews`);
    }else {
        next();
    }
}