const express = require('express')

const User = require('../models/authSchema')

const router = express.Router()
const bcript = require('bcrypt')


// get a user
router.get('/getuser/:id', async (req, res) => {

    let id = req.params.id

    try {

        let user = await User.findById(id)

        if (user) {

            let { password, ...otherDetails } = user._doc
            res.status(200).json(otherDetails)

        }
        else {
            res.status(404).json('No such user exist')
        }

    }
    catch (err) {
        res.status(500).json(err)
    }

})


// update a user
router.put('/updateuser/:id', async (req, res) => {

    let id = req.params.id

    try {

        const { currentUserId, currentUserAdminStatus, password } = req.body

        if (id === currentUserId || currentUserAdminStatus) {

            if (password) {
                let salt = await bcript.genSalt(10)
                req.body.password = await bcript.hash(password, salt)
            }

            const user = await User.findByIdAndUpdate(id, req.body, { new: true })

            res.status(200).json(user)

        }
        else {
            res.status(403).json("Access denied! you can't update others profile")
        }

    }
    catch (err) {
        res.status(500).json(err)
    }
})


// delete a user
router.delete('/deleteuser/:id', async (req, res) => {

    let id = req.params.id

    try {

        const { currentUserId, currentUserAdminStatus } = req.body

        if (id === currentUserId || currentUserAdminStatus) {

            await User.findByIdAndDelete(id)
            res.status(200).json('User deleted successfully!')

        }
        else {
            res.status(403).json("Access denied! you can't delete others profile")
        }

    }
    catch (err) {
        res.status(500).json(err)
    }

})


// follow a user
router.put('/:id/follow', async (req, res) => {

    const id = req.params.id

    const { currentUserId } = req.body

    if (currentUserId === id) {
        res.status(403).json('Action forbidden')
    }
    else {
        try {

            let followUser = await User.findById(id)
            let followingUser = await User.findById(currentUserId)

            if (!followUser.followers.includes(currentUserId) &&
                !followUser.following.includes(currentUserId)) {

                await followUser.updateOne({ $push: { followers: currentUserId } })
                await followingUser.updateOne({ $push: { following: id } })

                res.status(200).json('User Followed!')

            }
            else {

                // await followUser.updateOne({ $pull: { followers: currentUserId } })
                // await followingUser.updateOne({ $pull: { following: id } })
                // res.status(403).json('User unfollowed you')
                res.status(403).json('User already followed you')

            }

        } catch (error) {
            res.status(500).json(error)
        }
    }

})


// unfollow a user
router.put('/:id', async (req, res) => {

    const id = req.params.id

    const { currentUserId } = req.body

    if (currentUserId === id) {
        res.status(403).json('Action forbidden')
    }
    else {
        try {

            let followUser = await User.findById(id)
            let followingUser = await User.findById(currentUserId)

            if (followUser.followers.includes(followingUser.id)) {

                await followUser.updateOne({ $pull: { followers: currentUserId } })
                await followingUser.updateOne({ $pull: { following: id } })

                res.status(200).json('User unfollowed1!')

            }
            else if (followUser.following.includes(followingUser.id)) {

                await followUser.updateOne({ $pull: { following: currentUserId } })
                await followingUser.updateOne({ $pull: { followers: id } })

                res.status(200).json('User unfollowed2!')

            }
            else {
                res.status(403).json('User is not followed you')
            }

        } catch (error) {
            res.status(500).json(error)
        }
    }

})

module.exports = router