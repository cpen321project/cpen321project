// require("./config/mongo.js")
// const { MongoClient } = require("mongodb")
// const uri = "mongodb://localhost:27017"
// const client = new MongoClient(uri)
// client.connect()

// const express = require('express')
// const { app, client } = require("./app.js")
const app = require("./app.js")

const http = require('http')
// const app = express()

const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)
const port = "3010"

const notificationManager = require("./controllers/notifcationManager.js")
const userStore = require('./controllers/userStore.js')
const courseManager = require('./controllers/courseManager.js')
const chatEngine = require('./controllers/chatEngine.js')
const forumEngine = require('./controllers/forumEngine.js')
const authUtils = require('./utils/authUtils.js')

// app.use(express.json())

//---------------------------------------------------------------------------------------
server.listen(port, () => {
    console.log('Node app is running on port: ' + port)
})

let usersSockets = {}
// socketio connection - for real time sending and receiving messages
io.on('connection', (socket) => {
    console.log('a user connected')
    let jwtFromGroup;
    let jwtFromPrivate;
    let cachedUserID;

    socket.on('joinGroupChat', async function (groupID, userID, jwt) {
        console.log("----------------joinGroupChat----------------")
        jwtFromGroup = jwt
        cachedUserID = userID
        let tokenIsValid = await authUtils.validateAccessToken(jwt, userID)
        if (!tokenIsValid) {
            console.log("Token not validated")
            return
        }
        console.log(userID + " : joined at groupID : " + groupID)
        socket.join(groupID)
    })

    socket.on('groupMessage', async (groupID, senderID, senderName, messageContent) => {
        console.log("----------------groupMessage----------------")
        let tokenIsValid = await authUtils.validateAccessToken(jwtFromGroup, cachedUserID)
        if (!tokenIsValid) {
            console.log("Token not validated")
            return
        }
        console.log(senderName + " : " + messageContent)

        // save message to database 
        chatEngine.saveMessageToDB(groupID, senderID, senderName, messageContent)
        notificationManager.groupMessageNotification(senderName, groupID);
        // emit the message to clients connected in the room
        let message = {
            "message": messageContent,
            "senderNickname": senderName
        }

        // send message to all users in groupID, including current user
        io.sockets.in(groupID).emit('groupMessage', message)
    })

    socket.on('joinPrivateChat', async function (displayName, userID, jwt) {
        console.log("----------------joinPrivateChat----------------")
        if (!displayName) {
            console.log("Bad displayName")
            return
        }

        jwtFromPrivate = jwt
        cachedUserID = userID

        let tokenIsValid = await authUtils.validateAccessToken(jwt, userID)
        global.testTokenIsValid = tokenIsValid
        if (!tokenIsValid) {
            console.log("Token not validated")
            return
        }

        console.log("Inside joinPrivateChat:")
        usersSockets[userID] = socket.id
        console.log(displayName + " : initiated a private chat")
        console.log("usersSockets[userID]: " + usersSockets[userID])
        // socket.join(groupID)
    })

    socket.on('privateMessage', async (senderID, receiverID, messageContent, isBlocked) => {
        console.log("----------------privateMessage----------------")

        if (!senderID || !receiverID || !messageContent || isBlocked == null) {
            console.log(senderID)
            console.log(receiverID)
            console.log(messageContent)
            console.log(isBlocked)
            console.log("Invalid parameters")
            return
        }
        let tokenIsValid = await authUtils.validateAccessToken(jwtFromPrivate, senderID)
        if (!tokenIsValid) {
            console.log("Token not validated")
            return
        }
        if (isBlocked == 0) {
            console.log("-----------------Inside privateMessage-----------------")

            console.log("PM: " + senderID + " -> " + receiverID + " : " + messageContent)

            // get names of sender and receiver 
            let senderName, receiverName
            try {
                senderName = await getDisplayNameByUserIDfromDB(senderID);
                receiverName = await getDisplayNameByUserIDfromDB(receiverID);
                console.log("senderName: " + senderName)
                console.log("receiverName: " + receiverName)
            } catch (err) {
                console.log("err: " + err)
            }

            chatEngine.savePrivateMessageToDB(senderName, senderID, receiverName, receiverID, messageContent)
            // firebase.privateMessageNotification(senderName, receiverID);

            // emit the message to clients connected in the room
            let message = {
                "message": messageContent,
                "senderNickname": senderName
            }

            let receiverSocketID = usersSockets[receiverID]
            // add check for senderSocketID (socket.id),
            // for try to send without join first
            if (receiverSocketID) {
                console.log("Both users are joined, emit message: ")
                // this only shows to other user 
                socket.to(receiverSocketID).emit("privateMessage", message)
            } else {
                console.log("Other user is not joined, do not emit message")
                // send notif if other user does not have the private chat open 
                notificationManager.privateMessageNotification(senderName, receiverID);
            }
        } else {
            console.log("Sender has been blocked, message not sent")
            return
        }
    })

    socket.on('disconnect', function () {
        console.log("a user disconnected")
    })
})


module.exports = io
