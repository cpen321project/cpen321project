const app = require("../app")
const request = require("supertest");
var mongoose = require('mongoose')

jest.mock("../controllers/chatEngine")
jest.mock("../controllers/forumEngine")
jest.mock("../utils/authUtils")
//const userStore = require("../controllers/userStore")

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

    // it("tests signUp invalid username", async () => {
    //     let email = "email"
    //     let password = "password"
    //     let username = "$%*^*$##$"

    //     let body = {email: email, password: password, username: username};
    //     await request(app).post("/signup").send(body).expect(400)
    //     jest.setTimeout(30000);
    // })

    // it("tests signUp long username", async () => {
    //     let email = "email"
    //     let password = "password"
    //     let username = ""
    //     let body = {email: email, password: password, username: username};
    //     await request(app).post("/signup").send(body).expect(400)
    //     jest.setTimeout(30000);
    // })

    // it("tests signUp other than lowercase and number", async () => {
    //     let email = "email"
    //     let password = "password"
    //     let username = "Abc,,"
    //     let body = {email: email, password: password, username: username};
    //     await request(app).post("/signup").send(body).expect(400)
    //     jest.setTimeout(30000);
    // })

    // it("tests signUp valid", async () => {
    //     let email = "johndoe@hjhmail.com"
    //     let password = "validPassword123!!!"
    //     let username = "johndoe"
    //     let body = {email: email, password: password, username: username};
    //     await request(app).post("/signup").send(body).expect(200)
    //     jest.setTimeout(30000);
    // })

    // it("tests signUp email already exist", async () => {
    //     let email = "a@my.com"
    //     let password = "validPassword123!!!"
    //     let username = "johndoe"
    //     let body = {email: email, password: password, username: username};
    //     await request(app).post("/signup").send(body).expect(400)
    //     jest.setTimeout(30000);
    // })

    // it("tests signUp invalid email", async () => {
    //     let email = "aaaaaaaaaaaa"
    //     let password = "validPassword123!!!"
    //     let username = "johndoe"
    //     let body = {email: email, password: password, username: username};
    //     await request(app).post("/signup").send(body).expect(400)
    //     jest.setTimeout(30000);
    // })


    // it("tests signUp invalid password", async () => {
    //     let email = "johndoe2@hjhmail.com"
    //     let password = "1UxneO3fjy6ncgth2dPlxIHYwb6X3XXdzKnuvDNJy1OZLkrmoRhTM9Ab1ROpWWOK9seaLdRI3dxc4zDCiJPbhMGFDe8mhx91JiWfnuem6psrmwF45HpNhmparqFoh9lpb2gmAObBO9JwkZ0p5himtnXH1vTVFoqb77KhehXUUGgFh3TEGVSNkjBXeS63H598NA8liJymgqzSzi9pnTdRhr8JAxIrWyRlInb9UMIc0BdzGJ757GGSjzMgdzYfk4qhf"
    //     let username = "johndoe"
    //     let body = {email: email, password: password, username: username};
    //     await request(app).post("/signup").send(body).expect(400)
    //     jest.setTimeout(30000);
    // })

    // it("tests confirmSignUp code mismatch", async () => {
    //     let username = "johndoe"
    //     let confirmationCode = "mismatchCode"
    //     let body = {username: username, confirmationCode : confirmationCode};
    //     await request(app).post("/confirmsignup").send(body).expect(400)
    //     jest.setTimeout(30000);
    // })

    // it("tests confirmSignUp code expired", async () => {
    //     let username = "johndoe"
    //     let confirmationCode = "expiredCode"
    //     let body = {username: username, confirmationCode : confirmationCode};
    //     await request(app).post("/confirmsignup").send(body).expect(400)
    //     jest.setTimeout(30000);
    // })

    // it("tests confirmSignUp username dne", async () => {
    //     let username = "notExist"
    //     let confirmationCode = "validCode"
    //     let body = {username: username, confirmationCode : confirmationCode};
    //     await request(app).post("/confirmsignup").send(body).expect(400)
    //     jest.setTimeout(30000);
    // })

    // it("tests confirmSignUp valid", async () => {
    //     let username = "johndoe"
    //     let confirmationCode = "validCode"
    //     let body = {username: username, confirmationCode : confirmationCode};
    //     await request(app).post("/confirmsignup").send(body).expect(200)
    //     jest.setTimeout(30000);
    // })

    // it("tests login valid", async () => {
    //     let username = "johndoe"
    //     let password = "validpassworD12345??"
    //     let body = {username: username, password: password};
    //     await request(app).post("/login").send(body).expect(200)
    //     jest.setTimeout(30000);
    // })

    // it("tests login empty", async () => {
    //     let username = ""
    //     let password = ""
    //     let body = {username: username, password: password};
    //     await request(app).post("/login").send(body).expect(400)
    //     jest.setTimeout(30000);
    // })

    // it("tests login not registered", async () => {
    //     let username = "notRegistered"
    //     let password = "validpassworD12345??"
    //     let body = {username: username, password: password};
    //     await request(app).post("/login").send(body).expect(400)
    //     jest.setTimeout(30000);
    // })

    // it("tests login wrong password", async () => {
    //     let username = "validRegisteredUser"
    //     let password = "wrongPassword"
    //     let body = {username: username, password: password};
    //     await request(app).post("/login").send(body).expect(400)
    //     jest.setTimeout(30000);
    // })

    // it("tests resend confirmation code valid ", async () => {
    //     let username = "validRegisteredUser"
    //     let body = {username: username};
    //     await request(app).post("/resendconfirmationcode").send(body).expect(200)
    //     jest.setTimeout(30000);
    // })

    // it("tests resend confirmation code empty ", async () => {
    //     let username = ""
    //     let body = {username: username};
    //     await request(app).post("/resendconfirmationcode").send(body).expect(400)
    //     jest.setTimeout(30000);
    // })

    // it("tests resend confirmation code not registered ", async () => {
    //     let username = "notRegistered"
    //     let body = {username: username};
    //     await request(app).post("/resendconfirmationcode").send(body).expect(400)
    //     jest.setTimeout(30000);
    // })


    it("tests getUserProfile with valid userID", async () => {
        //console.log("1")
        let otherUserID = "0"
        let userID = "validUserID"
        let jwt = "validJWT"
        await request(app).get("/getuserprofile/" + otherUserID + "/" + userID + "/" + jwt).expect(200)
        jest.setTimeout(30000);
    })

})