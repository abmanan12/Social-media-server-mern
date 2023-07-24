const mongoose = require('mongoose')

const AuthSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    isAdmin: {
        type: String,
        default: false
    },
    profilePicture: String,
    coverPicture: String,
    about: String,
    livesin: String,
    worksAt: String,
    country: String,
    relationship: String,
    followers: [],
    following: [],
},
    { timestamps: true }
)

const User = mongoose.model('Users', AuthSchema)

module.exports = User
// export default User