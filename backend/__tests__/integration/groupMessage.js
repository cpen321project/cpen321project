const app = require("../../app")
const request = require("supertest")
var mongoose = require('mongoose')

const Message = require('../../models/Message.js')
const PrivateMessage = require('../../models/PrivateMessage.js')

const notificationManager = require("../../controllers/notifcationManager")
const userStore = require('../../controllers/userStore')
const courseManager = require('../../controllers/courseManager')
const chatEngine = require('../../controllers/chatEngine')
const forumEngine = require('../../controllers/forumEngine')
const authUtils = require('../../utils/authUtils')

// these mocks are necessary because our complexity feature requires
// sign up which requires a confirmation code sent to the user's email, 
// which cannot be done with automated testing. The notificationManager 
// also requires a token which is required by user signing up. The access 
// token required for each interface call also requires this.
// AWS Cognito only allows 50 new signups a day, hence we have to mock these 
jest.mock("../../controllers/notifcationManager")
jest.mock("../../utils/authUtils")
jest.mock('../../controllers/userStore')

beforeEach(() => {
    jest.setTimeout(10000)
})

describe("send group message use case tests", () => {

    beforeAll(async () => {
        const config = {
            db: {
                url: 'localhost:27017',
                name: 'chatdb_3'
            }
        }

        const CONNECTION_URL = `mongodb://${config.db.url}/${config.db.name}`

        await mongoose.connect(CONNECTION_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        dbUser = await client.db("user")
        dbCourse = await client.db("course")
        userCollection = await dbUser.collection("userCollection")
    })


    // getConversationByGroupID tests
    it("tests getConversationByGroupID with null groupID", async () => {
        let groupID = null
        let userID = "validUserID"
        let jwt = "validJWT"
        // await request(app).get("/getConversationByGroupID/" + senderID + "/" + receiverID + "/" + jwt)
        // // .expect(400)

        // expect(console.log).toHaveBeenCalledWith("Token not validated")

        const req = {
            params: { groupID, userID, jwt }
        }
        let res = {
            status: function (s) { this.status = s; return this; },
            json: function (s) { this.json = s; return this; }
        }
        await chatEngine.getConversationByGroupID(req, res)
        expect(res.status).toBe(404)
    })

    it("tests getConversationByGroupID with empty userID", async () => {
        let groupID = "validGroupID"
        let userID = ""
        let jwt = "validJWT"

        const req = {
            params: { groupID, userID, jwt }
        }
        let res = {
            status: function (s) { this.status = s; return this; },
            json: function (s) { this.json = s; return this; }
        }
        await chatEngine.getConversationByGroupID(req, res)
        expect(res.status).toBe(404)
    })

    it("tests getConversationByGroupID with invalid userID", async () => {
        let groupID = "validGroupID"
        let userID = "invalidUserID"
        let jwt = "validJWT"

        const req = {
            params: { groupID, userID, jwt }
        }
        let res = {
            status: function (s) { this.status = s; return this; },
            json: function (s) { this.json = s; return this; }
        }
        await chatEngine.getConversationByGroupID(req, res)
        expect(res.status).toBe(400)
    })

    it("tests getConversationByGroupID with null jwt", async () => {
        let groupID = "validGroupID"
        let userID = "validUserID"
        let jwt = null

        const req = {
            params: { groupID, userID, jwt }
        }
        let res = {
            status: function (s) { this.status = s; return this; },
            json: function (s) { this.json = s; return this; }
        }
        await chatEngine.getConversationByGroupID(req, res)
        expect(res.status).toBe(404)
    })

    it("tests getConversationByGroupID with empty jwt", async () => {
        let groupID = "validGroupID"
        let userID = "validUserID"
        let jwt = ""

        const req = {
            params: { groupID, userID, jwt }
        }
        let res = {
            status: function (s) { this.status = s; return this; },
            json: function (s) { this.json = s; return this; }
        }
        await chatEngine.getConversationByGroupID(req, res)
        expect(res.status).toBe(404)
    })

    it("tests getConversationByGroupID with invalid jwt", async () => {
        let groupID = "validGroupID"
        let userID = "validUserID"
        let jwt = "invalidJWT"

        const req = {
            params: { groupID, userID, jwt }
        }
        let res = {
            status: function (s) { this.status = s; return this; },
            json: function (s) { this.json = s; return this; }
        }
        await chatEngine.getConversationByGroupID(req, res)
        expect(res.status).toBe(400)
    })

    it("tests getConversationByGroupID with valid params and empty convo", async () => {
        let groupID = "validGroupID"
        let userID = "validUserID"
        let jwt = "validJWT"

        const req = {
            params: { groupID, userID, jwt }
        }
        let res = {
            status: function (s) { this.status = s; return this; },
            json: function (s) { this.json = s; return this; }
        }
        await chatEngine.getConversationByGroupID(req, res)
        expect(res.status).toBe(200)
    })

    it("tests getConversationByGroupID with valid params and non-empty convo", async () => {
        let groupID = "validGroupID"
        let userID = "validUserID"
        let jwt = "validJWT"

        // save a message to the db first
        await chatEngine.saveMessageToDB(groupID, userID, "senderName", "messageContent")

        const req = {
            params: { groupID, userID, jwt }
        }
        let res = {
            status: function (s) { this.status = s; return this; },
            json: function (s) { this.json = s; return this; },
            send: function (s) { this.send = s; return this; }
        }
        await chatEngine.getConversationByGroupID(req, res)
        console.log("res.status: " + res.status)
        expect(res.status).toBe(200)

        // delete the message 
        let senderID = userID
        await Message.deleteMany({ groupID });

        // await Message.find({ groupID, senderID }).deleteMany().exec();
    })

    // it("tests getConversationByGroupID with empty senderID", async () => {
    //     let senderID = "fgdfgf"
    //     let receiverID = "receiverID"
    //     let jwt = "invalidJWT"
    //     await request(app).get("/getConversationByGroupID/" + senderID + "/" + receiverID + "/" + jwt)
    //     // .expect(400)

    //     expect(console.log).toHaveBeenCalledWith("Token not validated")

    // })

    // it("tests getConversationByGroupID with null senderID", async () => {
    //     let senderID = null
    //     let receiverID = "receiverID"
    //     let jwt = "validJWT"
    //     console.log("love")
    //     await request(app).get("/getConversationByGroupID/" + senderID + "/" + receiverID + "/" + jwt)
    //         .expect(404)
    //         .then(res => {
    //             expect(res.body).toEqual("Invalid coursename")
    //         })
    // })

    // it("tests getConversationByGroupID with empty senderID", async () => {
    //     let senderID = ""
    //     let receiverID = "receiverID"
    //     let jwt = "validJWT"
    //     await request(app).get("/getConversationByGroupID/" + senderID + "/" + receiverID + "/" + jwt)
    //         .expect(404)
    // })

    // it("tests getConversationByGroupID with empty senderID", async () => {
    //     let senderID = ""
    //     let receiverID = "receiverID"
    //     let jwt = "validJWT"
    //     await request(app).get("/getConversationByGroupID/" + senderID + "/" + receiverID + "/" + jwt)
    //         .expect(404)
    // })

    // it("tests getConversationByGroupID with empty conversation", async () => {
    //     let senderID = "validUserID"
    //     let receiverID = "receiverID"
    //     let jwt = "validJWT"
    //     await request(app).get("/getConversationByGroupID/" + senderID + "/" + receiverID + "/" + jwt)
    //         .expect(200)
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

    afterAll(async () => {
        await mongoose.disconnect()

        if (client) {
            await client.close()
        }
    })
})