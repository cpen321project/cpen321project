/*  Module under test: Courses
    Submodules: 
        - courseManager
    Submodules that courseManager depends on:
        - notificationManager
        - authUtils
*/

const app = require("../app")
const request = require("supertest")
var mongoose = require('mongoose')

const courseManager = require("../controllers/courseManager")
jest.mock("../controllers/notifcationManager")
jest.mock("../utils/authUtils")

beforeAll(async () => {
    dbUser = await client.db("user")
    dbCourse = await client.db("course")
    userCollection = await dbUser.collection("userCollection")
})

beforeEach(() => {
    jest.setTimeout(10000)
})

afterAll(async () => {
    await mongoose.disconnect()

    if (client) {
        await client.close()
    }
})

describe("courseManager tests", () => {

    it("tests server connection", () => {
        return request(app)
            .get("/")
            .expect(200)
    })

    // getStudentList tests
    it("tests getStudentList with invalid coursename", async () => {
        console.log("1")
        let coursename = "998!!!oo"
        let userID = "validUserID"
        let jwt = "validJWT"
        await request(app).get("/getstudentlist/" + coursename + "/" + jwt + "/" + userID)
            .expect(400)
            .then(res => {
                expect(res.body).toEqual("Invalid coursename")
            })
    })

    it("tests getStudentList with course name with space", async () => {
        console.log("2")
        let coursename = "TIBT 300"
        let userID = "validUserID"
        let jwt = "validJWT"

        // first add the course to the courseDB
        try {
            await dbCourse.createCollection(coursename)
        } catch (err) {
            // course is already in db, no need to add
        }

        await request(app).get("/getstudentlist/" + coursename + "/" + jwt + "/" + userID)
            .expect(400)
            .then(res => {
                expect(res.body).toEqual("Invalid coursename")
            })

        // remove this collection once we're done 
        try {
            await dbCourse.collection(coursename).drop()
        } catch (err) {
            // collection DNE, don't drop
        }
    })

    it("tests getStudentList with empty course name", async () => {
        console.log("3")
        let coursename = ""
        let userID = "validUserID"
        let jwt = "validJWT"
        await request(app).get("/getstudentlist/" + coursename + "/" + jwt + "/" + userID)
            .expect(404)
    })

    it("tests getStudentList with null userID", async () => {
        console.log("4")
        let coursename = "CPEN321"
        let userID = null
        let jwt = "validJWT"
        await request(app).get("/getstudentlist/" + coursename + "/" + jwt + "/" + userID)
            .expect(400)
            .then(res => {
                expect(res.body.err).toEqual("Token not validated")
            })

        jest.setTimeout(30000);
    })

    it("tests getStudentList with empty userID", async () => {
        console.log("5")
        let coursename = "CPEN321"
        let userID = ""
        let jwt = "validJWT"
        await request(app).get("/getstudentlist/" + coursename + "/" + jwt + "/" + userID)
            .expect(404)
    })

    it("tests getStudentList with invalid userID", async () => {
        console.log("6")
        let coursename = "CPEN321"
        let userID = "invalidUserID"
        let jwt = "validJWT"
        await request(app).get("/getstudentlist/" + coursename + "/" + jwt + "/" + userID)
            .expect(400)
            .then(res => {
                expect(res.body.err).toEqual("Token not validated")
            })

        jest.setTimeout(30000);
    })

    it("tests getStudentList with null jwt", async () => {
        console.log("7")
        let coursename = "CPEN321"
        let userID = "validUserID"
        let jwt = null
        await request(app).get("/getstudentlist/" + coursename + "/" + jwt + "/" + userID)
            .expect(400)
            .then(res => {
                expect(res.body.err).toEqual("Token not validated")
            })

        jest.setTimeout(30000);
    })

    it("tests getStudentList with empty jwt", async () => {
        console.log("8")
        let coursename = "CPEN321"
        let userID = "validUserID"
        let jwt = ""
        await request(app).get("/getstudentlist/" + coursename + "/" + jwt + "/" + userID)
            .expect(404)

        jest.setTimeout(30000);
    })

    it("tests getStudentList with invalid jwt", async () => {
        console.log("9")
        let coursename = "CPEN321"
        let userID = "validUserID"
        let jwt = "invalidJWT"
        await request(app).get("/getstudentlist/" + coursename + "/" + jwt + "/" + userID)
            .expect(400)
            .then(res => {
                expect(res.body.err).toEqual("Token not validated")
            })

        jest.setTimeout(30000);
    })

    it("tests getStudentList with valid params and course with >0 students", async () => {
        console.log("10")
        let coursename = "TIBT300"
        let userID = "validUserID"
        let jwt = "validJWT"

        // first add the course to the courseDB
        try {
            await dbCourse.createCollection(coursename)
        } catch (err) {
            // course is already in db, no need to add
        }

        // add this user to the course first (if collection DNE, will create)
        await dbCourse.collection(coursename).insertOne({
            displayName: "testDisplayName",
            userID,
        })

        await request(app).get("/getstudentlist/" + coursename + "/" + jwt + "/" + userID)
            .expect(200)

        // drop when done
        try {
            await dbCourse.collection(coursename).drop()
        } catch (err) {
            // collection DNE, don't drop
        }
    })

    it("tests getStudentList with valid params and no students", async () => {
        console.log("10")
        let coursename = "TIBT300"
        let userID = "validUserID"
        let jwt = "validJWT"

        // first add the course to the courseDB
        try {
            await dbCourse.createCollection(coursename)
        } catch (err) {
            // course is already in db, no need to add
        }

        await request(app).get("/getstudentlist/" + coursename + "/" + jwt + "/" + userID)
            .expect(200)

        // drop when done
        try {
            await dbCourse.collection(coursename).drop()
        } catch (err) {
            // collection DNE, don't drop
        }

        jest.setTimeout(30000);
    })

    // addUserToCourse tests
    it("tests addUserToCourse with empty course name", async () => {
        console.log("11")
        let coursename = ""
        let userID = "validUserID"
        let displayName = "someDisplayName"
        let jwt = "validJWT"
        await request(app).post("/addusertocourse")
            .send({
                coursename,
                userID,
                displayName,
                jwt
            })
            .expect(404)

        jest.setTimeout(30000);
    })

    it("tests addUserToCourse with userID already in course", async () => {
        console.log("12")
        let coursename = "TIBT 300"
        let userID = "validUserID"
        let displayName = "someDisplayName"
        let jwt = "validJWT"
        console.log("here")

        // add this user to the course first (if collection DNE, will create)
        await dbCourse.collection(coursename).insertOne({
            displayName,
            userID,
        })

        await request(app).post("/addusertocourse")
            .send({
                coursename,
                userID,
                displayName,
                jwt
            })
            .expect(400)
            .then(res => {
                expect(res.body).toEqual("User already in course. Not added")
            })

        // delete this user after we're done
        dbCourse.collection(coursename).deleteOne({ userID })

        // drop the collection
        try {
            await dbCourse.collection(coursename).drop()
        } catch (err) {
            // collection DNE, don't drop
        }

        jest.setTimeout(30000);
    })

    it("tests addUserToCourse with valid course not added before", async () => {
        console.log("13")
        let coursename = "TIBT 100"
        let userID = "validUserID"
        let displayName = "someDisplayName"
        let jwt = "validJWT"

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

    it("tests addUserToCourse with invalid userID or coursename", async () => {
        let coursename = "aaaa"; let userID = "aaaaaa";
        let displayName = "someDisplayName"; let jwt = "validJWT"

        await request(app).post("/addusertocourse")
            .send({ coursename, userID, displayName, jwt })
            .expect(400)
    })

    it("tests addUserToCourse with non existing userID", async () => {
        let coursename = "TIBT 100"
        let userID = "b"
        let displayName = "someDisplayName"
        let jwt = "validJWT"

        await request(app).post("/addusertocourse")
            .send({
                coursename,
                userID,
                displayName,
                jwt
            })
            .expect(400)

        // drop this collection if it exists
        try {
            await dbCourse.collection(coursename).drop()
        } catch (err) {
            // collection DNE, don't drop
        }
    })

    it("tests addUserToCourse with course name no space", async () => {
        let coursename = "TIBT100"
        let userID = "b"
        let displayName = "someDisplayName"
        let jwt = "validJWT"

        // first add the proper course to the courseDB
        try {
            await dbCourse.createCollection(coursename)
        } catch (err) {
            // course is already in db, no need to add
        }

        await request(app).post("/addusertocourse")
            .send({
                coursename,
                userID,
                displayName,
                jwt
            })
            .expect(400)

        // remove this collection once we're done 
        try {
            await dbCourse.collection(coursename).drop()
        } catch (err) {
            // collection DNE, don't drop
        }
    })

    it("tests addUserToCourse with null jwt", async () => {
        let coursename = "TIBT 100"
        let userID = "validUserID"
        let displayName = "someDisplayName"
        let jwt = null

        await request(app).post("/addusertocourse")
            .send({
                coursename,
                userID,
                displayName,
                jwt
            })
            .expect(404)
    })

    it("tests addUserToCourse with empty jwt", async () => {
        let coursename = "TIBT 100"
        let userID = "validUserID"
        let displayName = "someDisplayName"
        let jwt = ""

        await request(app).post("/addusertocourse")
            .send({
                coursename,
                userID,
                displayName,
                jwt
            })
            .expect(404)
    })

    it("tests addUserToCourse with invalid jwt", async () => {
        let coursename = "TIBT 100"
        let userID = "validUserID"
        let displayName = "someDisplayName"
        let jwt = "invalidJWT"

        await request(app).post("/addusertocourse")
            .send({
                coursename,
                userID,
                displayName,
                jwt
            })
            .expect(400)
    })

    // addCourseToUser tests
    it("tests addCourseToUser with null jwt", async () => {
        let coursename = "TIBT 100"
        let userID = "validUserID"
        let jwt = null

        await request(app).post("/addcoursetouser")
            .send({
                coursename,
                userID,
                jwt
            })
            .expect(404)
    })

    it("tests addCourseToUser with empty jwt", async () => {
        let coursename = "TIBT 100"
        let userID = "validUserID"
        let jwt = ""

        await request(app).post("/addcoursetouser")
            .send({
                coursename,
                userID,
                jwt
            })
            .expect(404)
    })

    it("tests addCourseToUser with invalid jwt", async () => {
        let coursename = "TIBT 100"
        let userID = "validUserID"
        let jwt = "invalidJWT"

        await request(app).post("/addcoursetouser")
            .send({
                coursename,
                userID,
                jwt
            })
            .expect(400)
    })

    it("tests addCourseToUser with empty course name", async () => {
        let coursename = ""
        let userID = "validUserID"
        let jwt = "validJWT"

        await request(app).post("/addcoursetouser")
            .send({
                coursename,
                userID,
                jwt
            })
            .expect(404)
    })

    it("tests addCourseToUser with already added course", async () => {
        let coursename = "TIBT 100"
        let userID = "validUserID"
        let jwt = "validJWT"

        // delete user if it exists 
        await userCollection.deleteOne({ userID })

        // add new user
        await userCollection.insertOne({
            displayName: "someDisplayName",
            userID,
            coopStatus: "Yes",
            yearStanding: "1",
            registrationToken: "regToken",
            courselist: [],
            blockedUsers: [],
        })

        // add the course to the user
        await userCollection.updateOne(
            { userID },
            { $push: { "courselist": coursename } }
        )

        await request(app).post("/addcoursetouser")
            .send({
                coursename,
                userID,
                jwt
            })
            .expect(400)
            .then(res => {
                expect(res.body).toEqual("Already added")
            })

        // delete user
        await userCollection.deleteOne({ userID })

    })

    it("tests addCourseToUser with course not added before", async () => {
        let coursename = "TIBT 100"
        let userID = "validUserID"
        let jwt = "validJWT"

        // delete user if it exists 
        await userCollection.deleteOne({ userID })

        // add new user
        await userCollection.insertOne({
            displayName: "someDisplayName",
            userID,
            coopStatus: "Yes",
            yearStanding: "1",
            registrationToken: "regToken",
            courselist: [],
            blockedUsers: [],
        })

        await request(app).post("/addcoursetouser")
            .send({
                coursename,
                userID,
                jwt
            })
            .expect(200)

        // delete user
        await userCollection.deleteOne({ userID })
    })

    it("tests addCourseToUser with invalid coursename", async () => {
        let coursename = "-32f(1 .-="
        let userID = "validUserID"
        let jwt = "validJWT"

        // delete user if it exists 
        await userCollection.deleteOne({ userID })

        // add new user
        await userCollection.insertOne({
            displayName: "someDisplayName",
            userID,
            coopStatus: "Yes",
            yearStanding: "1",
            registrationToken: "regToken",
            courselist: [],
            blockedUsers: [],
        })

        await request(app).post("/addcoursetouser")
            .send({
                coursename,
                userID,
                jwt
            })
            .expect(400)
            .then(res => {
                expect(res.body).toEqual("Invalid coursename")
            })

        // delete user
        await userCollection.deleteOne({ userID })
    })

    it("tests addCourseToUser with coursename with no space", async () => {
        let coursename = "CPEN321"
        let userID = "validUserID"
        let jwt = "validJWT"

        // delete user if it exists 
        await userCollection.deleteOne({ userID })

        // add new user
        await userCollection.insertOne({
            displayName: "someDisplayName",
            userID,
            coopStatus: "Yes",
            yearStanding: "1",
            registrationToken: "regToken",
            courselist: [],
            blockedUsers: [],
        })

        await request(app).post("/addcoursetouser")
            .send({
                coursename,
                userID,
                jwt
            })
            .expect(400)
            .then(res => {
                expect(res.body).toEqual("Invalid coursename")
            })

        // delete user
        await userCollection.deleteOne({ userID })
    })

    // // deleteUserFromCourse tests
    it("tests deleteUserFromCourse with null jwt", async () => {
        let coursename = "CPEN 321"
        let userID = "validUserID"
        let jwt = null

        await request(app).delete("/deleteuserfromcourse/" + userID + "/" + coursename + "/" + jwt)
            .expect(400)
            .then(res => {
                expect(res.body).toEqual("Token not validated")
            })
    })

    it("tests deleteUserFromCourse with empty jwt", async () => {
        let coursename = "CPEN 321"
        let userID = "validUserID"
        let jwt = ""

        await request(app).delete("/deleteuserfromcourse/" + userID + "/" + coursename + "/" + jwt)
            .expect(404)
    })

    it("tests deleteUserFromCourse with invalid jwt", async () => {
        let coursename = "CPEN 321"
        let userID = "validUserID"
        let jwt = "invalidJWT"

        await request(app).delete("/deleteuserfromcourse/" + userID + "/" + coursename + "/" + jwt)
            .expect(400)
            .then(res => {
                expect(res.body).toEqual("Token not validated")
            })
    })

    it("tests deleteUserFromCourse with empty course name", async () => {
        let coursename = ""
        let userID = "validUserID"
        let jwt = "validJWT"

        await request(app).delete("/deleteuserfromcourse/" + userID + "/" + coursename + "/" + jwt)
            .expect(404)
    })

    it("tests deleteUserFromCourse with invalid course name", async () => {
        let coursename = "--- 898"
        let userID = "validUserID"
        let jwt = "validJWT"

        await request(app).delete("/deleteuserfromcourse/" + userID + "/" + coursename + "/" + jwt)
            .expect(400)
            .then(res => {
                expect(res.body).toEqual("Invalid coursename")
            })
    })

    it("tests deleteUserFromCourse with course name with space", async () => {
        let coursename = "CPEN 321"
        let userID = "validUserID"
        let jwt = "validJWT"

        await request(app).delete("/deleteuserfromcourse/" + userID + "/" + coursename + "/" + jwt)
            .expect(400)
            .then(res => {
                expect(res.body).toEqual("Invalid coursename")
            })
    })

    it("tests deleteUserFromCourse with course user is not registered in", async () => {
        let coursename = "TIBT100"
        let userID = "validUserID"
        let jwt = "validJWT"

        // delete user if it exists 
        await userCollection.deleteOne({ userID })

        // add new user
        await userCollection.insertOne({
            displayName: "someDisplayName",
            userID,
            coopStatus: "Yes",
            yearStanding: "1",
            registrationToken: "regToken",
            courselist: [],
            blockedUsers: [],
        })

        await request(app).delete("/deleteuserfromcourse/" + userID + "/" + coursename + "/" + jwt)
            .expect(400)
            .then(res => {
                expect(res.body).toEqual("User has not added course before. Not deleted")
            })

        // delete user
        await userCollection.deleteOne({ userID })
    })

    it("tests deleteUserFromCourse with course they're registered in ", async () => {
        let coursename = "TIBT400"
        let userID = "validUserID"
        let jwt = "validJWT"

        console.log("here")
        // add this user to the course first (if collection DNE, will create)
        await dbCourse.collection("TIBT 400").insertOne({
            displayName: "someDisplayName",
            userID,
        })

        await request(app).delete("/deleteuserfromcourse/" + userID + "/" + coursename + "/" + jwt)
            .expect(200)
            .then(res => {
                expect(res.body).toEqual("User deleted successfully")
            })

        // remove this collection once we're done 
        try {
            await dbCourse.collection("TIBT 400").drop()
        } catch (err) {
            // collection DNE, don't drop
        }
    })

    // deleteCourseFromUser tests
    it("tests deleteCourseFromUser with null jwt", async () => {
        let coursename = "CPEN 321"
        let userID = "validUserID"
        let jwt = null

        await request(app).post("/deletecoursefromuser")
            .send({
                coursename,
                userID,
                jwt
            })
            .expect(404)
            .then(res => {
                expect(res.body).toEqual("Invalid parameters")
            })
    })

    it("tests deleteCourseFromUser with empty jwt", async () => {
        let coursename = "CPEN 321"
        let userID = "validUserID"
        let jwt = ""

        await request(app).post("/deletecoursefromuser")
            .send({
                coursename,
                userID,
                jwt
            })
            .expect(404)
    })

    it("tests deleteCourseFromUser with invalid jwt", async () => {
        let coursename = "CPEN 321"
        let userID = "validUserID"
        let jwt = "invalidJWT"

        await request(app).post("/deletecoursefromuser")
            .send({
                coursename,
                userID,
                jwt
            })
            .expect(400)
            .then(res => {
                expect(res.body).toEqual("Token not validated")
            })
    })

    it("tests deleteCourseFromUser with empty course name", async () => {
        let coursename = ""
        let userID = "validUserID"
        let jwt = "validJWT"

        await request(app).post("/deletecoursefromuser")
            .send({
                coursename,
                userID,
                jwt
            })
            .expect(404)
    })

    it("tests deleteCourseFromUser with invalid course name", async () => {
        let coursename = "783428#!ssf dfd)"
        let userID = "validUserID"
        let jwt = "validJWT"

        await request(app).post("/deletecoursefromuser")
            .send({
                coursename,
                userID,
                jwt
            })
            .expect(400)
            .then(res => {
                expect(res.body).toEqual("Invalid coursename")
            })
    })

    it("tests deleteCourseFromUser with course name without space", async () => {
        let coursename = "CPEN321"
        let userID = "validUserID"
        let jwt = "validJWT"

        await request(app).post("/deletecoursefromuser")
            .send({
                coursename,
                userID,
                jwt
            })
            .expect(400)
            .then(res => {
                expect(res.body).toEqual("Invalid coursename")
            })
    })

    it("tests deleteCourseFromUser with course user is not registered in", async () => {
        let coursename = "TIBT 100"
        let userID = "validUserID"
        let jwt = "validJWT"

        // delete user if it exists 
        await userCollection.deleteOne({ userID })

        // add new user
        await userCollection.insertOne({
            displayName: "someDisplayName",
            userID,
            coopStatus: "Yes",
            yearStanding: "1",
            registrationToken: "regToken",
            courselist: [],
            blockedUsers: [],
        })

        await request(app).post("/deletecoursefromuser")
            .send({
                coursename,
                userID,
                jwt
            })
            .expect(400)
            .then(res => {
                expect(res.body).toEqual("Course not added before. Not deleted")
            })

        // delete user
        await userCollection.deleteOne({ userID })
    })

    it("tests deleteCourseFromUser with course they're registered in ", async () => {
        let coursename = "TIBT 100"
        let userID = "validUserID"
        let jwt = "validJWT"

        // delete user if it exists 
        await userCollection.deleteOne({ userID })

        // add new user with the course in their courselist
        await userCollection.insertOne({
            displayName: "someDisplayName",
            userID,
            coopStatus: "Yes",
            yearStanding: "1",
            registrationToken: "regToken",
            courselist: ["TIBT 100"],
            blockedUsers: [],
        })

        await request(app).post("/deletecoursefromuser")
            .send({
                coursename,
                userID,
                jwt
            })
            .expect(200)
            .then(res => {
                expect(res.body).toEqual({ "result": "Course deleted successfully" })
            })

        await userCollection.deleteOne({ userID })
    })

    // editDisplayNameInCourse tests
    it("tests editDisplayNameInCourse with null displayNameNew", async () => {
        let displayNameNew = null
        let userID = "validUserID"
        let coursename = "TIBT 100"

        const result = await courseManager.editDisplayNameInCourse(displayNameNew, userID, coursename)
        expect(result).toBe(false)
    })

    it("tests editDisplayNameInCourse with empty displayNameNew", async () => {
        let displayNameNew = ""
        let userID = "validUserID"
        let coursename = "TIBT 100"

        const result = await courseManager.editDisplayNameInCourse(displayNameNew, userID, coursename)
        expect(result).toBe(false)
    })

    it("tests editDisplayNameInCourse with null userID", async () => {
        let displayNameNew = "newDisplayName"
        let userID = null
        let coursename = "TIBT 100"

        const result = await courseManager.editDisplayNameInCourse(displayNameNew, userID, coursename)
        expect(result).toBe(false)
    })

    it("tests editDisplayNameInCourse with empty userID", async () => {
        let displayNameNew = "newDisplayName"
        let userID = ""
        let coursename = "TIBT 100"

        const result = await courseManager.editDisplayNameInCourse(displayNameNew, userID, coursename)
        expect(result).toBe(false)
    })

    it("tests editDisplayNameInCourse with userID not in course", async () => {
        let displayNameNew = "newDisplayName"
        let userID = "validUserID"
        let coursename = "TIBT 301"

        // first add the course to the courseDB
        try {
            await dbCourse.createCollection(coursename)
        } catch (err) {
            // course is already in db, no need to add
        }

        const result = await courseManager.editDisplayNameInCourse(displayNameNew, userID, coursename)
        expect(result).toBe(false)

        // remove this collection once we're done 
        try {
            await dbCourse.collection(coursename).drop()
        } catch (err) {
            // collection DNE, don't drop
        }
    })

    it("tests editDisplayNameInCourse with null coursename", async () => {
        let displayNameNew = "newDisplayName"
        let userID = "validUserID"
        let coursename = null

        const result = await courseManager.editDisplayNameInCourse(displayNameNew, userID, coursename)
        expect(result).toBe(false)
    })

    it("tests editDisplayNameInCourse with empty coursename", async () => {
        let displayNameNew = "newDisplayName"
        let userID = "validUserID"
        let coursename = ""

        const result = await courseManager.editDisplayNameInCourse(displayNameNew, userID, coursename)
        expect(result).toBe(false)
    })

    it("tests editDisplayNameInCourse with valid parameters", async () => {
        let displayNameNew = "newDisplayName"
        let userID = "validUserID"
        let coursename = "TIBT 100"

        // add this user to the course first (if collection DNE, will create)
        await dbCourse.collection(coursename).insertOne({
            displayName: "oldDisplayName",
            userID,
        })

        const result = await courseManager.editDisplayNameInCourse(displayNameNew, userID, coursename)
        expect(result).toBe(true)

        // remove this collection once we're done 
        try {
            await dbCourse.collection(coursename).drop()
        } catch (err) {
            // collection DNE, don't drop
        }
    })
})