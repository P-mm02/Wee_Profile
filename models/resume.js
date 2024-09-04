const mongoose = require('mongoose')
const schema = mongoose.Schema
const ResumeSchema = new schema({
    images: [
        {
            path: String,
            filename:String
        }
    ],
    /* name: String,
    email: String,
    review: String,
    rating: Number, */
    creator: {
        type: schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('resume', ResumeSchema);