const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema(
    {

        userId: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: new Date(),
        },
        image: String,
        likes: []

    },
    { timestamps: true }
)

const Post = mongoose.model("Posts", PostSchema)

module.exports = Post