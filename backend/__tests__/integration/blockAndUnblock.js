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

    it("tests block with invalid user id", async () => {
        let blockedUserAdd = "userToBeBlocked"
        let userID = "invalidUserID"
        let jwt = "validJWT"

        await request(app).post("/block")
            .send({
                blockedUserAdd,
                userID,
                jwt
            })
            .expect(400)
    })

    it("tests block with null jwt", async () => {
        let blockedUserAdd = "userToBeBlocked"
        let userID = "validUserID"
        let jwt = null

        await request(app).post("/block")
            .send({
                blockedUserAdd,
                userID,
                jwt
            })
            .expect(400)
    })

    it("tests block with non existing user to be blocked", async () => {
        let blockedUserAdd = "userToBeBlockedDNE"
        let userID = "validUserID"
        let jwt = "validJWT"

        await request(app).post("/block")
            .send({
                blockedUserAdd,
                userID,
                jwt
            })
            .expect(400)
    })

    it("tests block with previously blocked user", async () => {
        let blockedUserAdd = "userToBeBlocked"
        let userID = "validUserID"
        let jwt = "validJWT"

         // delete user if it exists 
         await userCollection.deleteOne({ "userID": userID })

         // add new user
         await userCollection.insertOne({
             displayName: "sample DN",
             userID,
             coopStatus: "Yes",
             yearStanding: "1",
             registrationToken: "regToken",
             courselist: [],
             blockedUsers: [],
         })

         //add new blocked user
         await userCollection.insertOne({
            displayName: "sample DN",
            userID: blockedUserAdd,
            coopStatus: "Yes",
            yearStanding: "1",
            registrationToken: "regToken",
            courselist: [],
            blockedUsers: [],
        })
 
         // add the blockedUserAdd to the user
         await userCollection.updateOne(
             { "userID": userID },
             { $push: { "blockedUsers": blockedUserAdd } }
         )
 
         await request(app).post("/block")
            .send({
                blockedUserAdd,
                userID,
                jwt
            })
            .expect(400)
 
         // delete user
         await userCollection.deleteOne({ "userID": userID })
         await userCollection.deleteOne({ "userID": blockedUserAdd })
        
    })

    it("tests block with empty jwt", async () => {
        let blockedUserAdd = "userToBeBlockedDNE"
        let userID = "validUserID"
        let jwt = ""

        await request(app).post("/block")
            .send({
                blockedUserAdd,
                userID,
                jwt
            })
            .expect(400)
    })

    it("tests block with invalid jwt", async () => {
        let blockedUserAdd = "userToBeBlockedDNE"
        let userID = "validUserID"
        let jwt = "invalidJWT"

        await request(app).post("/block")
            .send({
                blockedUserAdd,
                userID,
                jwt
            })
            .expect(400)
    })

    it("tests block with expired jwt", async () => {
        let blockedUserAdd = "userToBeBlockedDNE"
        let userID = "validUserID"
        let jwt = "expiredJWT"

        await request(app).post("/block")
            .send({
                blockedUserAdd,
                userID,
                jwt
            })
            .expect(400)
    })
    

    it("tests block with valid blockedUserAdd not blocked before", async () => {
        let blockedUserAdd = "userToBeBlocked"
        let userID = "validUserID"
        let jwt = "validJWT"

        // delete user if it exists 
        await userCollection.deleteOne({ "userID": userID })

        // add new user
        await userCollection.insertOne({
            displayName: "sample DN",
            userID,
            coopStatus: "Yes",
            yearStanding: "1",
            registrationToken: "regToken",
            courselist: [],
            blockedUsers: [],
        })

        await userCollection.insertOne({
            displayName: "sample DN blocked",
            userID: blockedUserAdd,
            coopStatus: "Yes",
            yearStanding: "1",
            registrationToken: "regToken",
            courselist: [],
            blockedUsers: [],
        })

        await request(app).post("/block")
            .send({
                blockedUserAdd,
                userID,
                jwt
            })
            .expect(200)

        // delete user
        await userCollection.deleteOne({ "userID": userID })
        await userCollection.deleteOne({ "userID": blockedUserAdd })
    })

    it("tests unblock with invalid user id", async () => {
        let userIDtoDelete = "userIDtoDelete"
        let userID = "invalidUserID"
        let jwt = "validJWT"

        await request(app).delete("/unblock/" + userID + "/" + userIDtoDelete + "/" + jwt).expect(400)
    })

    it("tests unblock with invalid userIDtoDelete", async () => {
        let userIDtoDelete = "userIDtoDeleteDNE"
        let userID = "validUserID"
        let jwt = "validJWT"

        await request(app).delete("/unblock/" + userID + "/" + userIDtoDelete + "/" + jwt).expect(400)
    })


     it("tests unblock with previously not blocked user", async () => {
        let userIDtoDelete = "userIDtoDelete"
        let userID = "validUserID"
        let jwt = "validJWT"

         // delete user if it exists 
         await userCollection.deleteOne({ "userID": userID })

         // add new user
         await userCollection.insertOne({
             displayName: "sample DN",
             userID,
             coopStatus: "Yes",
             yearStanding: "1",
             registrationToken: "regToken",
             courselist: [],
             blockedUsers: [],
         })

         //add new blocked user
         await userCollection.insertOne({
            displayName: "sample DN 2",
            userID: userIDtoDelete,
            coopStatus: "Yes",
            yearStanding: "1",
            registrationToken: "regToken",
            courselist: [],
            blockedUsers: [],
        })
 
        await request(app).delete("/unblock/" + userID + "/" + userIDtoDelete + "/" + jwt).expect(400)
 
         // delete user
         await userCollection.deleteOne({ "userID": userID })
         await userCollection.deleteOne({ "userID": userIDtoDelete })
        
    })

    it("tests unblock with  null jwt", async () => {
        let userIDtoDelete = "userIDtoDelete"
        let userID = "validUserID"
        let jwt = null

        await request(app).delete("/unblock/" + userID + "/" + userIDtoDelete + "/" + jwt).expect(400)
    })

    it("tests unblock with  empty jwt", async () => {
        let userIDtoDelete = "userIDtoDelete"
        let userID = "validUserID"
        let jwt = ""

        await request(app).delete("/unblock/" + userID + "/" + userIDtoDelete + "/" + jwt).expect(404)
    })

    it("tests unblock with invalid jwt", async () => {
        let userIDtoDelete = "userIDtoDelete"
        let userID = "validUserID"
        let jwt = "invalidJWT"

        await request(app).delete("/unblock/" + userID + "/" + userIDtoDelete + "/" + jwt).expect(400)
    })

     it("tests unblock with valid userIDtoDelete being blocked before", async () => {
        let userIDtoDelete = "userIDtoDelete"
        let userID = "validUserID"
        let jwt = "validJWT"

        // delete user if it exists 
        await userCollection.deleteOne({ "userID": userID })

        // add new user
        await userCollection.insertOne({
            displayName: "sample DN",
            userID,
            coopStatus: "Yes",
            yearStanding: "1",
            registrationToken: "regToken",
            courselist: [],
            blockedUsers: [userIDtoDelete],
        })

        await userCollection.insertOne({
            displayName: "sample DN blocked",
            userID: userIDtoDelete,
            coopStatus: "Yes",
            yearStanding: "1",
            registrationToken: "regToken",
            courselist: [],
            blockedUsers: [],
        })

        await request(app).delete("/unblock/" + userID + "/" + userIDtoDelete + "/" + jwt).expect(200)



        // delete user
        await userCollection.deleteOne({ "userID": userID })
        await userCollection.deleteOne({ "userID": userIDtoDelete })
    })

})