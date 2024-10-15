const mongoose = require('mongoose')
const schema = mongoose.Schema
const tokenModel = new schema({
    token: String,
    creator: {
        type: schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Token', tokenModel);