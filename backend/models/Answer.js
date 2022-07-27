const mongoose = require('mongoose')
const { v4: uuidv4 } = require("uuid")
var forumDB = mongoose.createConnection('mongodb://localhost:27017/forum');

const answerSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replaceAll("-", ""),
        },
        questionID: String,
        topic: String,
        answererID: String,
        answererName: String,
        answerContent: mongoose.Schema.Types.Mixed,
        isAnsweredAnonymously: Boolean,
    },
    {
        timestamps: true,
        collection: "answers",
    }
)

module.exports = forumDB.model("Answer", answerSchema)
