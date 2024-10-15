const tokenModel = require('../models/tokenGenerate');

module.exports.index = async(req, res) => {
    const tokens = await tokenModel.find({}).populate('creator').sort({ createdAt: -1 }).limit(100);
    res.render('tokenGenerate', {tokens});
} 
module.exports.gen = async(req, res) => {
    const tokens = await tokenModel.find({creator: req.user._id});
    if (tokens.length >= 10) {
        req.flash('error', 'You cannot generate more than 10 token!');
        res.redirect('/tokenGenerate')
    } else {
        await new tokenModel({...req.body.token, creator: req.user._id}).save();
        res.redirect('/tokenGenerate')
    }
    
} 