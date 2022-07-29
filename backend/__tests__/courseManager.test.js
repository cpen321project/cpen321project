/*  Module under test: Courses
    Submodules: 
        - courseManager
    Submodules that courseManager depends on:
        - notificationManager
        - authUtils
*/

const { app, client } = require("../app")
const request = require("supertest");
var mongoose = require('mongoose')

jest.mock("../controllers/notifcationManager")
jest.mock("../utils/authUtils")

afterAll(async () => {
    // await module.exports.forumDB.close();
    await mongoose.disconnect()
    // await mongoose.connection.close()

    await client.close()
});

describe("courseManager tests", () => {

    it("tests server connection", () => {
        return request(app)
            .get("/")
            .expect(200);
    });

    // getStudentList tests
    it("tests getStudentList with invalid coursename", async () => {
        let courseName = "aaaaaa"
        let userID = "validUserID"
        let jwt = "validJWT"
        await request(app).get("/getstudentlist/" + courseName + "/" + jwt + "/" + userID)
            .expect(200)
            .then(res => {
                expect(res.body).toEqual("No students found for this course")
            })
    })

    // make sure this course is in the db 
    it("tests getStudentList with course name with space", async () => {
        let courseName = "CPEN 211"
        let userID = "validUserID"
        let jwt = "validJWT"
        await request(app).get("/getstudentlist/" + courseName + "/" + jwt + "/" + userID)
            .expect(200)
            .then(res => {
                expect(res.body).toEqual("No students found for this course")
            })
    })

    it("tests getStudentList with empty course name", async () => {
        let courseName = ""
        let userID = "validUserID"
        let jwt = "validJWT"
        await request(app).get("/getstudentlist/" + courseName + "/" + jwt + "/" + userID)
            .expect(404)
    })

    it("tests getStudentList with null userID", async () => {
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
        let courseName = "CPEN321"
        let userID = ""
        let jwt = "validJWT"
        await request(app).get("/getstudentlist/" + courseName + "/" + jwt + "/" + userID)
            .expect(404)
    })

    it("tests getStudentList with invalid userID", async () => {
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
        let courseName = "CPEN321"
        let userID = "validUserID"
        let jwt = ""
        await request(app).get("/getstudentlist/" + courseName + "/" + jwt + "/" + userID)
            .expect(404)
    })

    it("tests getStudentList with invalid jwt", async () => {
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
        let courseName = "CPEN211" //"CPEN321" 
        let userID = "validUserID"
        let jwt = "validJWT"
        await request(app).get("/getstudentlist/" + courseName + "/" + jwt + "/" + userID)
            .expect(200)
    })

    // addUserToCourse tests
    it("tests addUserToCourse with empty course name", async () => {
        let courseName = "" 
        let userID = "validUserID"
        let displayName = "someDisplayName"
        let jwt = "validJWT"
        await request(app).post("/addusertocourse")
            .set({
                courseName, 
                userID, 
                displayName, 
                jwt
            })
            .expect(404)
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
})