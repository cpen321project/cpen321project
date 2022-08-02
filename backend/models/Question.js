const mongoose = require('mongoose')
const { v4: uuidv4 } = require("uuid")
const forumDB = mongoose.createConnection('mongodb://localhost:27017/forum');

const questionSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replaceAll("-", ""),
        },
        topic: String,
        askerID: String,
        askerName: String,
        questionContent: mongoose.Schema.Types.Mixed,
        isAskedAnonymously: Boolean,
    },
    {
        timestamps: true,
        collection: "questions",
    }
)

module.exports = forumDB.model("Question", questionSchema)
module.exports.forumDB = forumDB

