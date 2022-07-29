/*  Module under test: Courses
    Submodules: 
        - courseManager
    Submodules that courseManager depends on:
        - notificationManager
        - authUtils
*/

// const mongoose = require("mongoose");
// const { MongoClient } = require('mongodb');

const app = require("../app")
const request = require("supertest");
// const courseManager = require("../controllers/courseManager")

jest.mock("../controllers/notifcationManager")
// const notificationManager = require("../controllers/notifcationManager")
jest.mock("../utils/authUtils")
// const authUtils = require("../utils/authUtils")

// beforeAll((done) => {
//     mongoose.connect("mongodb://localhost:27017/JestDB",
//         { useNewUrlParser: true, useUnifiedTopology: true },
//         () => done());
// });

// afterAll((done) => {
//     mongoose.connection.db.dropDatabase(() => {
//         mongoose.connection.close(() => done())
//     });
// });

// beforeAll(async () => {
//     connection = await MongoClient.connect("mongodb://localhost:27017/user", {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     });
//     db = await connection.db("user");
// });

// afterAll(async () => {
//     await connection.close();
// });

describe("courseManager tests", () => {

    it("tests server connection", () => {
        return request(app)
            .get("/")
            .expect(200);
    });

    it("tests heh", async () => {
        let courseName = "aa"
        let userID = "goodUserID"
        let jwt = "validJWT"
        await request(app).get("/heh")
            .expect(200)
            .then(response => {
                console.log("response: " + response)
            })
    })
    // getStudentList tests
    it("tests getStudentList with invalid coursename", async () => {
        // app.get("/getstudentlist/:coursename/:jwt/:userID", courseManager.getStudentList)
        let courseName = "aa"
        let userID = "dfadfaf"//"goodUserID"
        let jwt = "validJWT"
        await request(app).get("/getstudentlist/" + courseName + "/" + jwt + "/" + userID)
            .expect(400)
            .then(response => {
                console.log("response: " + response)
            })
    })

    // it("tests getStudentList with invalid coursename", async () => {
    //     expect.assertions(1)
    //     let courseNameNoSpace = "CPEN321"
    //     const receivedResult = await courseManager.getStudentList(courseNameNoSpace)
    //     return expect(receivedResult).toEqual(
    //         [
    //             {
    //                 userID: "john",
    //                 displayName: "john",
    //             },
    //             {
    //                 userID: "mary",
    //                 displayName: "mary",
    //             },
    //         ]
    //     )
    // })

    // // addUserToCourse tests
    // it("triggers addUserToCourse", async () => {
    //     expect.assertions(2)
    //     const req = {
    //         body: { displayName: "john", userID: "john" }
    //     }
    //     let res = {}
    //     await courseManager.addUserToCourse(req, res)
    //     expect(res.status).toEqual(200)
    //     expect(res.json).toEqual("User added successfully\n")
    // })

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
})