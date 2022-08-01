const app = require("../../app")
const { MongoClient } = require("mongodb")
var mongoose = require('mongoose')
const ioClient = require('socket.io-client')
// const ioServer = require('../../server')

const chatEngine = require('../../controllers/chatEngine')
const PrivateMessage = require('../../models/PrivateMessage.js')
const Message = require('../../models/Message.js')


// these mocks are necessary because our complexity feature requires
// sign up which requires a confirmation code sent to the user's email, 
// which cannot be done with automated testing. The notificationManager 
// also requires a token which is required by user signing up. The access 
// token required for each interface call also requires this.
// AWS Cognito only allows 50 new signups a day, hence we have to mock these 
jest.mock("../../controllers/notifcationManager")
jest.mock("../../utils/authUtils")
jest.mock('../../controllers/userStore')

describe("getConversationByGroupID tests", () => {
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

    afterAll(async () => {
        await mongoose.disconnect()

        if (client) {
            await client.close()
        }
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
})

let ioServer
let sender

describe('joinGroupChat and groupMessage socket events tests', function () {
    beforeAll(async () => {
        ioServer = require('../../server')

        // connect mongo
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

    })

    beforeEach(function (done) {
        sender = ioClient('http://localhost:3010/')
        sender.on('connect', () => {
            done()
        })
    })

    afterEach(function (done) {
        sender.disconnect()
        done()
    })

    afterAll(async () => {
        ioServer.close()

        await mongoose.disconnect()
        if (client) {
            await client.close()
        }
    })

    test('joinGroupChat: null userID', (done) => {
        let groupID = "validGroupID"
        let userID = null
        let jwt = "validJWT"

        sender.emit("joinGroupChat", groupID, userID, jwt)

        const logSpy = jest.spyOn(console, 'log');

        setTimeout(function () {
            expect(logSpy).toHaveBeenCalledWith("Token not validated");
            done()
        }, 1000)
    })

    test('joinGroupChat: empty userID', (done) => {
        let groupID = "validGroupID"
        let userID = ""
        let jwt = "validJWT"

        sender.emit("joinGroupChat", groupID, userID, jwt)

        const logSpy = jest.spyOn(console, 'log');

        setTimeout(function () {
            expect(logSpy).toHaveBeenCalledWith("Token not validated");
            done()
        }, 1000)
    })

    test('joinGroupChat: invalid userID', (done) => {
        let groupID = "validGroupID"
        let userID = "invalidUserID"
        let jwt = "validJWT"

        sender.emit("joinGroupChat", groupID, userID, jwt)

        const logSpy = jest.spyOn(console, 'log');

        setTimeout(function () {
            expect(logSpy).toHaveBeenCalledWith("Token not validated");
            done()
        }, 1000)
    })

    test('joinGroupChat: invalid userID', (done) => {
        let groupID = "validGroupID"
        let userID = "invalidUserID"
        let jwt = "invalidJWT"

        sender.emit("joinGroupChat", groupID, userID, jwt)

        const logSpy = jest.spyOn(console, 'log');

        setTimeout(function () {
            expect(logSpy).toHaveBeenCalledWith("Token not validated");
            done()
        }, 1000)
    })

    test('joinGroupChat: valid params', (done) => {
        let groupID = "validGroupID"
        let userID = "validUserID"
        let jwt = "validJWT"

        sender.emit("joinGroupChat", groupID, userID, jwt)

        const logSpy = jest.spyOn(console, 'log');

        setTimeout(function () {
            expect(logSpy).toHaveBeenCalledWith(userID + " : joined at groupID : " + groupID);
            done()
        }, 1000)
    })

    test('groupMessage: any null parameter', (done) => {
        let groupID = "validGroupID"
        let senderID = null
        let senderName = "senderName1"
        let messageContent = "messageContent"

        sender.emit("groupMessage", groupID, senderID, senderName, messageContent)

        const logSpy = jest.spyOn(console, 'log');

        setTimeout(function () {
            expect(logSpy).toHaveBeenCalledWith('Token not validated');
            done()
        }, 1000)
    })

    test('groupMessage: any empty parameter', (done) => {
        let groupID = "validGroupID"
        let senderID = ""
        let senderName = "senderName1"
        let messageContent = "messageContent"

        sender.emit("groupMessage", groupID, senderID, senderName, messageContent)

        const logSpy = jest.spyOn(console, 'log');

        setTimeout(function () {
            expect(logSpy).toHaveBeenCalledWith('Token not validated');
            done()
        }, 1000)
    })

    test('groupMessage: all valid params', (done) => {
        let groupID = "validGroupID"
        let senderID = "validUserID"
        let senderName = "senderName1"
        let messageContent = "messageContent"

        // join groupChat first
        let userID = senderID
        let jwt = "validJWT"
        sender.emit("joinGroupChat", groupID, userID, jwt)

        sender.emit("groupMessage", groupID, senderID, senderName, messageContent)

        const logSpy = jest.spyOn(console, 'log');

        setTimeout(function () {
            expect(logSpy).toHaveBeenCalledWith(senderName + " : " + messageContent);
            done()
        }, 2000)
    })
})