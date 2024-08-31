const Review = require('../models/review');

module.exports.index = async(req, res) => {
    const reviews = await Review.find({}).populate('creator', 'username').sort({ createdAt: -1 })
    res.render('reviews',{reviews})
}

module.exports.add = async(req, res) => {
    await new Review({...req.body.reviews, creator: req.user._id}).save();
    req.flash('success', 'Successfully Add Review!');
    res.redirect('/reviews')
}

module.exports.delete = async(req, res) => {    
    await Review.deleteOne({ _id: req.params.id });
    req.flash('success', 'Successfully Delete Review!');
    res.redirect('/reviews');
}
