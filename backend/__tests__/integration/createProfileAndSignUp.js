const app = require("../../app")
const request = require("supertest")
var mongoose = require('mongoose')

const notificationManager = require("../../controllers/notifcationManager")
const userStore = require('../../controllers/userStore')
const courseManager = require('../../controllers/courseManager')
const chatEngine = require('../../controllers/chatEngine')
const forumEngine = require('../../controllers/forumEngine')
const authUtils = require('../../utils/authUtils')

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

//https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function generateRandomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

describe("courseManager tests", () => {

    // it("tests signUp with a username length <1 characters", async () => {
    //     let email = "ximaci@fxcoral.biz"
    //     let password = "Abc123!"
    //     let username = ""

    //     let body = {
    //         email,
    //         password,
    //         username
    //     }
    //     await request(app).post("/signup")
    //         .send(body)
    //         .expect(400)
    // })

    // it("tests signUp with an invalid username", async () => {
    //     let email = "ximaci@fxcoral.biz"
    //     let password = "Abc123!"
    //     let username = "#&#&#$"

    //     let body = {
    //         email,
    //         password,
    //         username
    //     }
    //     await request(app).post("/signup")
    //         .send(body)
    //         .expect(400)
    // })

    // it("tests signUp with an already existing username", async () => {
    //     let email = "ximaci@fxcoral.biz"
    //     let password = "Abc123!"
    //     let username = generateRandomString(8)

    //     let body = {
    //         email,
    //         password,
    //         username
    //     }

    //     await request(app).post("/signup")
    //         .send(body)

    //     await request(app).post("/signup")
    //         .send(body)
    //         .expect(400)
    // })

    // it("tests signUp with an invalid password", async () => {
    //     let email = "ximaci@fxcoral.biz"
    //     let password = "a"
    //     let username = "testUserName2"

    //     let body = {
    //         email,
    //         password,
    //         username
    //     }
    //     await request(app).post("/signup")
    //         .send(body)
    //         .expect(400)
    // })

    // it("tests signUp with an invalid email", async () => {
    //     let email = "a"
    //     let password = "Abc123!"
    //     let username = "testUserName2"

    //     let body = {
    //         email,
    //         password,
    //         username
    //     }
    //     await request(app).post("/signup")
    //         .send(body)
    //         .expect(400)
    // })

    // var signedUpUsername
    // it("tests signUp with an valid params", async () => {
    //     let email = "ximaci@fxcoral.biz"
    //     let password = "Abce1234!"
    //     let username = generateRandomString(8)
    //     signedUpUsername = username

    //     let body = {
    //         email,
    //         password,
    //         username
    //     }
    //     await request(app).post("/signup")
    //         .send(body)
    //         .expect(200)
    // })

    // it("tests confirmSignUp with an incorrect confirmationCode", async () => {
    //     let username = signedUpUsername
    //     let confirmationCode = "wrongConfirmationCode"
 
    //     let body = {
    //         username,
    //         confirmationCode
    //     }
    //     await request(app).post("/confirmsignup")
    //         .send(body)
    //         .expect(400)
    // })

    // it("tests confirmSignUp with an expired confirmationCode", async () => {
    //     let username = signedUpUsername
    //     let confirmationCode = "expiredConfirmationCode"
 
    //     let body = {
    //         username,
    //         confirmationCode
    //     }
    //     await request(app).post("/confirmsignup")
    //         .send(body)
    //         .expect(400)
    // })

    // it("tests confirmSignUp with an expired confirmationCode", async () => {
    //     let username = "invalidUserName"
    //     let confirmationCode = "confirmationCode"
 
    //     let body = {
    //         username,
    //         confirmationCode
    //     }
    //     await request(app).post("/confirmsignup")
    //         .send(body)
    //         .expect(400)
    // })

    // it("tests createProfile with invalid coop status", async () => {
    //     let displayName = "testDisplayName"
    //     let userID = 
    //     let coopStatus
    //     let yearStanding
    //     let registrationToken
    //     let courselist
    //     let blockedUsers

    //     let body = {
    //         displayName,
    //         userID,
    //         coopStatus,
    //         yearStanding,
    //         registrationToken,
    //         courselist,
    //         blockedUsers
    //     }
    //     await request(app).post("/signup")
    //         .send(body)
    //         .expect(400)
    // })
})