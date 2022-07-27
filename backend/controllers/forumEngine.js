const Question = require('../models/Question.js')
const Answer = require('../models/Answer.js')
const authUtils = require('../utils/authUtils.js')

/*
    Interfaces exposed to front end:
        - getAllQuestions(userID, jwt)
        - getAllQuestionsForATopic(topic, userID, jwt)
        - getAllQuestionsFromAUser(userID, jwt)
        - getAllAnswersForAQuestion(questionID, userID, jwt)
*/
module.exports = {
    saveQuestionToDB: (topic, askerID, askerName, questionContent, isAskedAnonymously) => {
        let questionToSaveToDB = Question(
            {
                topic,
                askerID,
                askerName, 
                questionContent, 
                isAskedAnonymously
            }
        )

        questionToSaveToDB.save(function (err) {
            if (err) {
                console.log("saveQuestionToDB: Error saving question to database: " + err)
                throw err
            }
            console.log("saveQuestionToDB: Question saved to database")
        })
    }, 

    saveAnswerToDB: (questionID, topic, answererID, answererName, answerContent, isAnsweredAnonymously) => {
        let answerToSaveToDB = Answer(
            {
                questionID,
                topic,
                answererID,
                answererName, 
                answerContent, 
                isAnsweredAnonymously
            }
        )

        answerToSaveToDB.save((err) => {
            if (err) {
                console.log("saveAnswerToDB: Error saving answer to database: " + err)
                return err
            }
            console.log("saveAnswerToDB: Answer saved to database")
        })
    }, 

    getAllQuestions: async (req, res) => {
        console.log("----------------getAllQuestions----------------")
        let tokenValidated = await authUtils.validateAccessToken(req.params.jwt, req.params.userID)
        if (!tokenValidated) {
            console.log("Token not validated")
            res.status(404)
            return
        }

        Question
            .find()
            .sort({ createdAt: -1 }) 
            .exec((err, retrievedQs) => {
                if (err) {
                    console.log("Error fetching from database: " + err)
                    return res.status(400).send(err)
                } else {
                    console.log("retrievedQs.length: " + retrievedQs.length)
                    console.log("retrievedQs: " + retrievedQs)
                    return res.status(200).send(retrievedQs)
                }
            })  
    }, 

    getAllQuestionsForATopic: async (req, res) => {
        console.log("----------------getAllQuestionsForATopic----------------")
        let tokenValidated = await authUtils.validateAccessToken(req.params.jwt, req.params.userID)
        if (!tokenValidated) {
            console.log("Token not validated")
            res.status(404)
            return
        }

        let topic = req.params.topic

        Question
            .find({ topic })
            .sort({ createdAt: -1 }) // sort by descending (new on top)
            .exec((err, retrievedQs) => {
                if (err) {
                    console.log("Error fetching from database: " + err)
                    return res.status(400).send(err)
                } else {
                    console.log("retrievedQs: " + retrievedQs)
                    return res.status(200).send(retrievedQs)
                }
            })  
    }, 

    getAllQuestionsFromAUser: async (req, res) => {
        console.log("----------------getAllQuestionsFromAUser----------------")
        let tokenValidated = await authUtils.validateAccessToken(req.params.jwt, req.params.userID)
        if (!tokenValidated) {
            console.log("Token not validated")
            res.status(404)
            return
        }

        let userID = req.params.userID
        console.log("Getting all Q's from userID: " + userID)

        Question
            .find({ askerID: userID })
            .sort({ createdAt: -1 }) 
            .exec((err, retrievedQs) => {
                if (err) {
                    console.log("Error fetching from database: " + err)
                    return res.status(400).send(err)
                } else {
                    console.log("retrievedQs: " + retrievedQs)
                    return res.status(200).send(retrievedQs)
                }
            })  
    }, 

    getAllAnswersForAQuestion: async (req, res) => {
        console.log("----------------getAllAnswersForAQuestion----------------")
        let tokenValidated = await authUtils.validateAccessToken(req.params.jwt, req.params.userID)
        if (!tokenValidated) {
            console.log("Token not validated")
            res.status(404)
            return
        }

        let questionID = req.params.questionID
        console.log("questionID: " + questionID)

        Answer
            .find({ questionID })
            .sort({ createdAt: 'asc' }) 
            .exec((err, retrievedAnswers) => {
                if (err) {
                    console.log("Error fetching from database: " + err)
                    return res.status(400).send(err)
                } else {
                    console.log("retrievedAnswers: " + retrievedAnswers)
                    return res.status(200).send(retrievedAnswers)
                }
            })  
    }, 

    postQuestion: async (req, res) => {
        console.log("--------------postQuestion--------------")
        let topic = req.body.topic
        let askerID = req.body.askerID
        let askerName = req.body.askerName
        let questionContent = req.body.questionContent
        let isAskedAnonymously = req.body.isAskedAnonymously
        let jwt = req.body.jwt

        // check for null, undefined, 0, NaN, false, or empty string, and check boolean is boolean
        if (!topic || !askerID || !askerName || !questionContent || typeof isAskedAnonymously !== "boolean" || !jwt ) {
            console.log("Invalid body parameter(s).")
            res.status(400).send({ response: "Invalid body parameter(s)." })
            return;
        }

        let tokenValidated = await authUtils.validateAccessToken(jwt, askerID)
        if (!tokenValidated) {
            console.log("Token not validated")
            res.status(404)
            return
        }

        console.log(askerName + " : " + questionContent)
        console.log("isAskedAnonymously: " + isAskedAnonymously) 

        try {
            module.exports.saveQuestionToDB(topic, askerID, askerName, questionContent, isAskedAnonymously)
            res.status(200).send({ response: "Question posted successfuly" })
            return;
        } catch (err) {
            console.log("err: " + err)
        }
    }, 

    postAnswer: async (req, res) => {
        console.log("--------------postAnswer--------------")
        let questionID = req.body.questionID
        let topic = req.body.topic
        let answererID = req.body.answererID
        let answererName = req.body.answererName
        let answerContent = req.body.answerContent
        let isAnsweredAnonymously = req.body.isAnsweredAnonymously
        let jwt = req.body.jwt

        // check for null, undefined, 0, NaN, false, or empty string, and check boolean is boolean
        if (!questionID || !topic || !answererID || !answererName || !answerContent || typeof isAnsweredAnonymously !== "boolean" || !jwt ) {
            console.log("Invalid body parameter(s).")
            res.status(400).send({ response:"Invalid body parameter(s)." })
            return;
        }

        let tokenValidated = await authUtils.validateAccessToken(jwt, answererID)
        if (!tokenValidated) {
            console.log("Token not validated")
            res.status(404)
            return
        }

        console.log(answererName + " : " + answerContent)
        
        try {
            module.exports.saveAnswerToDB(questionID, topic, answererID, answererName, answerContent, isAnsweredAnonymously)
            res.status(200).send({ response: "Question posted successfuly" })
        } catch (err) {
            res.status(400).send(err)
        }
    }, 

    editQuestion: async (req, res) => {
        console.log("--------------editQuestion--------------")
        let questionID = req.body.questionID
        let askerID = req.body.askerID
        let askerName = req.body.askerName
        let questionContent = req.body.questionContent
        let jwt = req.body.jwt

        // check for null, undefined, 0, NaN, false, or empty string
        if (!questionID || !askerID || !askerName || !questionContent || !jwt ) {
            console.log("Invalid body parameter(s).")
            res.status(400).send({ response: "Invalid body parameter(s)." })
            return;
        }

        let tokenValidated = await authUtils.validateAccessToken(jwt, askerID)
        if (!tokenValidated) {
            console.log("Token not validated")
            res.status(404)
            return
        }

        console.log("questionID: " + questionID) 
        console.log(askerName + " : " + questionContent)

        let filter = { _id: questionID }
        let update = { questionContent }

        Question.findOneAndUpdate(filter, update, function(err, resultAfterUpdate) {
            if (err) {
                console.log("err: " + err)
                res.status(400).send({ response: "Failed to findOneAndUpdate question" })
            } else {
                console.log("resultAfterUpdate: " + resultAfterUpdate)
                res.status(200).send({ response: "Question updated successfully" })
            }
        })
    }, 

    editAnswer: async (req, res) => {
        console.log("--------------editAnswer--------------")
        let answerID = req.body.answerID
        let answererID = req.body.answererID
        let answererName = req.body.answererName
        let answerContent = req.body.answerContent
        let jwt = req.body.jwt

        // check for null, undefined, 0, NaN, false, or empty string
        if (!answerID || !answererID || !answererName || !answerContent || !jwt ) {
            console.log("Invalid body parameter(s).")
            res.status(400).send({ response: "Invalid body parameter(s)." })
            return;
        }

        let tokenValidated = await authUtils.validateAccessToken(jwt, answererID)
        if (!tokenValidated) {
            console.log("Token not validated")
            res.status(404)
            return
        }
        console.log("answerID: " + answerID) 
        console.log(answererName + " : " + answerContent)

        let filter = { _id: answerID }
        let update = { answerContent }

        Answer.findOneAndUpdate(filter, update, function(err, resultAfterUpdate) {
            if (err) {
                console.log("err: " + err)
                res.status(400).send({ response: "Failed to findOneAndUpdate answer" })
            } else {
                console.log("resultAfterUpdate: " + resultAfterUpdate)
                res.status(200).send({ response: "Answer updated successfully" })
            }
        })
    }, 
}