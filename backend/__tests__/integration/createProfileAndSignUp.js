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

    it("tests signUp invalid username", async () => {
        let email = "email"
        let password = "password"
        let username = "$%*^*$##$"

        let body = { email, password, username };
        await request(app).post("/signup").send(body).expect(400)
        jest.setTimeout(30000);
    })

    it("tests signUp long username", async () => {
        let email = "email"
        let password = "password"
        let username = ""
        let body = { email, password, username };
        await request(app).post("/signup").send(body).expect(400)
        jest.setTimeout(30000);
    })

    it("tests signUp other than lowercase and number", async () => {
        let email = "email"
        let password = "password"
        let username = "Abc,,"
        let body = { email, password, username };
        await request(app).post("/signup").send(body).expect(400)
        jest.setTimeout(30000);
    })

    it("tests signUp valid", async () => {
        let email = "johndoe@hjhmail.com"
        let password = "validPassword123!!!"
        let username = "johndoe"
        let body = { email, password, username };
        await request(app).post("/signup").send(body).expect(200)
        jest.setTimeout(30000);
    })

    it("tests signUp email already exist", async () => {
        let email = "a@my.com"
        let password = "validPassword123!!!"
        let username = "johndoe"
        let body = { email, password, username };
        await request(app).post("/signup").send(body).expect(400)
        jest.setTimeout(30000);
    })

    it("tests signUp invalid email", async () => {
        let email = "aaaaaaaaaaaa"
        let password = "validPassword123!!!"
        let username = "johndoe"
        let body = { email, password, username };
        await request(app).post("/signup").send(body).expect(400)
        jest.setTimeout(30000);
    })


    it("tests signUp invalid password", async () => {
        let email = "johndoe2@hjhmail.com"
        let password = "1UxneO3fjy6ncgth2dPlxIHYwb6X3XXdzKnuvDNJy1OZLkrmoRhTM9Ab1ROpWWOK9seaLdRI3dxc4zDCiJPbhMGFDe8mhx91JiWfnuem6psrmwF45HpNhmparqFoh9lpb2gmAObBO9JwkZ0p5himtnXH1vTVFoqb77KhehXUUGgFh3TEGVSNkjBXeS63H598NA8liJymgqzSzi9pnTdRhr8JAxIrWyRlInb9UMIc0BdzGJ757GGSjzMgdzYfk4qhf"
        let username = "johndoe"
        let body = { email, password, username };
        await request(app).post("/signup").send(body).expect(400)
        jest.setTimeout(30000);
    })

    it("tests confirmSignUp code mismatch", async () => {
        let username = "johndoe"
        let confirmationCode = "mismatchCode"
        let body = { username, confirmationCode };
        await request(app).post("/confirmsignup").send(body).expect(400)
        jest.setTimeout(30000);
    })

    it("tests confirmSignUp code expired", async () => {
        let username = "johndoe"
        let confirmationCode = "expiredCode"
        let body = { username, confirmationCode };
        await request(app).post("/confirmsignup").send(body).expect(400)
        jest.setTimeout(30000);
    })

    it("tests confirmSignUp username dne", async () => {
        let username = "notExist"
        let confirmationCode = "validCode"
        let body = { username, confirmationCode };
        await request(app).post("/confirmsignup").send(body).expect(400)
        jest.setTimeout(30000);
    })

    it("tests confirmSignUp valid", async () => {
        let username = "johndoe"
        let confirmationCode = "validCode"
        let body = { username, confirmationCode };
        await request(app).post("/confirmsignup").send(body).expect(200)
        jest.setTimeout(30000);
    })

    it("tests resend confirmation code valid ", async () => {
        let username = "validRegisteredUser"
        let body = { username };
        await request(app).post("/resendconfirmationcode").send(body).expect(200)
        jest.setTimeout(30000);
    })

    it("tests resend confirmation code empty ", async () => {
        let username = ""
        let body = { username };
        await request(app).post("/resendconfirmationcode").send(body).expect(400)
        jest.setTimeout(30000);
    })

    it("tests resend confirmation code not registered ", async () => {
        let username = "notRegistered"
        let body = { username };
        await request(app).post("/resendconfirmationcode").send(body).expect(400)
        jest.setTimeout(30000);
    })


    it("tests getUserProfile with invalid userID", async () => {

        let otherUserID = "0"
        let userID = "invalidUserID"
        let jwt = "validJWT"
        await request(app).get("/getuserprofile/" + otherUserID + "/" + userID + "/" + jwt).expect(400)
        jest.setTimeout(30000);
    })

    it("tests getUserProfile with valid userID in database", async () => {
        let otherUserID = "0"
        let userID = "validUserID100"
        let jwt = "validJWT"

        await userCollection.insertOne({
            displayName: "GUP test valid",
            userID,
            coopStatus: "Yes",
            yearStanding: "1",
            registrationToken: "regToken",
            courselist: [],
            blockedUsers: [],
        })

        await request(app).get("/getuserprofile/" + otherUserID + "/" + userID + "/" + jwt).expect(200)

        await userCollection.deleteOne({ userID })

        jest.setTimeout(30000);
    })

    it("tests getUserProfile with empty userID", async () => {
        let otherUserID = "0"
        let userID = ""
        let jwt = "validJWT"
        await request(app).get("/getuserprofile/" + otherUserID + "/" + userID + "/" + jwt).expect(404)
        jest.setTimeout(30000);
    })

    it("tests getUserProfile with null userID", async () => {
        let otherUserID = "0"
        let userID = null
        let jwt = "validJWT"
        await request(app).get("/getuserprofile/" + otherUserID + "/" + userID + "/" + jwt).expect(400)
        jest.setTimeout(30000);
    })

    it("tests getUserProfile with null jwt", async () => {
        let otherUserID = "0"
        let userID = "validUserID"
        let jwt = null
        await request(app).get("/getuserprofile/" + otherUserID + "/" + userID + "/" + jwt).expect(400)
        jest.setTimeout(30000);
    })

    it("tests getUserProfile with invalid jwt", async () => {
        let otherUserID = "0"
        let userID = "validUserID"
        let jwt = "invalidJWT"
        await request(app).get("/getuserprofile/" + otherUserID + "/" + userID + "/" + jwt).expect(400)
        jest.setTimeout(30000);
    })

    it("tests getUserProfile with expired jwt", async () => {
        let otherUserID = "0"
        let userID = "validUserID"
        let jwt = "expiredJWT"
        await request(app).get("/getuserprofile/" + otherUserID + "/" + userID + "/" + jwt).expect(400)
        jest.setTimeout(30000);
    })

    it("tests getUserProfile with empty jwt", async () => {
        let otherUserID = "0"
        let userID = "validUserID"
        let jwt = ""
        await request(app).get("/getuserprofile/" + otherUserID + "/" + userID + "/" + jwt).expect(404)
        jest.setTimeout(30000);
    })

    it("tests create profile with illegal display name", async () => {
        let displayName = "$%*^*$##$"
        let userID = "validUserID"
        let coopStatus = "Yes"
        let yearStanding = "1"
        let registrationToken = "sometoken"
        await request(app).post("/createprofile").send({
            displayName,
            userID,
            coopStatus,
            yearStanding,
            registrationToken
        })
            .expect(400)

        jest.setTimeout(30000);
    })

    it("tests create profile with empty display name", async () => {
        let displayName = ""
        let userID = "validUserID"
        let coopStatus = "Yes"
        let yearStanding = "1"
        let registrationToken = "sometoken"
        await request(app).post("/createprofile").send({
            displayName,
            userID,
            coopStatus,
            yearStanding,
            registrationToken
        })
            .expect(400)
        jest.setTimeout(30000);
    })

    it("tests create profile with illegal year standing", async () => {
        let displayName = "yayayay"
        let userID = "validUserID"
        let coopStatus = "Yes"
        let yearStanding = "7"
        let registrationToken = "sometoken"
        await request(app).post("/createprofile").send({
            displayName,
            userID,
            coopStatus,
            yearStanding,
            registrationToken
        })
            .expect(400)
        jest.setTimeout(30000);
    })

    it("tests create profile with empty year standing", async () => {
        let displayName = "yayaya"
        let userID = "validUserID"
        let coopStatus = "Yes"
        let yearStanding = ""
        let registrationToken = "sometoken"
        await request(app).post("/createprofile").send({
            displayName,
            userID,
            coopStatus,
            yearStanding,
            registrationToken
        })
            .expect(400)
        jest.setTimeout(30000);
    })

    it("tests create profile with empty coop status", async () => {
        let displayName = "yayayay"
        let userID = "validUserID"
        let coopStatus = ""
        let yearStanding = "1"
        let registrationToken = "sometoken"
        await request(app).post("/createprofile").send({
            displayName,
            userID,
            coopStatus,
            yearStanding,
            registrationToken
        })
            .expect(400)
        jest.setTimeout(30000);
    })

    it("tests create profile with empty registration token", async () => {
        let displayName = "yayayya"
        let userID = "validUserID"
        let coopStatus = "Yes"
        let yearStanding = "1"
        let registrationToken = ""
        await request(app).post("/createprofile").send({
            displayName,
            userID,
            coopStatus,
            yearStanding,
            registrationToken
        })
            .expect(400)
        jest.setTimeout(30000);
    })

    it("tests create profile with empty userID", async () => {
        let displayName = "yayayya"
        let userID = ""
        let coopStatus = "Yes"
        let yearStanding = "1"
        let registrationToken = "sometoken"
        await request(app).post("/createprofile").send({
            displayName,
            userID,
            coopStatus,
            yearStanding,
            registrationToken
        })
            .expect(400)
        jest.setTimeout(30000);
    })


    it("tests create profile with valid parameters", async () => {
        let displayName = "yayayya"
        let userID = "validUserIDcreate"
        let coopStatus = "Yes"
        let yearStanding = "1"
        let registrationToken = "sometoken"; let notifyMe = "No"
        await request(app).post("/createprofile").send({
            displayName,
            userID,
            coopStatus,
            yearStanding,
            registrationToken, notifyMe
        })
            .expect(200)
        jest.setTimeout(30000);

        try {
            await userCollection.remove({ userID })
        } catch (err) {
            // collection DNE, don't drop
        }
    })

    it("tests edit profile with illegal display name", async () => {
        let displayName = "$%*^*$##$"
        let userID = "validUserID1"
        let coopStatus = "Yes"
        let yearStanding = "1"
        let jwt = "validJWT1"

        // delete user if it exists 
        await userCollection.deleteOne({ userID })

        // add new user
        await userCollection.insertOne({
            displayName,
            userID,
            coopStatus,
            yearStanding,
            registrationToken: "regToken",
            courselist: ["INDO 100"],
            blockedUsers: [],
        })

        await dbCourse.collection("INDO 100").insertOne({
            displayName,
            userID,
        })

        await request(app).put("/editprofile").send({
            displayName,
            userID,
            coopStatus,
            yearStanding,
            jwt
        })
            .expect(400)

        await userCollection.deleteOne({ userID })
        await dbCourse.collection("INDO 100").deleteOne({ userID })

        jest.setTimeout(30000);
    })

    it("tests edit profile with empty display name", async () => {
        let displayName = ""
        let userID = "validUserID2"
        let coopStatus = "Yes"
        let yearStanding = "1"
        let jwt = "validJWT2"

        // delete user if it exists 
        await userCollection.deleteOne({ userID })

        // add new user
        await userCollection.insertOne({
            displayName,
            userID,
            coopStatus,
            yearStanding,
            registrationToken: "regToken",
            courselist: ["INDO 100"],
            blockedUsers: [],
        })

        await dbCourse.collection("INDO 100").insertOne({
            displayName,
            userID,
        })

        await request(app).put("/editprofile").send({
            displayName,
            userID,
            coopStatus,
            yearStanding,
            jwt
        })
            .expect(400)
        jest.setTimeout(30000);

        await userCollection.deleteOne({ userID })
        await dbCourse.collection("INDO 100").deleteOne({ userID })
    })

    it("tests edit profile with illegal year standing", async () => {
        let displayName = "yayayay"
        let userID = "validUserID3"
        let coopStatus = "Yes"
        let yearStanding = "7"
        let jwt = "validJWT3"

        // delete user if it exists 
        await userCollection.deleteOne({ userID })

        // add new user
        await userCollection.insertOne({
            displayName,
            userID,
            coopStatus,
            yearStanding,
            registrationToken: "regToken",
            courselist: ["INDO 100"],
            blockedUsers: [],
        })

        await dbCourse.collection("INDO 100").insertOne({
            displayName,
            userID,
        })

        await request(app).put("/editprofile").send({
            displayName,
            userID,
            coopStatus,
            yearStanding,
            jwt
        })
            .expect(400)
        jest.setTimeout(30000);

        await userCollection.deleteOne({ userID })
        await dbCourse.collection("INDO 100").deleteOne({ userID })
    })

    it("tests edit profile with empty year standing", async () => {
        let displayName = "yayaya"
        let userID = "validUserID4"
        let coopStatus = "Yes"
        let yearStanding = ""
        let jwt = "validJWT4"

        // delete user if it exists 
        await userCollection.deleteOne({ userID })

        // add new user
        await userCollection.insertOne({
            displayName,
            userID,
            coopStatus,
            yearStanding,
            registrationToken: "regToken",
            courselist: ["INDO 100"],
            blockedUsers: [],
        })

        await dbCourse.collection("INDO 100").insertOne({
            displayName,
            userID,
        })

        await request(app).put("/editprofile").send({
            displayName,
            userID,
            coopStatus,
            yearStanding,
            jwt
        })
            .expect(400)
        jest.setTimeout(30000);

        await userCollection.deleteOne({ userID })
        await dbCourse.collection("INDO 100").deleteOne({ userID })
    })

    it("tests edit profile with empty coop status", async () => {
        let displayName = "yayayya"
        let userID = "validUserID5"
        let coopStatus = ""
        let yearStanding = "1"
        let jwt = "validJWT5"

        // delete user if it exists 
        await userCollection.deleteOne({ userID })

        // add new user
        await userCollection.insertOne({
            displayName,
            userID,
            coopStatus,
            yearStanding,
            registrationToken: "regToken",
            courselist: ["INDO 100"],
            blockedUsers: [],
        })

        await dbCourse.collection("INDO 100").insertOne({
            displayName,
            userID,
        })

        await request(app).put("/editprofile").send({
            displayName,
            userID,
            coopStatus,
            yearStanding,
            jwt
        })
            .expect(400)
        jest.setTimeout(30000);

        await userCollection.deleteOne({ userID })
        await dbCourse.collection("INDO 100").deleteOne({ userID })
    })


    it("tests edit profile with empty userID", async () => {
        let displayName = "yayaya"
        let userID = ""
        let coopStatus = "Yes"
        let yearStanding = "1"
        let jwt = "validJWTaa"

        // delete user if it exists 
        await userCollection.deleteOne({ userID })

        // add new user
        await userCollection.insertOne({
            displayName,
            userID,
            coopStatus,
            yearStanding,
            registrationToken: "regToken",
            courselist: ["INDO 100"],
            blockedUsers: [],
        })

        await dbCourse.collection("INDO 100").insertOne({
            displayName,
            userID,
        })

        await request(app).put("/editprofile").send({
            displayName,
            userID,
            coopStatus,
            yearStanding,
            jwt
        })
            .expect(400)
        jest.setTimeout(30000);

        await userCollection.deleteOne({ userID })
        await dbCourse.collection("INDO 100").deleteOne({ userID })
    })


    it("tests edit profile with valid parameters", async () => {
        let displayName = "yayaya"
        let userID = "validUserID6"
        let coopStatus = "Yes"
        let yearStanding = "1"
        let jwt = "validJWT6"; let notifyMe = "No"

        // delete user if it exists 
        //await userCollection.deleteOne({ userID })

        // add new user
        await userCollection.insertOne({
            displayName,
            userID,
            coopStatus,
            yearStanding,
            registrationToken: "regToken",
            courselist: [],
            blockedUsers: [], notifyMe
        })

        await userCollection.updateOne({ userID }, { $push: { "courselist": "INDO 100" } })

        await dbCourse.collection("INDO 100").insertOne({
            displayName,
            userID,
        })

        await request(app).put("/editprofile").send({
            displayName,
            userID,
            coopStatus,
            yearStanding,
            jwt, notifyMe
        })
            .expect(200).then(userCollection.deleteOne({ userID })).then(dbCourse.collection("INDO 100").deleteOne({ userID }))
        jest.setTimeout(30000);

        //await userCollection.deleteOne({ userID })
        //await dbCourse.collection("INDO 100").deleteOne({ userID })
    })

    it("tests edit profile with null jwt", async () => {
        let displayName = "yayaya"
        let userID = "validUserIDbb"
        let coopStatus = "Yes"
        let yearStanding = "1"
        let jwt = null

        await request(app).put("/editprofile").send({
            displayName,
            userID,
            coopStatus,
            yearStanding,
            jwt
        })
            .expect(400)
        jest.setTimeout(30000);

        // await userCollection.deleteOne({ userID })
        // await dbCourse.collection("INDO 100").deleteOne({ userID })
    })

    it("tests edit profile with empty jwt", async () => {
        let displayName = "yayaya"
        let userID = "validUserIDcc"
        let coopStatus = "Yes"
        let yearStanding = "1"
        let jwt = ""

        // delete user if it exists 
        await userCollection.deleteOne({ userID })

        // add new user
        await userCollection.insertOne({
            displayName,
            userID,
            coopStatus,
            yearStanding,
            registrationToken: "regToken",
            courselist: ["INDO 100"],
            blockedUsers: [],
        })

        await dbCourse.collection("INDO 100").insertOne({
            displayName,
            userID,
        })

        await request(app).put("/editprofile").send({
            displayName,
            userID,
            coopStatus,
            yearStanding,
            jwt
        })
            .expect(400)
        jest.setTimeout(30000);

        await userCollection.deleteOne({ userID })
        await dbCourse.collection("INDO 100").deleteOne({ userID })
    })


    it("tests edit profile with empty userID", async () => {
        let displayName = "yayaya"
        let userID = ""
        let coopStatus = "Yes"
        let yearStanding = "1"
        let jwt = "invalidJWT"

        // delete user if it exists 
        await userCollection.deleteOne({ userID })

        // add new user
        await userCollection.insertOne({
            displayName,
            userID,
            coopStatus,
            yearStanding,
            registrationToken: "regToken",
            courselist: ["INDO 100"],
            blockedUsers: [],
        })

        await dbCourse.collection("INDO 100").insertOne({
            displayName,
            userID,
        })

        await request(app).put("/editprofile").send({
            displayName,
            userID,
            coopStatus,
            yearStanding,
            jwt
        })
            .expect(400)
        jest.setTimeout(30000);

        await userCollection.deleteOne({ userID })
        await dbCourse.collection("INDO 100").deleteOne({ userID })
    })


})