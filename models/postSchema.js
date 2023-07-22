const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema(
    {

        userId: {
            type: String,
            required: true
        },
        description: String,
        images: String,
        likes: []

    },
    { timestamps: true }
)

const Post = mongoose.model("Posts", PostSchema)

module.exports = Post