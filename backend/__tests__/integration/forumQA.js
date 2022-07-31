const app = require("../../app")
const request = require("supertest")
var mongoose = require('mongoose')

// const notificationManager = require("../../controllers/notifcationManager")
// const userStore = require('../../controllers/userStore')
// const courseManager = require('../../controllers/courseManager')
// const chatEngine = require('../../controllers/chatEngine')
const forumEngine = require('../../controllers/forumEngine')
jest.mock("../../utils/authUtils")

beforeAll(async () => {
    dbUser = await client.db("user")
    dbCourse = await client.db("course")
    userCollection = await dbUser.collection("userCollection")
})

beforeEach(() => {
    jest.setTimeout(30000)
})

afterAll(async () => {
    await mongoose.disconnect()

    if (client) {
        await client.close()
    }
})

describe("forum tests", () => {
    //question use case
    it("tests getAllQuestions with invalid access token", async () => {
        let jwt = "invalidJWT"
        let userID = "validUserID"

        await request(app).get("/getAllQuestions/" + userID + "/" + jwt)
            .expect(404)

        jest.setTimeout(30000)
    })

    it("tests getAllQuestions with valid access token", async () => {
        let jwt = "validJWT"
        let userID = "validUserID"

        await request(app).get("/getAllQuestions/" + userID + "/" + jwt)
            .expect(200)
    })

    // it("tests getAllQuestionsForATopic with invalid access token", async () => {
    //     let jwt = "invalidJWT"
    //     let userID = "validUserID"
    //     let topic = "all"

    //     await request(app).get("/getAllQuestionsForATopic/" + topic + "/" + userID + "/" + jwt)
    //         .expect(404)
    // })

    // it("tests getAllQuestionsForATopic with valid access token and null topic", async () => {
    //     let jwt = "validJWT"
    //     let userID = "validUserID"
    //     let topic = "%00"

    //     await request(app).get("/getAllQuestionsForATopic/" + topic + "/" + userID + "/" + jwt)
    //         .expect(200)
    // })

    // it("tests getAllQuestionsForATopic with valid access token and a non existent topic", async () => {
    //     let jwt = "validJWT"
    //     let userID = "validUserID"
    //     let topic = "blablabla"

    //     await request(app).get("/getAllQuestionsForATopic/" + topic + "/" + userID + "/" + jwt)
    //         .expect(200)
    // })

    // it("tests getAllQuestionsForATopic with valid access token and valid topic", async () => {
    //     let jwt = "validJWT"
    //     let userID = "validUserID"
    //     let topic = "all"

    //     await request(app).get("/getAllQuestionsForATopic/" + topic + "/" + userID + "/" + jwt)
    //         .expect(200)
    // })

    it("tests getAllQuestionsFromAUser with invalid access token", async () => {
        let jwt = "invalidJWT"
        let userID = "validUserID"

        await request(app).get("/getAllQuestionsFromAUser/" + userID + "/" + jwt)
            .expect(404)
    })

    it("tests getAllQuestionsFromAUser with invalid user ID", async () => {
        let jwt = "validJWT"
        let userID = "invalidUserID"

        await request(app).get("/getAllQuestionsFromAUser/" + userID + "/" + jwt)
        .expect(404)
    })

    it("tests getAllQuestionsFromAUser with non existent user ID", async () => {
        let jwt = "validJWT"
        let userID = "noUserID"

        await request(app).get("/getAllQuestionsFromAUser/" + userID + "/" + jwt)
        .expect(404)
    })

    it("tests getAllQuestionsFromAUser with valid user ID", async () => {
        let jwt = "validJWT"
        let userID = "validUserID"

        await request(app).get("/getAllQuestionsFromAUser/" + userID + "/" + jwt)
        .expect(200)
    })

    it("tests postQuestion with null parameters", async () => {
        let 

        // drop this collection if it exists, before adding the student
        try {
            await dbCourse.collection(coursename).drop()
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
            await dbCourse.collection(coursename).drop()
        } catch (err) {
            // collection DNE, don't drop
        }
    })


})

// //https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
// function generateRandomString(length) {
//     var result = '';
//     var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     var charactersLength = characters.length;
//     for (var i = 0; i < length; i++) {
//         result += characters.charAt(Math.floor(Math.random() *
//             charactersLength));
//     }
//     return result;
// }