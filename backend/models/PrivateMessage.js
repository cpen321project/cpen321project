const mongoose = require('mongoose')
const { v4: uuidv4 } = require("uuid")

const privateMessageSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replaceAll("-", ""),
        },
        senderName: String,
        senderID: String,
        receiverName: String,
        receiverID: String,
        messageContent: mongoose.Schema.Types.Mixed,
    },
    {
        timestamps: true,
        collection: "privateMessages",
    }
)

module.exports = mongoose.model("PrivateMessage", privateMessageSchema)
