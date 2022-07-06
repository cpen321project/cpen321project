require("./config/mongo.js")

const {MongoClient} = require("mongodb")
const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri)
client.connect()

const express = require('express')
const http = require('http')
const app = express()

const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

const port = "3010"

const userStore = require('./controllers/userStore.js')
const courseManager = require('./controllers/courseManager.js')
const chatEngine = require('./controllers/chatEngine.js')

app.use(express.json())

let dbUser, dbCourse, userCollection

//---------------------------------------------------------------------------------------
server.listen(port, () => {
    console.log('Node app is running on port: ' + port)
})

dbUser = client.db("user")
dbCourse= client.db("course")
userCollection = dbUser.collection("userCollection")

app.get('/', (req, res) => {
    res.send('Server is running on port: ' + port)
})
//---------------------------------------------------------------------------------------
// routes for userStore
app.get("/getuserprofile/:userID", userStore.getUserProfile)
app.get("/getcourselist/:userID", userStore.getCourseList)
app.post("/createprofile", userStore.createProfile)
app.post("/block", userStore.block)

// routes for courseManager
app.get("/getstudentlist/:coursename", courseManager.getStudentList)
app.post("/addusertocourse", courseManager.addUserToCourse)
app.post("/addcoursetouser", courseManager.addCourseToUser)
app.delete("/deleteuserfromcourse/:userID/:coursename", courseManager.deleteUserFromCourse)
app.post("/deletecoursefromuser", courseManager.deleteCourseFromUser)

// routes for chatEngine
app.get('/getConversationByGroupID/:groupID', chatEngine.getConversationByGroupID)
app.get('/getPrivateConversationByUserNames/:senderName/:receiverName', chatEngine.getPrivateConversationByUserNames)

let usersSockets = {}

// socketio connection - for real time sending and receiving messages
io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('joinGroupChat', function (groupID, displayName) {
        console.log(displayName + " : joined at groupID : " + groupID)
        socket.join(groupID)
    })

    socket.on('groupMessage', (groupID, senderName, messageContent) => {
        console.log(senderName + " : " + messageContent)
        
        // save message to database 
        chatEngine.saveMessageToDB(groupID, senderName, messageContent)

        // emit the message to clients connected in the room
        let message = {
            "message": messageContent,
            "senderNickname": senderName
        }

        // send message to all users in groupID, including current user
        io.sockets.in(groupID).emit('groupMessage', message)
    })

    socket.on('joinPrivateChat', function (displayName) {
        console.log("Inside joinPrivateChat:")
        usersSockets[displayName] = socket.id
        console.log(displayName + " : initiated a private chat")
        console.log("usersSockets[displayName]: " + usersSockets[displayName])
        // socket.join(groupID)
    })

    socket.on('privateMessage', (senderName, receiverName, messageContent, isBlocked) => {
        if (isBlocked == 0) {
            console.log("Inside privateMessage:")
            console.log("usersSockets[senderName]: " + usersSockets[senderName])
            console.log("usersSockets[receiverName]: " + usersSockets[receiverName])

            console.log("PM: " + senderName + " -> " + receiverName + " : " + messageContent)

            chatEngine.savePrivateMessageToDB(senderName, receiverName, messageContent)

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
                console.log("Other user is not joined, do nothing on server: ")
                // console.log("Other user is not joined, emit msg to self: ")
                // socket.emit("privateMessage", message)
            }
        } else {
            console.log(receiverName + " has blocked " + senderName + " , can't send message")
        }
    })

    socket.on('disconnect', function () {
        console.log("a user disconnected")
    })
})
