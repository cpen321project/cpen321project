const notificationManager = require("./notifcationManager.js")
const authUtils = require("../utils/authUtils.js")

let dbUser, dbCourse, userCollection

dbUser = client.db("user")
dbCourse = client.db("course")
userCollection = dbUser.collection("userCollection")

module.exports = {
    getStudentList: async (req, res) => {
        console.log("-------------getStudentList-------------")
        let jwt = req.params.jwt
        let userID = req.params.userID
        let coursename = req.params.coursename

        // coursename is alphnumeric characs 
        if (!(coursename.match("^[A-Za-z0-9]*$"))) {
            return res.status(400).json("Invalid coursename")
        }

        let tokenIsValid = await authUtils.validateAccessToken(jwt, userID)
        if (!tokenIsValid) {
            console.log("Token not validated")
            res.status(400).send({ err: "Token not validated" })
            return
        }

        let coursenamespace = coursename.substring(0, 4) + " " + coursename.substring(4, coursename.length)
        console.log("coursenamespace: " + coursenamespace)
        await dbCourse.collection(coursenamespace).find({}).project({ userID: 1, displayName: 1, _id: 0 }).toArray((err, resultstudent) => {
            if (err) {
                console.error("Error in getStudentList: " + err)
                return res.status(400).send(err)
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

        let findResult = await dbCourse.collection(coursename).find({ userID }).toArray()
        if (findResult.length !== 0) {
            console.log("findResult: " + findResult + ".")
            console.log("User already in course. Not added")
            return res.status(400).json("User already in course. Not added")
        }

        let insertResult = await dbCourse.collection(req.body.coursename).insertOne({
            displayName: req.body.displayName,
            userID: req.body.userID,
        })
        if (insertResult) {
            console.log("addUserToCourse successfully")
            await notificationManager.userAddedNotification(req.body.userID, req.body.coursename)
            return res.status(200).json({ ok: true })
        } else {
            console.log("Error in addUserToCourse")
            return res.status(400).json("Error in addUserToCourse")
        }
    },

    addCourseToUser: async (req, res) => {
        console.log("-------------addCourseToUser-------------")
        let jwt = req.body.jwt
        let userID = req.body.userID
        let coursename = req.body.coursename

        if (!jwt || !userID || !coursename) {
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
        let findResult = await userCollection.findOne({ userID, courselist: coursename })
        if (findResult) {
            console.log("Already added.")
            return res.status(400).json("Already added")
        }

        let updateResult = await userCollection.updateOne({ "userID": req.body.userID }, { $push: { "courselist": req.body.coursename } })
        if (updateResult) {
            console.log("addCourseToUser successfully")
            return res.status(200).json({ ok: true })
        } else {
            console.error("Error in addCourseToUser")
            return res.status(400).json("Error in addCourseToUser")
        }
    },

    deleteUserFromCourse: async (req, res) => {
        console.log("-------------deleteUserFromCourse-------------")
        let userID = req.params.userID
        let coursename = req.params.coursename
        let jwt = req.params.jwt

        console.log("userID: " + userID)
        console.log("coursename: " + coursename)
        console.log("jwt: " + jwt)

        let tokenIsValid = await authUtils.validateAccessToken(req.params.jwt, req.params.userID)
        if (!tokenIsValid) {
            console.log("Token not validated")
            return res.status(400).json("Token not validated")
        }

        // coursename is alphnumeric characs
        if (!(coursename.match("^[A-Za-z0-9]*$"))) {
            return res.status(400).json("Invalid coursename")
        }

        let coursenamespace = req.params.coursename.substring(0, 4) + " " + req.params.coursename.substring(4, req.params.coursename.length)
        
        // check if user is added to course 
        let findResult = await dbCourse.collection(coursenamespace).find({ userID }).toArray()
        if (findResult.length === 0) {
            console.log("findResult: " + findResult + ".")
            console.log("User has not added course before. Not deleted")
            return res.status(400).json("User has not added course before. Not deleted")
        }

        let deleteResult = await dbCourse.collection(coursenamespace).deleteOne({ "userID": req.params.userID })
        if (deleteResult) {
            console.log("deleteUserFromCourse successfully")
            return res.status(200).json("User deleted successfully")
        } else {
            console.log("Error in deleteUserFromCourse")
            return res.status(400).json(err)
        }
    },

    deleteCourseFromUser: async (req, res) => {
        console.log("-------------deleteCourseFromUser-------------")
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
        let findResult = await userCollection.findOne({ userID, courselist: coursename })
        if (!findResult) {
            console.log("Course not added before. Not deleted")
            return res.status(400).json("Course not added before. Not deleted")
        }

        let updateResult = await userCollection.updateMany({ "userID": req.body.userID }, { $pull: { "courselist": req.body.coursename } })
        if (updateResult) {
            console.log("deleteCourseFromUser successfully")
            return res.status(200).json({ result: "Course deleted successfully" })
        } else {
            console.log("Error in deleteCourseFromUser")
            return res.status(400).json(err)
        }
    },

    editDisplayNameInCourse: async (displayNameNew, userID, coursename) => {
        console.log("-------------editDisplayNameInCourse-------------")
        if (!displayNameNew || !userID || !coursename) {
            console.log("Invalid parameters")
            return false
        }

        let findResult = await dbCourse.collection(coursename).findOne({ userID })
        console.log("findResult: " + findResult)
        if (!findResult) {
            console.log("User not in course. Display name not edited")
            return false
        }

        let update = { displayName: displayNameNew };
        let updateResult = await dbCourse.collection(coursename).updateOne({ userID }, { $set: update })
        if (updateResult) {
            return true
        } else {
            return false
        }
    }
}
