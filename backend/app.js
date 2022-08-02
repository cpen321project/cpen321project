require("./config/mongo.js")
const { MongoClient } = require("mongodb")
const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri)
client.connect()
global.client = client

const express = require('express')
const app = express();

const notificationManager  = require("./controllers/notifcationManager.js")
const userStore = require('./controllers/userStore.js')
const courseManager = require('./controllers/courseManager.js')
const chatEngine = require('./controllers/chatEngine.js')
const forumEngine = require('./controllers/forumEngine.js')
const authUtils = require('./utils/authUtils.js')

app.get('/', (req, res) => {
    res.status(200).send('Server is running on port 3010')
})
app.use(express.json())

// module.exports = { app, client }
module.exports = app

// routes for userStore
app.get("/getuserprofile/:otherUserID/:userID/:jwt", userStore.getUserProfile)
//app.get("/getcourselist/:userID/:jwt", userStore.getCourseList)
app.post("/createprofile", userStore.createProfile)
app.post("/block", userStore.block)
app.delete("/unblock/:userID/:userIDtoDelete/:jwt", userStore.unblock)
app.post("/signup", userStore.signup)
app.post("/confirmsignup", userStore.confirmSignUp)
app.post("/login",userStore.login)
app.post("/resendconfirmationcode", userStore.resendConfirmationCode)
app.get("/getDisplayNameByUserID/:userID", userStore.getDisplayNameByUserID)
app.put("/editprofile", userStore.editProfile)

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
