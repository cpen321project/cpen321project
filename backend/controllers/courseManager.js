const notificationManager = require("./notifcationManager.js")
const authUtils = require("../utils/authUtils.js")

// const { MongoClient } = require("mongodb")
// const uri = "mongodb://localhost:27017"
// const client = new MongoClient(uri)
// client.connect()

let dbUser, dbCourse, userCollection

dbUser = client.db("user")
dbCourse = client.db("course")
userCollection = dbUser.collection("userCollection")

module.exports = {
    getStudentList: async (req, res) => {
        console.log("-------------getStudentList-------------")
        let jwt = req.params.jwt
        let userID = req.params.userID
        let courseName = req.params.coursename

        if (!jwt || !userID || !courseName) {
            console.log("Invalid parameters")
            return res.status(404).json("Invalid parameters")
        }

        let tokenIsValid = await authUtils.validateAccessToken(req.params.jwt, req.params.userID)
        if (!tokenIsValid) {
            console.log("Token not validated")
            res.status(400).send({ err: "Token not validated" })
            return
        }
        let coursenamespace = req.params.coursename.substring(0, 4) + " " + req.params.coursename.substring(4, req.params.coursename.length)
        console.log("coursenamespace: " + coursenamespace)
        await dbCourse.collection(coursenamespace).find({}).project({ userID: 1, displayName: 1, _id: 0 }).toArray((err, resultstudent) => {
            if (err) {
                console.error("Error in getStudentList: " + err)
                return res.status(400).send(err)
            } else if (resultstudent.length === 0) {
                console.log("No students found for this course")
                return res.status(200).json("No students found for this course")
            } else {
                console.log("getStudentList successfully: resultstudent: " + resultstudent)
                return res.status(200).json(resultstudent)
            }
        })
    },

    addUserToCourse: async (req, res) => {
        console.log("-------------addUserToCourse-------------")
        let jwt = req.body.jwt
        let userID = req.body.userID
        let courseName = req.body.coursename
        let displayName = req.body.displayName

        if (!jwt || !userID || !courseName || !displayName) {
            console.log("Invalid parameters")
            return res.status(404).json("Invalid parameters")
        }

        let tokenIsValid = await authUtils.validateAccessToken(req.body.jwt, req.body.userID)
        if (!tokenIsValid) {
            console.log("Token not validated")
            return res.status(400).json("Invalid parameters")
        }

        await dbCourse.collection(req.body.coursename).insertOne({
            displayName: req.body.displayName,
            userID: req.body.userID,
        }, (err, result) => {
            if (err) {
                console.log("Error in addUserToCourse: " + err)
                return res.status(400).send(err)
            } else {
                console.log("addUserToCourse successfully")
                res.status(200).json("User added successfully")
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

    editDisplayNameInCourse: async (displayNameNew, userID, coursename) => {

        let update = { displayName: displayNameNew };
        await dbCourse.collection(coursename).updateOne({ userID }, { $set: update }, function (err, resultProfileUpdated) {
            if (err) {
                console.log("err: " + err)
                return false;
            } else {
                console.log("resultProfileUpdated: " + resultProfileUpdated)
                return true;

            }
        })
    }
}
