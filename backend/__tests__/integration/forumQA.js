const app = require("../../app")
const request = require("supertest")
var mongoose = require('mongoose')

const Question = require('../../models/Question.js')
const Answer = require('../../models/Answer.js')

// const notificationManager = require("../../controllers/notifcationManager")
// const userStore = require('../../controllers/userStore')
// const courseManager = require('../../controllers/courseManager')
// const chatEngine = require('../../controllers/chatEngine')
const forumEngine = require('../../controllers/forumEngine')
jest.mock("../../utils/authUtils")

beforeEach(() => {
    jest.setTimeout(30000)
})

beforeAll(async () => {
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

describe("forum tests", () => {
    //question use case
    it("tests getAllQuestions with invalid access token", async () => {
        let jwt = "invalidJWT"
        let userID = "validUserID"

        await request(app).get("/getAllQuestions/" + userID + "/" + jwt)
            .expect(404)

        jest.setTimeout(30000)
    })

    it("tests getAllQuestions with valid access token", async () => {
        let jwt = "validJWT"
        let userID = "validUserID"

        await request(app).get("/getAllQuestions/" + userID + "/" + jwt)
            .expect(200)
    })

    it("tests getAllQuestionsForATopic with invalid access token", async () => {
        let jwt = "invalidJWT"
        let userID = "validUserID"
        let topic = "all"

        await request(app).get("/getAllQuestionsForATopic/" + topic + "/" + userID + "/" + jwt)
            .expect(404)
    })

    it("tests getAllQuestionsForATopic with valid access token and null topic", async () => {
        let jwt = "validJWT"
        let userID = "validUserID"
        let topic = "%00"

        await request(app).get("/getAllQuestionsForATopic/" + topic + "/" + userID + "/" + jwt)
            .expect(200)
    })

    it("tests getAllQuestionsForATopic with valid access token and a non existent topic", async () => {
        let jwt = "validJWT"
        let userID = "validUserID"
        let topic = "blablabla"

        await request(app).get("/getAllQuestionsForATopic/" + topic + "/" + userID + "/" + jwt)
            .expect(200)
    })

    it("tests getAllQuestionsForATopic with valid access token and valid topic", async () => {
        let jwt = "validJWT"
        let userID = "validUserID"
        let topic = "all"

        await request(app).get("/getAllQuestionsForATopic/" + topic + "/" + userID + "/" + jwt)
            .expect(200)
    })

    it("tests getAllQuestionsFromAUser with invalid access token", async () => {
        let jwt = "invalidJWT"
        let userID = "validUserID"

        await request(app).get("/getAllQuestionsFromAUser/" + userID + "/" + jwt)
            .expect(404)
    })

    it("tests getAllQuestionsFromAUser with invalid user ID", async () => {
        let jwt = "validJWT"
        let userID = "invalidUserID"

        await request(app).get("/getAllQuestionsFromAUser/" + userID + "/" + jwt)
        .expect(404)
    })

    it("tests getAllQuestionsFromAUser with non existent user ID", async () => {
        let jwt = "validJWT"
        let userID = "noUserID"

        await request(app).get("/getAllQuestionsFromAUser/" + userID + "/" + jwt)
        .expect(404)
    })

    it("tests getAllQuestionsFromAUser with valid user ID", async () => {
        let jwt = "validJWT"
        let userID = "validUserID"

        await request(app).get("/getAllQuestionsFromAUser/" + userID + "/" + jwt)
        .expect(200)
    })

    it("tests postQuestion with null parameters", async () => {
        let topic = null
        let askerID = null
        let askerName = null
        let questionContent = null
        let isAskedAnonymously = null
        let jwt = null

        await request(app).post("/postQuestion")
            .send({
                topic,
                askerID,
                askerName,
                questionContent,
                isAskedAnonymously,
                jwt
            })
            .expect(400)

    })

    it("tests postQuestion with empty parameters", async () => {
        let topic = ""
        let askerID = ""
        let askerName = ""
        let questionContent = ""
        let isAskedAnonymously = ""
        let jwt = ""

        await request(app).post("/postQuestion")
            .send({
                topic,
                askerID,
                askerName,
                questionContent,
                isAskedAnonymously,
                jwt
            })
            .expect(400)

    })

    it("tests postQuestion with invalid parameters", async () => {
        let topic = "all"
        let askerID = "noUserID"
        let askerName = "aa"
        let questionContent = "aa"
        let isAskedAnonymously = false
        let jwt = "validJWT"

        await request(app).post("/postQuestion")
            .send({
                topic,
                askerID,
                askerName,
                questionContent,
                isAskedAnonymously,
                jwt
            })
            .expect(404)

    })

    it("tests postQuestion with invalid access token", async () => {
        let topic = "all"
        let askerID = "validUserID"
        let askerName = "aa"
        let questionContent = "aa"
        let isAskedAnonymously = false
        let jwt = "invalidJWT"

        await request(app).post("/postQuestion")
            .send({
                topic,
                askerID,
                askerName,
                questionContent,
                isAskedAnonymously,
                jwt
            })
            .expect(404)

    })

    it("tests postQuestion with valid parameters", async () => {
        let topic = "all"
        let askerID = "validUserID"
        let askerName = "aa"
        let questionContent = "aa"
        let isAskedAnonymously = false
        let jwt = "validJWT"

        await request(app).post("/postQuestion")
            .send({
                topic,
                askerID,
                askerName,
                questionContent,
                isAskedAnonymously,
                jwt
            })
            .expect(200)

        

        Question.findOneAndDelete({questionContent: questionContent}, function(err, resultAfterUpdate) {
            if (err) {
                console.log("err(delete): " + err)
            } else {
                console.log("resultAfterUpdate: " + resultAfterUpdate)
            }
        })

    })

    
    it("tests editQuestion with null parameters", async () => {
        let questionID = null
        let askerID = null
        let askerName = null
        let questionContent = null
        let jwt = null

        await request(app).put("/editQuestion")
            .send({
                questionID,
                askerID,
                askerName,
                questionContent,
                jwt
            })
            .expect(400)

    })

    it("tests editQuestion with empty parameters", async () => {
        let questionID = ""
        let askerID = ""
        let askerName = ""
        let questionContent = ""
        let jwt = ""

        await request(app).put("/editQuestion")
            .send({
                questionID,
                askerID,
                askerName,
                questionContent,
                jwt
            })
            .expect(400)

    })

    it("tests editQuestion with valid parameter(s)", async () => {
        let askerID = "validUserID"
        let askerName = "askerName1"
        let questionContent = "qContentval"
        let jwt = "validJWT"
        let questionID = "something qId"


        await forumEngine.saveQuestionToDB("some topic", askerID, askerName, "before update valid", true)

        await request(app).put("/editQuestion")
            .send({
                questionID,
                askerID,
                askerName,
                questionContent,
                jwt
            })
            .expect(200)

        await Question.deleteMany({ askerName });
    })

    it("tests editQuestion with parameters not in db", async () => {
        let askerID = "validUserID"
        let askerName = "askerName1"
        let questionContent = "qContentval"
        let jwt = "validJWT"
        let questionID = "something qId"


        await forumEngine.saveQuestionToDB("some topic", askerID, askerName, "before update valid", true)

        await request(app).put("/editQuestion")
            .send({
                questionID,
                askerID,
                askerName,
                questionContent,
                jwt
            })
            .expect(200)

        await Question.deleteMany({ askerName });
    })

    it("tests editQuestion with invalid token", async () => {
        let askerID = "validUserID"
        let askerName = "askerName1"
        let questionContent = "qContentval"
        let jwt = "invalidJWT"
        let questionID = "something qId"


        await forumEngine.saveQuestionToDB("some topic", askerID, askerName, "before update valid", true)

        await request(app).put("/editQuestion")
            .send({
                questionID,
                askerID,
                askerName,
                questionContent,
                jwt
            })
            .expect(404)

        await Question.deleteMany({ askerName });
    })

    //answer use case

    it("tests getAllAnswersForAQuestion with invalid access token and valid topic", async () => {
        let jwt = "invalidJWT"
        let userID = "validUserID"
        let questionID = "qID"

        await request(app).get("/getAllAnswersForAQuestion/" + questionID + "/" + userID + "/" + jwt)
            .expect(404)
    })

    it("tests getAllAnswersForAQuestion with valid access token and valid questionID", async () => {
        let jwt = "validJWT"
        let userID = "validUserID"
        let questionID = "questID"

        await request(app).get("/getAllAnswersForAQuestion/" + questionID + "/" + userID + "/" + jwt)
            .expect(200)
    })

      it("tests postAnswer with null parameters", async () => {
        let questionID = null
        let topic = null
        let answererID = null
        let answererName = null
        let answerContent = null
        let isAnsweredAnonymously = null
        let jwt = null


        await request(app).post("/postAnswer")
            .send({
                questionID,
                topic,
                answererID,
                answererName,
                answerContent,
                isAnsweredAnonymously,
                jwt
            })
            .expect(400)

    })

    it("tests postAnswer with empty parameters", async () => {
        let questionID = ""
        let topic = ""
        let answererID = ""
        let answererName = ""
        let answerContent = ""
        let isAnsweredAnonymously = ""
        let jwt = ""

        await request(app).post("/postAnswer")
            .send({
                questionID,
                topic,
                answererID,
                answererName,
                answerContent,
                isAnsweredAnonymously,
                jwt
            })
            .expect(400)

    })

    it("tests postAnswer with invalid parameters", async () => {
        let questionID = "nofwfhow"
        let topic = "all"
        let answererID = "noUserID"
        let answererName = "ansNameInv"
        let answerContent = "ansContInv"
        let isAnsweredAnonymously = true
        let jwt = "jwt1"

        await request(app).post("/postAnswer")
            .send({
                questionID,
                topic,
                answererID,
                answererName,
                answerContent,
                isAnsweredAnonymously,
                jwt
            })
            .expect(404)

    })

    it("tests postAnswer with invalid access token", async () => {
        let questionID = "nofwfhow"
        let topic = "all"
        let answererID = "noUserID"
        let answererName = "ansNameInv"
        let answerContent = "ansContInv"
        let isAnsweredAnonymously = true
        let jwt = "invalidJWT"

        await request(app).post("/postAnswer")
            .send({
                questionID,
                topic,
                answererID,
                answererName,
                answerContent,
                isAnsweredAnonymously,
                jwt
            })
            .expect(404)
    })

    it("tests postAnswer with valid parameters", async () => {
        let questionID = "nofwfhow"
        let topic = "all"
        let answererID = "validUserID"
        let answererName = "ansNameInv"
        let answerContent = "ansContInv"
        let isAnsweredAnonymously = true
        let jwt = "validJWT"

        await request(app).post("/postAnswer")
            .send({
                questionID,
                topic,
                answererID,
                answererName,
                answerContent,
                isAnsweredAnonymously,
                jwt
            })
            .expect(200)

    })

    it("tests editAnswer with null parameters", async () => {
        let answerID = null
        let answererID = null
        let answererName = null
        let answerContent = null
        let jwt = null

        await request(app).put("/editAnswer")
            .send({
                answerID,
                answererID,
                answererName,
                answerContent,
                jwt
            })
            .expect(400)

    })

    it("tests editAnswer with empty parameters", async () => {
        let answerID = null
        let answererID = null
        let answererName = null
        let answerContent = null
        let jwt = null

        await request(app).put("/editAnswer")
            .send({
                answerID,
                answererID,
                answererName,
                answerContent,
                jwt
            })
            .expect(400)

    })

    it("tests editAnswer with invalid userID", async () => {
        let answerID = "nwhjfwi"
        let answererID = "invalidUserID"
        let answererName = "heifhwi"
        let answerContent = "ansCOntjfoiwe"
        let jwt = "validJWT"

        await request(app).put("/editAnswer")
            .send({
                answerID,
                answererID,
                answererName,
                answerContent,
                jwt
            })
            .expect(404)

    })

    it("tests editAnswer with invalid token", async () => {
        let answerID = "nwhjfwi"
        let answererID = "validUserID"
        let answererName = "heifhwi"
        let answerContent = "ansCOntjfoiwe"
        let jwt = "invalidJWT"

        await request(app).put("/editAnswer")
            .send({
                answerID,
                answererID,
                answererName,
                answerContent,
                jwt
            })
            .expect(404)

    })

    it("tests editAnswer with answer not in db", async () => {
        let answerID = "nwhjfwi"
        let answererID = "validUserID"
        let answererName = "heifhwi"
        let answerContent = "ansCOntjfoiwe"
        let jwt = "validJWT"

        await request(app).put("/editAnswer")
            .send({
                answerID,
                answererID,
                answererName,
                answerContent,
                jwt
            })
            .expect(200)

    })

    it("tests editAnswer with answer in db (all valid parameters)", async () => {
        let answerID = "njkfqhlkwehjoqwjfwo"
        let answererID = "validUserID"
        let answererName = "heifhwi"
        let answerContent = "ansCOntjfoiwe"
        let jwt = "validJWT"

        await request(app).put("/editAnswer")
            .send({
                answerID,
                answererID,
                answererName,
                answerContent,
                jwt
            })
            .expect(200)

    })
    





})

