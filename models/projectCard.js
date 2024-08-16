const mongoose = require('mongoose')
const schema = mongoose.Schema
const ProjectCardSchema = new schema({
    projectName: String,
    projectYear: String,
    projecthref: String
})