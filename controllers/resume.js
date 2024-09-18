const ResumeSchema = require('../models/resume')
const cloudinary = require('cloudinary').v2;

module.exports.index = async(req, res) => {
    const resume = await ResumeSchema.findOne({creator: req.user._id}).populate('creator', 'username email')
    if (resume) {
        res.render('resumeEdit', {resume})
    } else {
        const resume = await new ResumeSchema({
            creator: req.user._id,
            images: [{ path: 'https://res.cloudinary.com/di70a5gqx/image/upload/v1725698483/Resume/waxtyckb4h9cwuqps1bq.jpg', filename: 'default_filename' }] 
        }).save();
        res.render('resumeEdit', {resume})
    }
}
module.exports.put = async(req, res) => {
    const resume = await ResumeSchema.findOne({creator: req.user._id}).populate('creator', 'username email')
    if (req.files && req.files.length > 0) {
        resume.images.push(...req.files.map(f => ({ path: f.path, filename: f.filename })));
    }
    await resume.save();
    console.log('req.files:', JSON.stringify(req.files, null, 2));
    
    req.flash('success', 'Successfully Edit Resume!');
    res.redirect('/resume')
    
}
module.exports.editForm = async(req, res) => {
    res.render('resumeEdit')
}

module.exports.deleteImg = async(req, res) => {
    const resume = await ResumeSchema.findOne({creator: req.user._id})
    const image = resume.images.find(img => img._id.toString() === req.params.id);
    if (!image) {
        req.flash('error', 'Image not found!');
        return res.redirect('/resume');
    }
    await cloudinary.uploader.destroy(image.filename)
    await ResumeSchema.findOneAndUpdate(
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