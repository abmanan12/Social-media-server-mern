const mongoos = require('mongoose')

const MessageSchema = new mongoos.Schema(
    {
        chatId: {
            type: String,
        },
        senderId: {
            type: String,
        },
        text: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
)

const Messages = mongoos.model('ChatMessages', MessageSchema)

module.exports = Messages