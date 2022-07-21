const notificationManager = require("./notifcationManager.js")
const auth = require("./authUtils.js")

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
        security = await auth.validateToken(req.body.jwt, req.body.userID)
        if (security.success) {
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
        } else {
            res.status(400).send(security.message)
        }
    },

    addUserToCourse: async (req, res) => {
        security = await auth.validateToken(req.body.jwt, req.body.userID)
        if (security.success) {

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
        }
        else {
            res.status(400).send(security.message)
        }
    },

    addCourseToUser: async (req, res) => {
        security = await auth.validateToken(req.body.jwt, req.body.userID)
        if (security.success) {

            await userCollection.updateOne({ "userID": req.body.userID }, { $push: { "courselist": req.body.coursename } }, (err, result) => {
                if (err) {
                    console.error("Error in addCourseToUser: " + err)
                    res.status(400).send(err)
                } else {
                    console.log("addCourseToUser successfully")
                    res.status(200).json({ ok: true })
                }
            })
        }
        else {
            res.status(400).send(security.message)
        }
    },

    deleteUserFromCourse: async (req, res) => {
        security = await auth.validateToken(req.body.jwt, req.body.userID)
        if (security.success) {
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
        } else {
            res.status(400).send(security.message)
        }
    },

    deleteCourseFromUser: async (req, res) => {
        await userCollection.updateMany({ "userID": req.body.userID }, { $pull: { "courselist": req.body.coursename } }, (err, result) => {
            if (err) {
                console.log("Error in deleteCourseFromUser: " + err)
                res.status(400).send(err)
            } else {
                console.log("deleteCourseFromUser successfully")
                res.status(200).send("Course deleted successfully\n")
            }
        })
    }
}
