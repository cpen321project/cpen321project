const authUtils = require('../utils/authUtils.js')
const chatEngine = require('../controllers/chatEngine.js')
const forumEngine = require('../controllers/forumEngine.js')
const courseManager = require('../controllers/courseManager.js')

let dbUser, userCollection

dbUser = client.db("user")
userCollection = dbUser.collection("userCollection")

// interface not exposed to frontend
async function getDisplayNameByUserIDfromDB(userID) {
    console.log("----------------getDisplayNameByUserIDfromDB------------------")
    console.log("userID: " + userID)

    let retrievedUser = await userCollection.findOne({ userID })
    if (retrievedUser) {
        console.log("retrievedUser: " + retrievedUser.displayName)
        return retrievedUser.displayName
    } else {
        console.log("retrievedUser: not found")
    }
}
global.getDisplayNameByUserIDfromDB = getDisplayNameByUserIDfromDB

module.exports = {
    signup: async (req, res) => {
        let email = req.body.email
        let password = req.body.password
        let username = req.body.username
        let signUpResult

        try {
            signUpResult = await authUtils.signUserUp(email, password, username)
        } catch (err) {
            console.log("-----err:------\n")

            console.log(err.message)
            console.log("------end of err------\n")

            console.log("signup: err: " + err)
            console.log("signUpResult: " + signUpResult)

            return res.status(400).json({ success: false, result: err.message })
        }
        console.log("signUpResult: " + signUpResult)
        return res.status(200).json({ success: true, result: signUpResult })
    },

    confirmSignUp: async (req, res) => {
        let username = req.body.username
        let confirmationCode = req.body.confirmationCode
        let confirmResult
        try {
            confirmResult = await authUtils.confrimSignUP(username, confirmationCode)
        } catch (error) {
            console.log("-----err:------\n")

            console.log(error.message)
            console.log("------end of err------\n")

            console.log("confirmSignUp: err: " + error)
            console.log("confirmResult: " + confirmResult)

            return res.status(400).json({ success: false, result: error.message })
        }
        console.log("confirmResult: " + confirmResult)
        return res.status(200).json({ success: true, result: confirmResult })

    },

    login: async (req, res) => {
        let username = req.body.username
        let password = req.body.password
        let loginResult
        try {
            loginResult = await authUtils.login(username, password)
        } catch (error) {
            console.log("-----err:------\n")

            console.log(error.message)
            console.log("------end of err------\n")

            console.log("login: err: " + error)
            console.log("loginResult: " + loginResult)

            return res.status(400).json({ success: false, result: error.message })
        }
        console.log("loginResult: " + loginResult)
        return res.status(200).json({ success: true, result: loginResult })
    },

    resendConfirmationCode: async (req, res) => {
        let username = req.body.username
        let resendResult
        try {
            resendResult = await authUtils.resendConfrimationCode(username)
        } catch (error) {
            console.log("-----err:------\n")

            console.log(error.message)
            console.log("------end of err------\n")

            console.log("resendConfirmationCode: err: " + error)
            console.log("resendResult: " + resendResult)

            return res.status(400).json({ success: false, result: error.message })
        }
        console.log("resendResult: " + resendResult)
        return res.status(200).json({ success: true, result: resendResult })
    },

    getUserProfile: async (req, res) => {
        console.log("--------inside getUserProfile--------")
        console.log("req.params.userID: " + req.params.userID)
        console.log("req.params.jwt: " + req.params.jwt)
        let tokenIsValid = await authUtils.validateAccessToken(req.params.jwt, req.params.userID)
        if (!tokenIsValid) {
            console.log("Token not validated")
            return res.status(400).json("Token not validated")
        }

        // check if we want to get another user's profile (ie. in student list page)
        let userIDOfProfileToGet = req.params.userID
        console.log("req.params.otherUserID: " + req.params.otherUserID)
        if (req.params.otherUserID != "0") {
            userIDOfProfileToGet = req.params.otherUserID
        }

        let findResult = await userCollection.find({ userID: userIDOfProfileToGet }).toArray()
        if (findResult.length === 0) {
            console.log("findResult: " + findResult + ".")
            console.log("No user exists")
            return res.status(400).json("No user exists")
        }

        await userCollection.find({ userID: userIDOfProfileToGet }).toArray((err, userProfileResult) => {
            if (err) {
                console.log("err: " + err)
                console.error("Error in getUserProfile: " + err)
                res.status(400).send(err)
            } else {
                console.log("userProfileResult: " + userProfileResult)
                res.status(200).json(userProfileResult)
            }
        })



    },

    createProfile: async (req, res) => {
        let displayName = req.body.displayName
        let userID = req.body.userID
        let coopStatus = req.body.coopStatus
        let yearStanding = req.body.yearStanding
        let registrationToken = req.body.registrationToken

        if (displayName === null || userID === null || coopStatus === null || yearStanding === null || registrationToken === null) {
            console.log("null parameter")
            return res.status(400).json("null parameter")
        }

        if (displayName == "" || userID == "" || coopStatus == "" || yearStanding == "" || registrationToken == "") {
            console.log("empty parameter")
            return res.status(400).json("empty parameter")
        }

        if (containsSpecialChars(displayName)) {
            console.log("display name contains special character")
            return res.status(400).json("display name contains special character")
        }

        if (!(coopStatus == "Yes" || coopStatus == "No")) {
            console.log(coopStatus)
            console.log("coop status invalid")
            return res.status(400).json("coop status invalid")
        }

        if (!(yearStanding == "1" || yearStanding == "2" || yearStanding == "3" || yearStanding == "4" || yearStanding == "5")) {
            console.log("year standing invalid")
            return res.status(400).json("year standing invalid")
        }

        var courselistarr = []
        var blockeruserarr = []
        userCollection.insertOne(
            {
                displayName,
                userID,
                coopStatus,
                yearStanding,
                registrationToken,
                courselist: courselistarr,
                blockedUsers: blockeruserarr,
            },
            (err, result) => {
                if (err) {
                    console.error(err)
                    res.status(400).send(err)
                } else {
                    res.status(200).json({ ok: true })
                }
            }
        )
    },

    block: async (req, res) => {
        console.log("-------------block-------------")
        let jwt = req.body.jwt
        let userID = req.body.userID
        let blockedUserAdd = req.body.blockedUserAdd

        if (!userID || !blockedUserAdd) {
            console.log("Invalid parameters")
            return res.status(404).json("Invalid parameters")
        }

        let tokenIsValid = await authUtils.validateAccessToken(jwt, userID)
        if (!tokenIsValid) {
            console.log("Token not validated")
            return res.status(400).json("Token not validated")
        }

        let findResult = await userCollection.find({ userID: blockedUserAdd }).toArray()
        if (findResult.length === 0) {
            console.log("findResult: " + findResult + ".")
            console.log("No user exists to be blocked")
            return res.status(400).json("No user exists to be blocked")
        }

        let findResult2 = await userCollection.findOne({ userID, blockedUsers: blockedUserAdd })
        if (findResult2) {
            console.log("Already blocked.")
            return res.status(400).json("Already blocked")
        }


        userCollection.updateOne({ userID }, { $push: { "blockedUsers": blockedUserAdd } }, (err, result) => {
            if (err) {
                console.error(err)
                res.status(400).send(err)
            } else {
                res.status(200).json({ ok: true })
            }
        })

    },

    unblock: async (req, res) => {
        console.log("-------------unblock-------------")
        let jwt = req.params.jwt
        let userID = req.params.userID
        let userIDtoDelete = req.params.userIDtoDelete

        // if (!userID || !userIDtoDelete) {
        //     console.log("Invalid parameters unblock")
        //     return res.status(400).json("Invalid parameters unblock")
        // }


        let tokenIsValid = await authUtils.validateAccessToken(jwt, userID)
        if (!tokenIsValid) {
            console.log("Token not validated")
            return res.status(400).json("Token not validated")
        }

        let findResult = await userCollection.find({ userID: userIDtoDelete }).toArray()
        if (findResult.length === 0) {
            console.log("findResult: " + findResult + ".")
            console.log("No user exists to be unblocked")
            return res.status(400).json("No user exists to be unblocked")
        }

        let findResult2 = await userCollection.findOne({ userID, blockedUsers: userIDtoDelete })
        if (!findResult2) {
            console.log("Not blocked previously.")
            return res.status(400).json("Not blocked previously")
        }

        userCollection.updateOne({ "userID": req.params.userID }, { $pull: { "blockedUsers": userIDtoDelete } }, (err, result) => {
            if (err) {
                console.error(err)
                res.status(400).send(err)
            } else {
                res.status(200).json({ ok: true })
            }
        })
    },

    getDisplayNameByUserID: async function (req, res) {
        console.log("inside getDisplayNameByUserID")
        let retrievedDisplayName = await getDisplayNameByUserIDfromDB(req.params.userID)
        console.log("retrievedDisplayName: " + retrievedDisplayName)
        res.status(200).json({ retrievedDisplayName })
    },

    editProfile: async (req, res) => {
        let displayName = req.body.displayName
        let userID = req.body.userID
        let coopStatus = req.body.coopStatus
        let yearStanding = req.body.yearStanding
        let jwt = req.body.jwt

        if(displayName === null|| userID === null || coopStatus === null || yearStanding === null|| jwt === null){
            console.log("null parameter")
            return res.status(400).json("null parameter")
        }

        if (displayName == "" || userID == "" || coopStatus == "" || yearStanding == "" || jwt == "") {
            console.log("empty parameter")
            return res.status(400).json("empty parameter")
        }

        if (containsSpecialChars(displayName)) {
            console.log("display name contains special character")
            return res.status(400).json("display name contains special character")
        }

        if (!(coopStatus == "Yes" || coopStatus == "No")) {
            console.log(coopStatus)
            console.log("coop status invalid")
            return res.status(400).json("coop status invalid")
        }

        if (!(yearStanding == "1" || yearStanding == "2" || yearStanding == "3" || yearStanding == "4" || yearStanding == "5")) {
            console.log("year standing invalid")
            return res.status(400).json("year standing invalid")
        }

        let tokenIsValid = await authUtils.validateAccessToken(jwt, userID)
        if (!tokenIsValid) {
            console.log("Token not validated")
            return res.status(400).json("Token not validated")
        }

        // update all group & private msgs in chatDB with new displayName
        let updateGroupChatsResult = await chatEngine.updateUserDisplayNameInGroupChats(userID, displayName)
        if (!updateGroupChatsResult) {
            console.log("bad updateGroupChatsResult")
        }
        let updatePrivateChatsResult = await chatEngine.updateUserDisplayNameInPrivateChats(userID, displayName)
        if (!updatePrivateChatsResult) {
            console.log("bad updatePrivateChatsResult")
        }

        // update all questions & answers in forumDB with new displayName
        let updateQuestionsResult = await forumEngine.updateUserDisplayNameInQuestions(userID, displayName)
        if (!updateQuestionsResult) {
            console.log("bad updateQuestionsResult")
        }
        let updateAnswersResult = await forumEngine.updateUserDisplayNameInAnswers(userID, displayName)
        if (!updateAnswersResult) {
            console.log("bad updateAnswersResult")
        }

        // update userDB
        let filter = { userID }
        let update = { displayName, coopStatus, yearStanding }
        userCollection.findOneAndUpdate(filter, { $set: update }, function (err, resultProfileUpdated) {
            if (err) {
                console.log("err: " + err)
                res.status(400).send({ response: "Failed to findOneAndUpdate profile" })
            } else {
                console.log("resultProfileUpdated: " + resultProfileUpdated)
                res.status(200).send({ response: "Profile updated successfully" })
            }
        })

        //update courseDB
        var courses = await userCollection.find({ userID }).project({ courselist: 1, _id: 0 }).toArray()
        //console.log("courselist " + courses[0].courselist)


        courses[0].courselist.forEach(coursename => {
            console.log("coursename " + coursename)
            courseManager.editDisplayNameInCourse(displayName, userID, coursename)
        })

    }
}

function containsSpecialChars(str) {
    const specialChars = /[`!@#$%^&*()_+\-=\]{}':"\\|,.<>\/?~]/
    return specialChars.test(str)
}
