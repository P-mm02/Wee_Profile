const mongoose = require('mongoose')
const schema = mongoose.Schema
const ProjectCardSchema = new schema({
    projectName: String,
    startDate: Date,
    endDate: Date,
    projecthref: String
})

module.exports = mongoose.model('ProjectCard', ProjectCardSchema);