const Question = require('../models/Question.js')
const Answer = require('../models/Answer.js')
const userStore = require('./userStore.js')
const authUtils = require("../utils/authUtils.js")

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
                return err
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
        // let tokenValidated = await authUtils.validateAccessToken(req.params.jwt, req.params.userID)
        // if (!tokenValidated) {
        //     res.status(404)
        //     return
        // }
        console.log("----------------inside getAllQuestions----------------")

        // select createdAt: 0, updatedAt: 0, __v: 0
        Question
            .find()
            .select({
                askerID: 0
            })
            .sort({ createdAt: 'asc' }) 
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
        // let tokenValidated = await authUtils.validateAccessToken(req.params.jwt, req.params.userID)
        // if (!tokenValidated) {
        //     res.status(404)
        //     return
        // }
        console.log("----------------inside getAllQuestionsForATopic----------------")

        let topic = req.params.topic

        Question
            .find({ topic })
            .select({
                askerID: 0
            })
            .sort({ createdAt: 'asc' }) 
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
        // let tokenValidated = await authUtils.validateAccessToken(req.params.jwt, req.params.userID)
        // if (!tokenValidated) {
        //     res.status(404)
        //     return
        // }
        console.log("----------------inside getAllQuestionsFromAUser----------------")

        let userID = req.params.userID
        console.log("Getting all Q's from userID: " + userID)

        Question
            .find({ askerID: userID })
            .select({
                askerID: 0
            })
            .sort({ createdAt: 'asc' }) 
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
        // let tokenValidated = await authUtils.validateAccessToken(req.params.jwt, req.params.userID)
        // if (!tokenValidated) {
        //     res.status(404)
        //     return
        // }
        console.log("----------------inside getAllAnswersForAQuestion----------------")

        let questionID = req.params.questionID
        console.log("questionID: " + questionID)

        Answer
            .find({ questionID })
            .select({
                answererID: 0
            })
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
}