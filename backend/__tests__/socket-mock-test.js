var mongoose = require('mongoose')
const ioClient = require('socket.io-client');

jest.mock("../utils/authUtils")

let sender;
let ioServer;

beforeAll((done) => {
    ioServer = require('../server');
    done();
});

afterAll(async () => {
    ioServer.close()

    await mongoose.disconnect()
    if (client) {
        await client.close()
    }
})

describe('Server events', function () {
    beforeEach(function (done) {
        sender = ioClient('http://localhost:3010/')
        sender.on('connect', () => {
            done()
        })
    })

    afterEach(function (done) {
        // disconnect io clients after each test
        sender.disconnect()
        done();
    });

    describe('Server Events', function () {
        test('should set tokenIsValid to true.', (done) => {
            let displayName = "displayName"
            let userID = "validUserID"
            let jwt = "validJWT"

            sender.emit("joinPrivateChat", displayName, userID, jwt)

            setTimeout(function () {
                console.log("here")
                expect(testTokenIsValid).toBe(true)
                done()
            }, 3000)
        })

        test('should set tokenIsValid to false.', (done) => {
            let displayName = "displayName"
            let userID = "invalidUserID"
            let jwt = "invalidJWT"

            sender.emit("joinPrivateChat", displayName, userID, jwt)

            setTimeout(function () {
                console.log("here")
                expect(testTokenIsValid).toBe(false)
                done()
            }, 3000)
        })
    })
})