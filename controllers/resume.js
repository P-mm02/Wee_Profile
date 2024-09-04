const ResumeSchema = require('../models/resume')

module.exports.index = async(req, res) => {
    const resume = await ResumeSchema.findOne({creator: req.user._id}).populate('creator', 'username email')
    if (resume) {
        res.render('resumeEdit', {resume})
    } else {
        const newResume = await new ResumeSchema({
            creator: req.user._id,
            images: [{ path: 'default/path', filename: 'default_filename' }] 
        }).save();
        console.log('newResume', newResume);
        res.render('resumeEdit', {newResume})
    }
}
module.exports.put = async(req, res) => {
    const resume = await ResumeSchema.findOne({creator: req.user._id}).populate('creator', 'username email')
    resume.images = req.files.map(f => ({path: f.path, filename: f.filename}))    
    console.log('resume', resume);
    await resume.save();
    res.render('resumeEdit')
}
module.exports.editForm = (req, res) => {
    res.render('resumeEdit')
}
