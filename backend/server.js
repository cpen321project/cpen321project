require("./config/mongo.js")

const { MongoClient } = require("mongodb")
const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri)
client.connect()

const express = require('express')
const http = require('http')
const app = express()

const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

const notificationManager  = require("./controllers/notifcationManager.js")

const port = "3010"

const userStore = require('./controllers/userStore.js')
const courseManager = require('./controllers/courseManager.js')
const chatEngine = require('./controllers/chatEngine.js')
const forumEngine = require('./controllers/forumEngine.js')
const authUtils = require('./utils/authUtils.js')

app.use(express.json())

//---------------------------------------------------------------------------------------
server.listen(port, () => {
    console.log('Node app is running on port: ' + port)
})

// testing the firebase messaging syntax
// tokss = 'dSxAWFyfQAaXup74x3Peqb:APA91bHaQVM4dQznOMnETA8AgA_5OsTaiQ3PS3CBQzc8q1_K30SAHsajyzSZQmJ1_SqXWLcnF4Nm6YemNg0tpa4k5PQ1FS9yUkj0JMUTrpIsc8UsdjvREWvX0kNZOGwMGWbmlARct-EA'
// tokss = []
// tokss.push('dSxAWFyfQAaXup74x3Peqb:APA91bHaQVM4dQznOMnETA8AgA_5OsTaiQ3PS3CBQzc8q1_K30SAHsajyzSZQmJ1_SqXWLcnF4Nm6YemNg0tpa4k5PQ1FS9yUkj0JMUTrpIsc8UsdjvREWvX0kNZOGwMGWbmlARct-EA')
// tokss.push('dSxAWFyfQAaXup74x3Peqb:APA91bHaQVM4dQznOMnETA8AgA_5OsTaiQ3PS3CBQzc8q1_K30SAHsajyzSZQmJ1_SqXWLcnF4Nm6YemNg0tpa4k5PQ1FS9yUkj0JMUTrpIsc8UsdjvREWvX0kNZOGwMGWbmlARct-EA')
// firebase.testMessageSyntax(tokss);

app.get('/', (req, res) => {
    res.send('Server is running on port: ' + port)
})
//---------------------------------------------------------------------------------------
// routes for userStore
app.get("/getuserprofile/:otherUserID/:userID/:jwt", userStore.getUserProfile)
app.get("/getcourselist/:userID/:jwt", userStore.getCourseList)
app.post("/createprofile", userStore.createProfile)
app.post("/block", userStore.block)
app.delete("/unblock/:userID/:userIDtoDelete/:jwt", userStore.unblock)
app.post("/signup", userStore.signup)
app.post("/confirmsignup", userStore.confirmSignUp)
app.post("/login",userStore.login)
app.post("/resendconfirmationcode", userStore.resendConfirmationCode)
app.get("/getDisplayNameByUserID/:userID", userStore.getDisplayNameByUserID)
app.put("/editprofile", userStore.editProfile)
app.put("/editdisplaynameincourse", courseManager.editDisplayNameInCourse)

// routes for courseManager
app.get("/getstudentlist/:coursename/:jwt/:userID", courseManager.getStudentList)
app.post("/addusertocourse", courseManager.addUserToCourse)
app.post("/addcoursetouser", courseManager.addCourseToUser)
app.delete("/deleteuserfromcourse/:userID/:coursename/:jwt", courseManager.deleteUserFromCourse)
app.post("/deletecoursefromuser", courseManager.deleteCourseFromUser)

// routes for chatEngine
app.get('/getConversationByGroupID/:groupID/:userID/:jwt', chatEngine.getConversationByGroupID)
app.get('/getPrivateConversationByUserIDs/:senderID/:receiverID/:jwt', chatEngine.getPrivateConversationByUserIDs)

// routes for forumEngine
app.get('/getAllQuestions/:userID/:jwt', forumEngine.getAllQuestions)
app.get('/getAllQuestionsForATopic/:topic/:userID/:jwt', forumEngine.getAllQuestionsForATopic)
app.get('/getAllQuestionsFromAUser/:userID/:jwt', forumEngine.getAllQuestionsFromAUser)
app.get('/getAllAnswersForAQuestion/:questionID/:userID/:jwt', forumEngine.getAllAnswersForAQuestion)
app.post("/postQuestion", forumEngine.postQuestion)
app.post("/postAnswer", forumEngine.postAnswer)
app.put("/editQuestion", forumEngine.editQuestion)
app.put("/editAnswer", forumEngine.editAnswer)

// route for firebase
app.post("/newRegistrationToken", notificationManager.newRegistrationToken)

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
        jwtFromPrivate = jwt
        cachedUserID = userID
        let tokenIsValid = await authUtils.validateAccessToken(jwt, userID)
        if (!tokenIsValid) { 
            console.log("Token not validated")
            return
        }
        console.log("Inside joinPrivateChat:")
        usersSockets[displayName] = socket.id
        console.log(displayName + " : initiated a private chat")
        console.log("usersSockets[displayName]: " + usersSockets[displayName])
        // socket.join(groupID)
    })

    socket.on('privateMessage', async (senderID, receiverID, messageContent, isBlocked) => {
        console.log("----------------privateMessage----------------")
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
                senderName = await userStore.getDisplayNameByUserIDfromDB(senderID);
                receiverName = await userStore.getDisplayNameByUserIDfromDB(receiverID);
                console.log("senderName: " + senderName)
                console.log("receiverName: " + receiverName)
            } catch(err) {
                console.log("err: " + err)
            }

            chatEngine.savePrivateMessageToDB(senderName, senderID, receiverName, receiverID, messageContent)
            // firebase.privateMessageNotification(senderName, receiverID);

            // emit the message to clients connected in the room
            let message = {
                "message": messageContent,
                "senderNickname": senderName
            }

            let receiverSocketID = usersSockets[receiverName]
            // add check for senderSocketID (socket.id),
            // for try to send without join first
            if (receiverSocketID) {
                console.log("Both users are joined, emit message: ")
                // this only shows to other user 
                socket.to(receiverSocketID).emit("privateMessage", message)
            } else {
                // msg is shown to the user itself on the frontend
                console.log("Other user is not joined, do not emit message: ")
                // send notif if other user does not have the private chat open 
                notificationManager.privateMessageNotification(senderName, receiverID);
                // console.log("Other user is not joined, emit msg to self: ")
                // socket.emit("privateMessage", message)
            }
            console.log("-----------------End of privateMessage-----------------")
        } else {
            console.log("Sender has been blocked, message not sent")
        }
    })

    socket.on('disconnect', function () {
        console.log("a user disconnected")
    })
})
