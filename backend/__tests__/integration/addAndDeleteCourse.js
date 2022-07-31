const app = require("../app")
const request = require("supertest")
var mongoose = require('mongoose')

const notificationManager  = require("../controllers/notifcationManager")
const userStore = require('../controllers/userStore')
const courseManager = require('../controllers/courseManager')
const chatEngine = require('../controllers/chatEngine')
const forumEngine = require('../controllers/forumEngine')
const authUtils = require('../utils/authUtils')

beforeAll(async () => {
    dbUser = await client.db("user")
    dbCourse = await client.db("course")
    userCollection = await dbUser.collection("userCollection")
})

beforeEach(() => {
    jest.setTimeout(10000)
})

afterAll(async () => {
    await mongoose.disconnect()

    if (client) {
        await client.close()
    }
})

describe("courseManager tests", () => {

    // it("tests server connection", () => {
    //     return request(app)
    //         .get("/")
    //         .expect(200)
    // })

    // // getStudentList tests
    // it("tests getStudentList with invalid coursename", async () => {
    //     console.log("1")
    //     let coursename = "998!!!oo"
    //     let userID = "validUserID"
    //     let jwt = "validJWT"
    //     await request(app).get("/getstudentlist/" + coursename + "/" + jwt + "/" + userID)
    //         .expect(400)
    //         .then(res => {
    //             expect(res.body).toEqual("Invalid coursename")
    //         })
    // })
})