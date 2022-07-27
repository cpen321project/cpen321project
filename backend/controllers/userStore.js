const { MongoClient } = require("mongodb")
const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri)
client.connect()

const authUtils = require('../utils/authUtils.js')

let dbUser, userCollection

dbUser = client.db("user")
userCollection = dbUser.collection("userCollection")

module.exports = {
    signup: async (req, res) => {
        // try {
        //     let email = req.body.email;
        //     let password = req.body.password;
        //     let username = req.body.username;
        //     authUtils.signUserUp(email,password,username)
        //     return res.status(200).json({ success: true})
        // } catch (error) {
        //     return res.status(400).json({ success: false, error })
        // }

        let email = req.body.email;
        let password = req.body.password;
        let username = req.body.username;
        let signUpResult;
        try {
            signUpResult = await authUtils.signUserUp(email, password, username)
        } catch (err) {
            console.log("-----err:------\n")

            console.log(err.message)
            console.log("------end of err------\n")

            console.log("signup: err: " + err)
            console.log("signUpResult: " + signUpResult)

            return res.status(200).json({ success: false, result: err.message })
        }
        console.log("signUpResult: " + signUpResult)
        return res.status(200).json({ success: true, result: signUpResult })
    },
    confirmSignUp: async (req, res) => {
        let username = req.body.username;
        let confirmationCode = req.body.confirmationCode;
        let confirmResult;
        try {
            confirmResult = await authUtils.confrimSignUP(username, confirmationCode)
        } catch (error) {
            console.log("-----err:------\n")

            console.log(error.message)
            console.log("------end of err------\n")

            console.log("confirmSignUp: err: " + error)
            console.log("confirmResult: " + confirmResult)

            return res.status(200).json({ success: false, result: error.message })
        }
        console.log("confirmResult: " + confirmResult)
        return res.status(200).json({ success: true, result: confirmResult })

    },

    login: async (req, res) => {
        let username = req.body.username;
        let password = req.body.password;
        let loginResult;
        try {
            loginResult = await authUtils.login(username, password)
        } catch (error) {
            console.log("-----err:------\n")

            console.log(error.message)
            console.log("------end of err------\n")

            console.log("login: err: " + error)
            console.log("loginResult: " + loginResult)

            return res.status(200).json({ success: false, result: error.message })
        }
        console.log("loginResult: " + loginResult)
        return res.status(200).json({ success: true, result: loginResult })
    },

    resendConfirmationCode: async (req, res) => {
        let username = req.body.username;
        let resendResult;
        try {
            resendResult = await authUtils.resendConfrimationCode(username)
        } catch (error) {
            console.log("-----err:------\n")

            console.log(error.message)
            console.log("------end of err------\n")

            console.log("resendConfirmationCode: err: " + error)
            console.log("resendResult: " + resendResult)

            return res.status(200).json({ success: false, result: error.message })
        }
        console.log("resendResult: " + resendResult)
        return res.status(200).json({ success: true, result: resendResult })
    },

    getUserProfile: async (req, res) => {
        console.log("--------inside getUserProfile--------")
        console.log("req.params.userID: " + req.params.userID);
        console.log("req.params.jwt: " + req.params.jwt);
        //let tokenIsValid = await authUtils.validateAccessToken(req.params.jwt, req.params.userID)
        //if (!tokenIsValid) { 
       //     console.log("Token not validated")
        //    return
        //}

        // check if we want to get another user's profile (ie. in student list page)
        let userIDOfProfileToGet = req.params.userID
        console.log("req.params.otherUserID: " + req.params.otherUserID);
        if (req.params.otherUserID != "0") {
            userIDOfProfileToGet = req.params.otherUserID
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

    getCourseList: async (req, res) => {
        let tokenIsValid = await authUtils.validateAccessToken(req.params.jwt, req.params.userID)
        if (!tokenIsValid) { 
            console.log("Token not validated")
            return
        }
        await userCollection.find({ userID: req.params.userID }).project({ courselist: 1, _id: 0 }).toArray((err, resultcourse) => {
            if (err) {
                console.error("Error in getCourseList: " + err)
                res.status(400).send(err)
            } else {
                res.status(200).json(resultcourse)
            }
        })


    },

    createProfile: async (req, res) => {
        // try {
        //     await authUtils.validateAccessToken(req.body.jwt, req.body.userID)
        // }
        // catch {
        //     res.status(404)
        //     return
        // }
        var courselistarr = [];
        var blockeruserarr = [];
        userCollection.insertOne(
            {
                displayName: req.body.displayName,
                userID: req.body.userID,
                coopStatus: req.body.coopStatus,
                yearStanding: req.body.yearStanding,
                registrationToken: req.body.registrationToken,
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
        let tokenIsValid = await authUtils.validateAccessToken(req.body.jwt, req.body.userID)
        if (!tokenIsValid) {
            console.log("Token not validated")
            return
        }
        userCollection.updateOne({ "userID": req.body.userID }, { $push: { "blockedUsers": req.body.blockedUserAdd } }, (err, result) => {
            if (err) {
                console.error(err)
                res.status(400).send(err)
            } else {
                res.status(200).json({ ok: true })
            }
        });

    },

    unblock: async (req, res) => {
        let tokenIsValid =  await authUtils.validateAccessToken(req.params.jwt, req.params.userID)
        if (!tokenIsValid) {
            console.log("Token not validated")
            return
        }        userCollection.updateOne({ "userID": req.params.userID }, { $pull: { "blockedUsers": req.params.userIDtoDelete } }, (err, result) => {
            if (err) {
                console.error(err)
                res.status(400).send(err)
            } else {
                res.status(200).json({ ok: true })
            }
        });
    },

    getDisplayNameByUserIDfromDB: _getDisplayNameByUserIDfromDB,

    getDisplayNameByUserID: async function (req, res) {
        let retrievedDisplayName = await getDisplayNameByUserIDfromDB(req.params.userID)
        console.log("retrievedDisplayName: " + retrievedDisplayName)
        res.status(200).json({ retrievedDisplayName })
    },

    editProfile: async (req, res) => {
        let displayName= req.body.displayName
        let userID = req.body.userID
        let coopStatus= req.body.coopStatus
        let yearStanding= req.body.yearStanding
        let jwt = req.body.jwt

        if (!displayName || !userID || !coopStatus || !yearStanding || !jwt ) {
            console.log("Invalid body parameter(s).")
            res.status(400).send({ response: "Invalid body parameter(s)." })
            return;
        }

        let filter = { userID: userID }
        let update = { displayName: displayName, coopStatus: coopStatus, yearStanding: yearStanding};
        userCollection.findOneAndUpdate(filter, {$set : update}, function(err, resultProfileUpdated){
            if (err) {
                console.log("err: " + err)
                res.status(400).send({ response: "Failed to findOneAndUpdate profile" })
            } else {
                console.log("resultProfileUpdated: " + resultProfileUpdated)
                res.status(200).send({ response: "Profile updated successfully" })
            }
        }
        )
    }


}

async function _getDisplayNameByUserIDfromDB(userID) {
    console.log("----------------getDisplayNameByUserIDfromDB------------------")
    console.log("userID: " + userID)

    let retrievedUser = await userCollection.findOne({ userID })
    if (retrievedUser) {
        console.log("retrievedUser: " + retrievedUser.displayName)
        console.log("---------------end of getDisplayNameByUserIDfromDB-------------------")
        return retrievedUser.displayName
    } else {
        console.log("retrievedUser: not found");
        console.log("---------------end of getDisplayNameByUserIDfromDB-------------------")
    }
}