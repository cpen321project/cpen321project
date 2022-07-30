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

})