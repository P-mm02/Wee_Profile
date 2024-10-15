const passport = require('passport');
const CustomStrategy = require('passport-custom').Strategy;
const User = require('../models/user');
const tokenModel = require('../models/tokenGenerate');
const Review = require('../models/review');
const ResumeModel = require('../models/resume');
const ProjectCard = require('../models/projectCard');

// Define custom Passport strategy for token-based authentication
passport.use('token', new CustomStrategy(async (req, done) => {
    const { testerToken } = req.body;
    const testerTokenCheck = await tokenModel.findOne({ token: testerToken });

    if (testerTokenCheck) {
        // Delete the old user and their associated records
        const oldUser = await User.findOneAndDelete({ username: testerToken });
        
        if (oldUser) {
            await Review.deleteMany({ creator: oldUser._id });
            await ResumeModel.deleteMany({ creator: oldUser._id });
            await ProjectCard.deleteMany({ creator: oldUser._id });
            await tokenModel.deleteMany({ creator: oldUser._id });

        }
        
        // Create a new user with the same token as username, email, etc.
        const newUser = new User({
            email: 'Tester@' + testerToken, 
            username: testerToken,
            testerToken: testerToken, 
            role: 'Tester'
        });
        const registerNewUser = await User.register(newUser, testerToken)
       
        return done(null, registerNewUser);
    } else {
        // If the token doesn't match, flash an error
        req.flash('error', 'Tester Token is incorrect!');
        return done(null, false );
    }
}));

module.exports = passport;
