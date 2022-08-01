const app = require("../../app")
const request = require("supertest");
var mongoose = require('mongoose')

// jest.mock("../../controllers/chatEngine")
// jest.mock("../../controllers/forumEngine")
jest.mock("../../utils/authUtils")
//const { getDisplayNameByUserIDfromDB } = require("../controllers/userStore")

beforeAll(async () => {
    dbUser = await client.db("user")
    dbCourse = await client.db("course")
    userCollection = await dbUser.collection("userCollection")
})

afterAll(async () => {
    //await module.exports.forumDB.close();
    await mongoose.disconnect()
    //await mongoose.connection.close()
    await client.close()
    //await new Promise(resolve => setTimeout(() => resolve(), 50000));
});


describe("userStore tests", () => {

    it("tests login valid", async () => {
        let username = "johndoe"
        let password = "validpassworD12345??"
        let body = {username: username, password: password};
        await request(app).post("/login").send(body).expect(200)
        jest.setTimeout(30000);
    })

    it("tests login empty", async () => {
        let username = ""
        let password = ""
        let body = {username: username, password: password};
        await request(app).post("/login").send(body).expect(400)
        jest.setTimeout(30000);
    })

    it("tests login not registered", async () => {
        let username = "notRegistered"
        let password = "validpassworD12345??"
        let body = {username: username, password: password};
        await request(app).post("/login").send(body).expect(400)
        jest.setTimeout(30000);
    })

    it("tests login wrong password", async () => {
        let username = "validRegisteredUser"
        let password = "wrongPassword"
        let body = {username: username, password: password};
        await request(app).post("/login").send(body).expect(400)
        jest.setTimeout(30000);
    })

})