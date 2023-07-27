const express = require('express')

const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/authSchema')


// register a user
router.post('/register', async (req, res) => {

    const { username, password, firstname, lastname } = req.body

    if (!username || !password || !firstname || !lastname) {
        return res.status(422).json("Plz fill all fields properly")
    }

    try {

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        req.body.password = hashPassword

        let userExist = await User.findOne({ username: username })

        if (userExist) {
            return res.status(422).json("User already exist")
        }
        else {
            const newUser = new User(req.body)

            const userExist = await newUser.save()

            const token = jwt.sign({ id: userExist._id, username: userExist.username },
                process.env.JWTKEY, { expiresIn: "4h" })

            res.status(200).json({ userExist, token })
        }

    } catch (err) {
        res.status(500).json({ message: err.message })
    }

})


// login a user
router.post('/login', async (req, res) => {

    const { username, password } = req.body

    try {

        if (!username || !password) {
            return res.status(422).json("Plz fill all fields properly")
        }

        let userExist = await User.findOne({ username: username })

        if (userExist) {

            const passIsMatch = await bcrypt.compare(password, userExist.password)

            if (!passIsMatch) {
                res.status(400).json('Invalid Credentials')
            }
            else {

                const token = jwt.sign({ id: userExist._id, username: userExist.username },
                    process.env.JWTKEY, { expiresIn: "4h" })

                res.status(200).json({ userExist, token })
            }

        }
        else {
            res.status(400).json('Invalid Credentials')
        }

    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }

})

module.exports = router