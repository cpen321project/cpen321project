const Message = require('../models/Message.js')
const PrivateMessage = require('../models/PrivateMessage.js')
const userStore = require('./userStore.js')
const authUtils = require("../utils/authUtils.js")

module.exports = {
    saveMessageToDB: (groupID, senderID, senderName, messageContent) => {
        let messageToSaveToDB = Message(
            {
                groupID,
                senderID,
                senderName,
                messageContent
            }
        )

        messageToSaveToDB.save(function (err) {
            if (err) {
                console.log("chatEngine: Error saving message to database: " + err)
                return err
            }
            console.log("chatEngine: Message saved to database")
        })
    },

    getConversationByGroupID: async (req, res) => {
        console.log("-------------getConversationByGroupID-------------")
        let groupID = req.params.groupID
        let userID = req.params.userID
        let jwt = req.params.jwt

        if (!groupID || !userID || !jwt) {
            console.log("Invalid parameters")
            return res.status(404).json("Invalid parameters")
        }

        let tokenValidated = await authUtils.validateAccessToken(req.params.jwt, req.params.userID)
        if (!tokenValidated) {
            console.log("Token not validated")
            return res.status(400)
        }

        // console.log("req.params.groupID: " + req.params.groupID)
        console.log("chatEngine: trying to get convo at groupID: " + groupID)

        // Message
        //     .find({ groupID })
        //     .select({
        //         _id: 0,
        //     })
        //     .sort({ createdAt: 'asc' })
        //     .exec((err, retrievedMsgs) => {
        //         if (err) {
        //             console.log("chatEngine: Error in getConversationByGroupID: " + err)
        //             return res.status(400).send(err)
        //         } else {
        //             // console.log("chatEngine: retrievedConvo: " + retrievedMsgs)
        //             return res.status(200).send({ retrievedMsgs })
        //         }
        //     })

        let retrievedMessages = Message
            .find({ groupID })
            .select({
                _id: 0,
            })
            .sort({ createdAt: 'asc' })
        if (retrievedMessages) {
            console.log("succesfully retrieved messages")
            // return res.status(200).send({ retrievedMessages })
            return res.status(200).json(retrievedMessages)
        } else {
            res.status(500).json({ success: false, err })
        }

    },

    savePrivateMessageToDB: (senderName, senderID, receiverName, receiverID, messageContent) => {
        let messageToSaveToDB = PrivateMessage(
            {
                senderName,
                senderID,
                receiverName,
                receiverID,
                messageContent
            }
        )

        messageToSaveToDB.save(function (err) {
            if (err) {
                console.log("chatEngine: Error saving private message to database: " + err)
                return err
            }
            console.log("chatEngine: Private message saved to database")
        })
    },

    getPrivateConversationByUserIDs: async (req, res) => {
        console.log("-------------getPrivateConversationByUserIDs-------------")
        let senderID = req.params.senderID
        let receiverID = req.params.receiverID
        let jwt = req.params.jwt

        if (!senderID || senderID == null || !receiverID || !jwt) {
            console.log("Invalid parameters")
            return res.status(404).json("Invalid parameters")
        }

        let tokenValidated = await authUtils.validateAccessToken(req.params.jwt, req.params.senderID)
        if (!tokenValidated) {
            console.log("Token not validated")
            return res.status(400)
        }

        console.log("chatEngine: getPrivateConversationByUserIDs: " + senderID + " -> " + receiverID)

        let senderName = await userStore.getDisplayNameByUserIDfromDB(senderID);
        let receiverName = await userStore.getDisplayNameByUserIDfromDB(receiverID);
        console.log("senderName: " + senderName)
        console.log("receiverName: " + receiverName)

        // await PrivateMessage
        //     .find({
        //         $or: [
        //             {
        //                 senderID,
        //                 receiverID
        //             },
        //             {
        //                 'senderID': receiverID,
        //                 'receiverID': senderID
        //             }
        //         ]
        //     })
        //     .select({
        //         _id: 0,
        //         senderID: 0,
        //         receiverID: 0,
        //     })
        //     .sort({ createdAt: 'asc' })
        //     .exec((err, retrievedMsgs) => {
        //         if (err) {
        //             console.log("chatEngine: Error in getPrivateConversationByUserIDs: " + err)
        //             res.status(500).json({ success: false, err })
        //             return
        //         } else {
        //             // console.log("chatEngine: retrievedConvo: " + retrievedMsgs)
        //             // console.log("succesfully retrieved messages")
        //             // res.status(200).send({ retrievedMsgs })
        //             res.status(200).json(retrievedMsgs)
        //         }
        //     })

        let retrievedMessages = await PrivateMessage
            .find({
                $or: [
                    {
                        senderID,
                        receiverID
                    },
                    {
                        'senderID': receiverID,
                        'receiverID': senderID
                    }
                ]
            })
            .select({
                _id: 0,
                senderID: 0,
                receiverID: 0,
            })
            .sort({ createdAt: 'asc' })

        if (retrievedMessages) {
            console.log("succesfully retrieved messages")
            // return res.status(200).send({ retrievedMessages })
            return res.status(200).json(retrievedMessages)
        } else {
            res.status(500).json({ success: false, err })
        }
    },

    updateUserDisplayNameInGroupChats: async (userID, newDisplayName) => {
        console.log("-------updateUserDisplayNameInGroupChats-------")
        console.log("userID: " + userID)
        console.log("newDisplayName: " + newDisplayName)

        let filter = { senderID: userID }
        let update = { senderName: newDisplayName }

        Message.updateMany(filter, update, function (err, resultAfterUpdate) {
            if (err) {
                console.log("Failed to update senderName with error: " + err)
                return false
            } else {
                console.log("senderName updated successfully, resultAfterUpdate: " + resultAfterUpdate)
                return true
            }
        })
    },

    updateUserDisplayNameInPrivateChats: async (userID, newDisplayName) => {
        console.log("-------updateUserDisplayNameInPrivateChats-------")
        console.log("userID: " + userID)
        console.log("newDisplayName: " + newDisplayName)

        let filter1 = { senderID: userID }
        let update1 = { senderName: newDisplayName }
        PrivateMessage.updateMany(filter1, update1, function (err, resultAfterUpdate) {
            if (err) {
                console.log("Failed to update senderName with error: " + err)
                return false
            } else {
                console.log("senderName updated successfully, resultAfterUpdate: " + resultAfterUpdate)
                return true
            }
        })

        let filter2 = { receiverID: userID }
        let update2 = { receiverName: newDisplayName }
        PrivateMessage.updateMany(filter2, update2, function (err, resultAfterUpdate) {
            if (err) {
                console.log("Failed to update receiverName with error: " + err)
                return false
            } else {
                console.log("receiverName updated successfully, resultAfterUpdate: " + resultAfterUpdate)
                return true
            }
        })
    }
}