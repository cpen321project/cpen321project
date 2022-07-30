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
        let coursename = req.body.coursename
        let displayName = req.body.displayName

        if (!jwt || !userID || !coursename || !displayName) {
            console.log("Invalid parameters")
            return res.status(404).json("Invalid parameters")
        }

        let tokenIsValid = await authUtils.validateAccessToken(req.body.jwt, req.body.userID)
        if (!tokenIsValid) {
            console.log("Token not validated")
            return res.status(400).json("Token not validated")
        }

        const collection = await dbCourse.listCollections({}, { nameOnly: true }).toArray()
        console.log('List of all collections :: ', JSON.stringify(collection))

        let findResult = await dbCourse.collection(coursename).find({ userID }).toArray()
        if (findResult.length !== 0) {
            console.log("findResult: " + findResult + ".")
            console.log("User already in course. Not added")
            return res.status(400).json("User already in course. Not added")
        }

        await dbCourse.collection(req.body.coursename).insertOne({
            displayName: req.body.displayName,
            userID: req.body.userID,
        }, async (err, result) => {
            if (err) {
                console.log("Error in addUserToCourse: " + err)
                return res.status(400).send(err)
            } else {
                console.log("addUserToCourse successfully")
                await notificationManager.userAddedNotification(req.body.userID, req.body.coursename)
                return res.status(200).json("User added successfully")
            }
        })
    },

    addCourseToUser: async (req, res) => {
        console.log("-------------addCourseToUser-------------")
        let jwt = req.body.jwt
        let userID = req.body.userID
        let coursename = req.body.coursename
        let displayName = req.body.displayName

        if (!jwt || !userID || !coursename || !displayName) {
            console.log("Invalid parameters")
            return res.status(404).json("Invalid parameters")
        }

        let tokenIsValid = await authUtils.validateAccessToken(req.body.jwt, req.body.userID)
        if (!tokenIsValid) {
            console.log("Token not validated")
            return res.status(400).json("Token not validated")
        }

        // coursename is alphnumeric characs and has at least 1 space
        if (!(coursename.match("^[A-Za-z0-9 ]*$") && /\s/.test(coursename))) {
            return res.status(400).json("Invalid coursename")
        }

        // check if course added already
        let findResult = await userCollection.findOne({ "userID": userID, courselist: coursename })
        if (findResult) {
            console.log("findResult.displayName: " + findResult.displayName)
            console.log("Already added.")
            return res.status(400).json("Already added")
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
        console.log("-------------deleteUserFromCourse-------------")
        let userID = req.params.userID
        let coursename = req.params.coursename
        let jwt = req.params.jwt

        if (!jwt || !userID || !coursename) {
            console.log("Invalid parameters")
            return res.status(404).json("Invalid parameters")
        }

        tokenIsValid = await authUtils.validateAccessToken(req.params.jwt, req.params.userID)
        if (!tokenIsValid) {
            console.log("Token not validated")
            return res.status(400).json("Token not validated")
        }

        // coursename is alphnumeric characs and has at least 1 space
        if (!(coursename.match("^[A-Za-z0-9 ]*$") && /\s/.test(coursename))) {
            return res.status(400).json("Invalid coursename")
        }

        // check if user is added to course 
        let findResult = await dbCourse.collection(coursename).find({ userID }).toArray()
        if (findResult.length === 0) {
            console.log("findResult: " + findResult + ".")
            console.log("User has not added course before. Not deleted")
            return res.status(400).json("User has not added course before. Not deleted")
        }

        let coursenamespace = req.params.coursename.substring(0, 4) + " " + req.params.coursename.substring(4, req.params.coursename.length)
        await dbCourse.collection(coursenamespace).deleteOne({ "userID": req.params.userID }, (err, result) => {
            if (err) {
                console.log("Error in deleteUserFromCourse: " + err)
                res.status(400).send(err)
            } else {
                console.log("deleteUserFromCourse successfully")
                res.status(200).json("User deleted successfully")
            }
        })
    },

    deleteCourseFromUser: async (req, res) => {
        console.log("-------------deleteUserFromCourse-------------")
        let userID = req.body.userID
        let coursename = req.body.coursename
        let jwt = req.body.jwt

        if (!jwt || !userID || !coursename) {
            console.log("Invalid parameters")
            return res.status(404).json("Invalid parameters")
        }

        tokenIsValid = await authUtils.validateAccessToken(req.body.jwt, req.body.userID)
        if (!tokenIsValid) {
            console.log("Token not validated")
            return res.status(400).json("Token not validated")
        }

        // coursename is alphnumeric characs and has at least 1 space
        if (!(coursename.match("^[A-Za-z0-9 ]*$") && /\s/.test(coursename))) {
            return res.status(400).json("Invalid coursename")
        }

        // check if course added to user already
        let findResult = await userCollection.findOne({ "userID": userID, courselist: coursename })
        if (!findResult) {
            console.log("Course not added before. Not deleted")
            return res.status(400).json("Course not added before. Not deleted")
        }

        await userCollection.updateMany({ "userID": req.body.userID }, { $pull: { "courselist": req.body.coursename } }, (err, result) => {
            if (err) {
                console.log("Error in deleteCourseFromUser: " + err)
                res.status(400).send(err)
            } else {
                console.log("deleteCourseFromUser successfully")
                res.status(200).send("Course deleted successfully")
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
