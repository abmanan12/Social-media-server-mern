const { default: mongoose } = require('mongoose')
const express = require('express')

const Post = require('../models/postSchema')
const User = require('../models/authSchema')

const router = express.Router()


// publish a post
router.post('/post', async (req, res) => {

    const post = new Post(req.body)

    try {

        await post.save()
        res.status(200).json(post)

    } catch (error) {
        res.status(500).json(error)
    }

})


// get a post
router.get('/getpost/:id', async (req, res) => {

    const id = req.params.id

    try {

        const post = await Post.findById(id)
        res.status(200).json(post)

    } catch (error) {
        res.status(500).json(error)
    }

})


// update a post
router.put('/update/:id', async (req, res) => {

    const postId = req.params.id
    const { userId } = req.body

    try {

        const post = await Post.findById(postId)

        if (post.userId === userId) {

            await post.updateOne({ $set: req.body })
            res.status(200).json('Post updated successfully')

        } else {
            res.status(403).json("Action forbidden! You can't update others post")
        }

    } catch (error) {
        res.status(500).json(error)
    }

})


// delete a post
router.delete('/delete/:id', async (req, res) => {

    const postId = req.params.id
    const { userId } = req.body

    try {

        const post = await Post.findById(postId)

        if (post.userId === userId) {

            await post.deleteOne()
            res.status(200).json('Post deleted successfully')

        } else {
            res.status(403).json("Action forbidden! You can't delete others post")
        }

    } catch (error) {
        res.status(500).json(error)
    }

})


// like / dislike a post
router.put('/:id/like', async (req, res) => {

    const postId = req.params.id
    const { userId } = req.body

    try {

        const post = await Post.findById(postId)

        if (!post.likes.includes(userId)) {

            await post.updateOne({ $push: { likes: userId } })
            res.status(200).json('Post liked')

        }
        else {
            await post.updateOne({ $pull: { likes: userId } })
            res.status(200).json('Post dislike')
        }

    } catch (error) {
        res.status(500).json(error)
    }

})


// get  timeline
router.get('/:id/timeline', async (req, res) => {

    const userId = req.params.id

    try {

        const currentUserPost = await Post.find({ userId: userId })
        const followingPosts = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: 'following',
                    foreignField: 'userId',
                    as: 'followingPost'
                }
            },
            {
                $project: {
                    followingPost: 1,
                    _id: 0
                }
            }
        ])

        res.status(200).json(currentUserPost.concat(...followingPosts[0].followingPost)
            .sort((a, b) => b.createdAt - a.createdAt))

    } catch (error) {
        res.status(500).json(error)
    }

})


module.exports = router