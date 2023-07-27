const express = require('express')

const User = require('../models/authSchema')
const Chat = require('../models/chatSchema')

const router = express.Router()


// get user with search params
router.get('/searchUsers/:query', async (req, res) => {

    const query = req.params.query;

    try {
        const users = await User.find({
            $or: [
                { firstname: { $regex: query, $options: 'i' } }, // Case-insensitive search for first name
                { lastname: { $regex: query, $options: 'i' } },  // Case-insensitive search for last name
                { username: { $regex: query, $options: 'i' } },  // Case-insensitive search for username
            ],
        });

        res.status(200).json(users);

    } catch (error) {
        res.status(500).json(error);
    }
});


// create chat
router.post('/chat', async (req, res) => {

    const newChat = new Chat({
        members: [req.body.senderId, req.body.receiverId],
    });

    try {

        const result = await newChat.save()
        res.status(200).json(result)

    } catch (error) {
        res.status(500).json(error)
    }

})


// user chats
router.get('/chat/:userId', async (req, res) => {

    try {

        const chat = await Chat.find({
            members: { $in: [req.params.userId] },
        });

        res.status(200).json(chat);

    } catch (error) {
        res.status(500).json(error);
    }

})


// find chat
router.get('/chat/find/:firstId/:secondId', async (req, res) => {

    try {

        const chat = await Chat.findOne({
            members: { $all: [req.params.firstId, req.params.secondId] },
        });

        res.status(200).json(chat)

    } catch (error) {
        res.status(500).json(error)
    }

})


module.exports = router