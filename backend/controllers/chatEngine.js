const Message = require('../models/Message.js')
const PrivateMessage = require('../models/PrivateMessage.js')
const userStore = require('./userStore.js')

module.exports = {
    // joinChat: async (req, res) => {
    //     console.log(userNickname + " : joined at groupID : " + groupID)
    //     socket.join(groupID)
    // },

    saveMessageToDB: (groupID, senderName, messageContent) => {
        let messageToSaveToDB = Message(
            {
                groupID: groupID,
                postedByUser: senderName,
                message: messageContent
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
        // console.log("trying to get convo")
        try {
            const { groupID } = req.params
            // console.log("req.params.groupID: " + req.params.groupID)
            console.log("chatEngine: trying to get convo at groupID: " + groupID)

            Message
                .find({ 'groupID': groupID })
                .select({ 
                    _id: 0,
                    postedByUser: 1,
                    message: 1                
                }) 
                .sort({ createdAt: 'asc' }) 
                .exec((err, retrievedMsgs) => {
                    if (err) {
                        console.log("chatEngine: Error in getConversationByGroupID: " + err)
                        return err
                    }
                    // console.log("chatEngine: retrievedConvo: " + retrievedMsgs)
                    return res.status(200).send({retrievedMsgs})
                })            
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, error })
        }
    }, 
    savePrivateMessageToDB: (senderName, senderID, receiverName, receiverID, messageContent) => {
        let messageToSaveToDB = PrivateMessage(
            {
                senderName: senderName,
                senderID: senderID,
                receiverName: receiverName,
                receiverID: receiverID,
                messageContent: messageContent
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
        try {
            const { senderID, receiverID } = req.params
            console.log("chatEngine: getPrivateConversationByUserIDs: " + senderID + " -> " + receiverID)

            let senderName, receiverName
            try {
                senderName = await userStore.getDisplayNamebyUserID(senderID);
                receiverName = await userStore.getDisplayNamebyUserID(receiverID);
                console.log("senderName: " + senderName)
                console.log("receiverName: " + receiverName)
            } catch(err) {
                console.log("err: " + err)
            }
            // senderName: u1231, senderID: dc330681-d48f-44aa-aabe-0764747bf27f
            // receiverName: u853, receiverID: 618f69bb-0e4d-465e-913d-30936633714e
            PrivateMessage
                .find({
                    $or: [
                        {
                            'senderID': senderID, 
                            'receiverID':  receiverID
                        }, 
                        {
                            'senderID': receiverID, 
                            'receiverID':  senderID
                        }
                    ]
                })
                .select({ 
                    _id: 0,
                    senderID: 0,
                    receiverID: 0,
                }) 
                .sort({ createdAt: 'asc' }) 
                .exec((err, retrievedMsgs) => {
                    if (err) {
                        console.log("chatEngine: Error in getPrivateConversationByUserIDs: " + err)
                        return err
                    }
                    // console.log("chatEngine: retrievedConvo: " + retrievedMsgs)
                    return res.status(200).send({retrievedMsgs})
                })           
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, error })
        }
    }
}