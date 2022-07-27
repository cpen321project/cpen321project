const notificationManager = require("./notifcationManager.js")
const authUtils = require("../utils/authUtils.js")

const { MongoClient } = require("mongodb")
const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri)
client.connect()

let dbUser, dbCourse, userCollection

dbUser = client.db("user")
dbCourse = client.db("course")
userCollection = dbUser.collection("userCollection")

module.exports = {
    getStudentList: async (req, res) => {
        console.log("-------------getStudentList-------------")
        let tokenIsValid = await authUtils.validateAccessToken(req.params.jwt, req.params.userID)
        if (!tokenIsValid) {
            console.log("Token not validated")
            res.status(404).send({ err: "Token not validated" })
            return
        }
        let coursenamespace = req.params.coursename.substring(0, 4) + " " + req.params.coursename.substring(4, req.params.coursename.length)
        await dbCourse.collection(coursenamespace).find({}).project({ userID: 1, displayName: 1, _id: 0 }).toArray((err, resultstudent) => {
            if (err) {
                console.error("Error in getStudentList: " + err)
                res.status(400).send(err)
            } else {
                console.log("getStudentList successfully")
                res.status(200).json(resultstudent)
            }
        })
    },

    addUserToCourse: async (req, res) => {
        tokenIsValid = await authUtils.validateAccessToken(req.body.jwt, req.body.userID)
        if (!tokenIsValid) {
            console.log("Token not validated")
            res.status(404)
            return
        }

        await dbCourse.collection(req.body.coursename).insertOne({
            displayName: req.body.displayName,
            userID: req.body.userID,
        }, (err, result) => {
            if (err) {
                console.log("Error in addUserToCourse: " + err)
                res.status(400).send(err)
            } else {
                console.log("addUserToCourse successfully")
                res.status(200).send("User added successfully\n")
                notificationManager.userAddedNotification(req.body.userID, req.body.coursename)
            }
        })
    },

    addCourseToUser: async (req, res) => {
        tokenIsValid = await authUtils.validateAccessToken(req.body.jwt, req.body.userID)
        if (!tokenIsValid) {
            console.log("Token not validated")
            res.status(404)
            return
        }
        await userCollection.updateOne({ "userID": req.body.userID }, { $push: { "courselist": req.body.coursename } }, (err, result) => {
            if (err) {
                console.error("Error in addCourseToUser: " + err)
                res.status(400).send(err)
            } else {
                console.log("addCourseToUser successfully")
                res.status(200).json({ ok: true })
            }
        })
    },

    deleteUserFromCourse: async (req, res) => {
        tokenIsValid = await authUtils.validateAccessToken(req.params.jwt, req.params.userID)
        if (!tokenIsValid) {
            console.log("Token not validated")
            res.status(404)
            return
        }


        let coursenamespace = req.params.coursename.substring(0, 4) + " " + req.params.coursename.substring(4, req.params.coursename.length)
        await dbCourse.collection(coursenamespace).deleteOne({ "userID": req.params.userID }, (err, result) => {
            if (err) {
                console.log("Error in deleteUserFromCourse: " + err)
                res.status(400).send(err)
            } else {
                console.log("deleteUserFromCourse successfully")
                res.status(200).send("User deleted successfully\n")
            }
        })
    },

    deleteCourseFromUser: async (req, res) => {
        tokenIsValid = await authUtils.validateAccessToken(req.params.jwt, req.params.userID)
        if (!tokenIsValid) {
            console.log("Token not validated")
            res.status(404)
            return
        }
        await userCollection.updateMany({ "userID": req.body.userID }, { $pull: { "courselist": req.body.coursename } }, (err, result) => {
            if (err) {
                console.log("Error in deleteCourseFromUser: " + err)
                res.status(400).send(err)
            } else {
                console.log("deleteCourseFromUser successfully")
                res.status(200).send("Course deleted successfully\n")
            }
        })
    },

    editDisplayNameInCourse: async (req, res) => {
        let displayName= req.body.displayName
        let userID = req.body.userID
        let coursename = req.body.coursename;
        let jwt = req.body.jwt

        if (!displayName || !userID || !coursename || !jwt ) {
            console.log("Invalid body parameter(s).")
            res.status(400).send({ response: "Invalid body parameter(s)." })
            return;
        }

        await dbCourse.collection(coursename).findOneAndUpdate({}, (err, result) => {
            if (err) {
                console.log("Error in addUserToCourse: " + err)
                res.status(400).send(err)
            } else {
                console.log("addUserToCourse successfully")
                res.status(200).send("User added successfully\n")
                notificationManager.userAddedNotification(req.body.userID, req.body.coursename)
            }
        })

        let filter = { userID: userID }
        let update = { displayName: displayName, coopStatus: coopStatus, yearStanding: yearStanding};
        userCollection.findOneAndUpdate(filter, {$set : update}, function(err, resultProfileUpdated){
            if (err) {
                console.log("err: " + err)
                res.status(400).send({ response: "Failed to findOneAndUpdate profile" })
            } else {
                console.log("resultProfileUpdated: " + resultProfileUpdated)
                res.status(200).send({ response: "Profile updated successfully" })
            }
        }
        )
    }
}
