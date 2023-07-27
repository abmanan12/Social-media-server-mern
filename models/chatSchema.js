const mongoos = require('mongoose')

const ChatSchema = new mongoos.Schema(
    {
        members: {
            type: Array,
        },
    },
    {
        timestamps: true,
    }
);

const Chats = mongoos.model('ChatUser', ChatSchema)

module.exports = Chats