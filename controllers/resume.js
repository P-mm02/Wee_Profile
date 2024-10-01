const ResumeModel = require('../models/resume')
const cloudinary = require('cloudinary').v2;

module.exports.index = async(req, res) => {
    const resume = await ResumeModel.findOne({creator: req.user._id}).populate('creator', 'username email')
    if (resume) {
        res.render('resumeEdit', {resume})
    } else {
        const resume = await new ResumeModel({         
            creator: req.user._id,
        }).save();
        res.render('resumeEdit', {resume})
    }
}
module.exports.put = async(req, res) => {
    
    if (req.files && req.files.length > 0) {
        const resume = await ResumeModel.findOne({creator: req.user._id}).populate('creator', 'username email')
        resume.images.push(...req.files.map(f => ({ path: f.path, filename: f.filename })));
        Object.assign(resume, req.body.resume);
        await resume.save();
    }else{
        await ResumeModel.findOneAndUpdate({creator: req.user._id}, { ...req.body.resume });
    }
    
    req.flash('success', 'Successfully Edit Resume!');
    res.redirect('/resume')
    
}
module.exports.editForm = async(req, res) => {
    res.render('resumeEdit')
}

module.exports.deleteImg = async(req, res) => {
    const resume = await ResumeModel.findOne({creator: req.user._id})
    const image = resume.images.find(img => img._id.toString() === req.params.id);
    if (!image) {
        req.flash('error', 'Image not found!');
        return res.redirect('/resume');
    }
    await cloudinary.uploader.destroy(image.filename)
    await ResumeModel.findOneAndUpdate(
        { creator: req.user._id },  // Find the resume of the current user
        { $pull: { images: { _id: req.params.id } } },  // Remove the image with the given ID
        { new: true }  // Return the updated document
    );
    req.flash('success', 'Successfully Delete Image!');
    res.redirect('/resume');   
}
module.exports.delete = async(req, res) => {    
    await Review.deleteOne({ _id: req.params.id });
    req.flash('success', 'Successfully Delete Review!');
    res.redirect('/reviews');
}