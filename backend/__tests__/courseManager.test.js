/*  Module under test: Courses
    Submodules: 
        - courseManager
    Submodules that courseManager depends on:
        - notificationManager
        - authUtils
*/

const app = require("../app")
const request = require("supertest");
var mongoose = require('mongoose')

jest.mock("../controllers/notifcationManager")
jest.mock("../utils/authUtils")

beforeAll(() => {
    dbUser = client.db("user")
    dbCourse = client.db("course")
    userCollection = dbUser.collection("userCollection")
})

afterAll(async () => {
    //await module.exports.forumDB.close();
   await mongoose.disconnect()
    //await mongoose.connection.close()

    await client.close()
})

describe("courseManager tests", () => {

    it("tests server connection", () => {
        return request(app)
            .get("/")
            .expect(200);
    });

    // getStudentList tests
    it("tests getStudentList with invalid coursename", async () => {
        console.log("1")
        let courseName = "aaaaaa"
        let userID = "validUserID"
        let jwt = "validJWT"
        await request(app).get("/getstudentlist/" + courseName + "/" + jwt + "/" + userID)
            .expect(200)
            .then(res => {
                expect(res.body).toEqual("No students found for this course")
            })
    })

    it("tests getStudentList with course name with space", async () => {
        console.log("2")
        let courseName = "TIBT 300"
        let userID = "validUserID"
        let jwt = "validJWT"

        // first add the course to the courseDB
        try {
            await dbCourse.createCollection(courseName)
        } catch (err) {
            // course is already in db, no need to add
        }

        await request(app).get("/getstudentlist/" + courseName + "/" + jwt + "/" + userID)
            .expect(200)
            .then(res => {
                expect(res.body).toEqual("No students found for this course")
            })

        // remove this collection once we're done 
        try {
            await dbCourse.collection(courseName).drop();
        } catch (err) {
            // collection DNE, don't drop
        }
    })

    it("tests getStudentList with empty course name", async () => {
        console.log("3")
        let courseName = ""
        let userID = "validUserID"
        let jwt = "validJWT"
        await request(app).get("/getstudentlist/" + courseName + "/" + jwt + "/" + userID)
            .expect(404)
    })

    it("tests getStudentList with null userID", async () => {
        console.log("4")
        let courseName = "CPEN321"
        let userID = null
        let jwt = "validJWT"
        await request(app).get("/getstudentlist/" + courseName + "/" + jwt + "/" + userID)
            .expect(400)
            .then(res => {
                expect(res.body.err).toEqual("Token not validated")
            })
    })

    it("tests getStudentList with empty userID", async () => {
        console.log("5")
        let courseName = "CPEN321"
        let userID = ""
        let jwt = "validJWT"
        await request(app).get("/getstudentlist/" + courseName + "/" + jwt + "/" + userID)
            .expect(404)
    })

    it("tests getStudentList with invalid userID", async () => {
        console.log("6")
        let courseName = "CPEN321"
        let userID = "invalidUserID"
        let jwt = "validJWT"
        await request(app).get("/getstudentlist/" + courseName + "/" + jwt + "/" + userID)
            .expect(400)
            .then(res => {
                expect(res.body.err).toEqual("Token not validated")
            })
    })

    it("tests getStudentList with null jwt", async () => {
        console.log("7")
        let courseName = "CPEN321"
        let userID = "validUserID"
        let jwt = null
        await request(app).get("/getstudentlist/" + courseName + "/" + jwt + "/" + userID)
            .expect(400)
            .then(res => {
                expect(res.body.err).toEqual("Token not validated")
            })
    })

    it("tests getStudentList with empty jwt", async () => {
        console.log("8")
        let courseName = "CPEN321"
        let userID = "validUserID"
        let jwt = ""
        await request(app).get("/getstudentlist/" + courseName + "/" + jwt + "/" + userID)
            .expect(404)
    })

    it("tests getStudentList with invalid jwt", async () => {
        console.log("9")
        let courseName = "CPEN321"
        let userID = "validUserID"
        let jwt = "invalidJWT"
        await request(app).get("/getstudentlist/" + courseName + "/" + jwt + "/" + userID)
            .expect(400)
            .then(res => {
                expect(res.body.err).toEqual("Token not validated")
            })
    })

    // For this to pass, need to have the course in course db first, 
    // change it to some very obscure course 
    it("tests getStudentList with valid params", async () => {
        console.log("10")
        let courseName = "TIBT300" 
        let userID = "validUserID"
        let jwt = "validJWT"

        // first add the course to the courseDB
        try {
            await dbCourse.createCollection(courseName)
        } catch (err) {
            // course is already in db, no need to add
        }

        await request(app).get("/getstudentlist/" + courseName + "/" + jwt + "/" + userID)
            .expect(200)

        // drop when done
        try {
            await dbCourse.collection(courseName).drop();
        } catch (err) {
            // collection DNE, don't drop
        }
    })

    // addUserToCourse tests
    it("tests addUserToCourse with empty course name", async () => {
        console.log("11")
        let coursename = ""
        let userID = "validUserID"
        let displayName = "someDisplayName"
        let jwt = "validJWT"
        await request(app).post("/addusertocourse")
            .send({
                coursename,
                userID,
                displayName,
                jwt
            })
            .expect(404)
    })

    // for this test to pass, need to set userID to be one already 
    // in the course with coursename
    it("tests addUserToCourse with userID already in course", async () => {
        console.log("12")
        let coursename = "TIBT 300"
        let userID = "validUserID"
        let displayName = "someDisplayName"
        let jwt = "validJWT"
        console.log("here")

        // add this user to the course first (if collection DNE, will create)
        await dbCourse.collection(coursename).insertOne({
            displayName,
            userID,
        })

        await request(app).post("/addusertocourse")
            .send({
                coursename,
                userID,
                displayName,
                jwt
            })
            .expect(400)
            .then(res => {
                expect(res.body).toEqual("User already in course. Not added")
            })

        // delete this user after we're done
        dbCourse.collection(coursename).deleteOne({ "userID": userID })

        // drop the collection
        try {
            await dbCourse.collection(coursename).drop();
        } catch (err) {
            // collection DNE, don't drop
        }
    })

    it("tests addUserToCourse with valid course not added before", async () => {
        console.log("13")
        let coursename = "TIBT 100"
        let userID = "validUserID"
        let displayName = "someDisplayName"
        let jwt = "validJWT"

        // drop this collection if it exists, before adding the student
        try {
            await dbCourse.collection(coursename).drop();
        } catch (err) {
            // collection DNE, don't drop
        }

        await request(app).post("/addusertocourse")
            .send({
                coursename,
                userID,
                displayName,
                jwt
            })
            .expect(200)

        // drop this collection 
        try {
            await dbCourse.collection(coursename).drop();
        } catch (err) {
            // collection DNE, don't drop
        }

    })

    // // addCourseToUser tests
    // it("triggers addCourseToUser", async () => {
    //     expect.assertions(2)
    //     const req = {
    //         body: { userID: "john", coursename: "CPEN 321" }
    //     }
    //     let res = {}
    //     await courseManager.addCourseToUser(req, res)
    //     expect(res.status).toEqual(200)
    //     expect(res.json).toEqual({ ok: true })
    // })

    // // deleteUserFromCourse tests
    // it("triggers deleteUserFromCourse", async () => {
    //     expect.assertions(2)
    //     const req = {
    //         params: { coursename: "CPEN 321" },
    //         body: { userID: "john" }
    //     }
    //     let res = {}
    //     await courseManager.deleteUserFromCourse(req, res)
    //     expect(res.status).toEqual(200)
    //     expect(res.json).toEqual("User deleted successfully\n")
    // })

    // // deleteCourseFromUser tests
    // it("triggers deleteCourseFromUser", async () => {
    //     expect.assertions(2)
    //     const req = {
    //         body: { userID: "john", coursename: "CPEN 321" }
    //     }
    //     let res = {}
    //     await courseManager.deleteCourseFromUser(req, res)
    //     expect(res.status).toEqual(200)
    //     expect(res.json).toEqual("Course deleted successfully\n")
    // })

    // editDisplayNameInCourse tests

    afterAll(async () => {
        await mongoose.disconnect()
    
        if (client) {
            await client.close()
        }
    })
})