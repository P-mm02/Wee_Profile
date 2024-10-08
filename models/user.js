const { types } = require('joi')
const mongoose = require('mongoose')
const schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    testerToken: String,
    role: String
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)