const mongoose = require('mongoose')
const schema = mongoose.Schema
const ResumeSchema = new schema({
    images: [
        {
            path: String,
            filename:String
        }
    ],
    phoneNumber: String,
    email: String,
    gitHub: String,
    address: String,
    education: [
        {   
            institution: String,
            major: String,           
            degree: String,            
            gradYear: Number
        }
    ],
    languageSkill: [
        {   
            language: String,
            rating: Number
        }
    ],

    name: String,
    lookingFor: [
        {   
            position: String
        }
    ],
    introduction: String,
    skills: [
        {   
            skill: String,
            rating: Number
        }
    ],
    experience: [
        {   
            period: String,
            position: String,
            description: String
        }
    ],    
    creator: {
        type: schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('resume', ResumeSchema);