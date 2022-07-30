const app = require("../app")
const request = require("supertest");
var mongoose = require('mongoose')


jest.mock("../controllers/chatEngine")
jest.mock("../controllers/forumEngine")
jest.mock("../utils/authUtils")
//const userStore = require("../controllers/userStore")

afterAll(async () => {
    //await module.exports.forumDB.close();
    await mongoose.disconnect()
    //await mongoose.connection.close()
    await client.close()
});


describe("userStore tests", () => {

    it("tests signUp invalid username", async () => {
        let email = "email"
        let password = "password"
        let username = "$%*^*$##$"

        let body = {email: email, password: password, username: username};
        await request(app).post("/signup").send(body).expect(400)
    })

    it("tests signUp long username", async () => {
        let email = "email"
        let password = "password"
        let username = "kYwlXWkg4sZ1nyvpkECTL8XCwxDCPErAMhlXosLFcL8pKDse1TZph4vXrHzsgglpWtJtRCCztCsRu8NE29w9DsPlw66twmmf3jMjSGne4nQNpeM1TjiBwbYvCKUlWQFug6"
        let body = {email: email, password: password, username: username};
        await request(app).post("/signup").send(body).expect(400)
    })

    it("tests signUp other than lowercase and number", async () => {
        let email = "email"
        let password = "password"
        let username = "Abc,,"
        let body = {email: email, password: password, username: username};
        await request(app).post("/signup").send(body).expect(400)
    })

    it("tests signUp valid", async () => {
        let email = "johndoe@hjhmail.com"
        let password = "validPassword123!!!"
        let username = "johndoe"
        let body = {email: email, password: password, username: username};
        await request(app).post("/signup").send(body).expect(200)
    })

    it("tests signUp other than lowercase and number", async () => {
        let email = "a@my.com"
        let password = "validPassword123!!!"
        let username = "johndoe"
        let body = {email: email, password: password, username: username};
        await request(app).post("/signup").send(body).expect(400)

    })

    it("tests signUp invalid email", async () => {
        let email = "aaaaaaaaaaaa"
        let password = "validPassword123!!!"
        let username = "johndoe"
        let body = {email: email, password: password, username: username};
        await request(app).post("/signup").send(body).expect(400)

    })

})