const mongoose = require('mongoose')
const schema = mongoose.Schema
const ReviewSchema = new schema({
    name: String,
    email: String,
    review: String,
    rating: Number
}, {
    timestamps: true
})

module.exports = mongoose.model('Review', ReviewSchema);