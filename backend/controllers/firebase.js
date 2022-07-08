// there needs to be a credential variable saved in the terminal, don't forget to save that in the deployment

const { initializeApp } = require('firebase-admin/app');

const app = initializeApp();
    // credential: applicationDefault(),
    //databaseURL: 'https://<DATABASE_NAME>.firebaseio.com' dont think we need it at the moment


// const { client } = require("./db/dbConnector.js");
// let dbUser, dbCourse, userCollection
// dbUser = client.db("user")
// dbCourse = client.db("course")
// userCollection = dbUser.collection("userCollection")

const {MongoClient} = require("mongodb")
const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri)
client.connect()

let dbUser, userCollection

dbUser = client.db("user")
dbCourse = client.db("course")
userCollection = dbUser.collection("userCollection")

// await client.connect(); //not needed

// send message to firebase 
// const sendMessageToFirebase = (senderName, receiverName, messageContent) => {
//     const db = admin.firestore(); // do we need to store the notifications we send?
//     const messageToSaveToDB = PrivateMessage(
//         {
//             senderName: senderName,
//             receiverName: receiverName,
//             messageContent: messageContent
//         }
//     )
//     db.collection('privateMessages').add(messageToSaveToDB)
// }


module.exports = {
    userAddedNotification: (userID, courseID) => {

        try {
             dbCourse.collection(courseID).find({}).project({ userID: 1, displayName: 1, _id: 0 }).toArray((err, otherstudents) => {
                if (err) {
                    console.error(err)
                    res.status(500).json({ err: err })
                    return
                }
            })

            otherstudents.remove(userID)
            theTokens = []
            otherstudents.forEach(student => {
                theTokens.push(userCollection.findOne({ userID: student.userID }).registrationToken)


            })
            // These registration tokens come from the client FCM SDKs.
            const registrationTokens = theTokens;

            const message = {
                notification: { 
                    title: 'New user in' + courseID, 
                    body: 'Say Hi to '+ userID.displayName + ' who just joined the course' + courseID 
                },
                tokens: registrationTokens,
            };

            app.getMessaging().sendMulticast(message)
                .then((response) => {
                    if (response.failureCount > 0) {
                        const failedTokens = [];
                        response.responses.forEach((resp, idx) => {
                            if (!resp.success) {
                                failedTokens.push(registrationTokens[idx]);
                            }
                        });
                        console.log('List of tokens that caused failures: ' + failedTokens);
                    }
                    else{
                        console.log('Successfully sent message to all tokens');
                    }
                });

        }

        catch (err) {
            console.log("For sending user added notification, the err:" + err)
            // res.status(400).send(err)
        }




    },

    newRegistrationToken : async (req,res) => {
       try{
        await userCollection.updateOne({userID: req.body.userID}, {$set: {registrationToken: req.body.registrationToken}})
            if (err) {
                console.error(err)
                res.status(500).json({ err: err })
                return
            }
            res.status(200).json({ok:true})
            // resultstudent.forEach(student => {
            //     if (student.userID != userID) {
            //         userAddedNotification(student.userID, courseID)
            //     }
            // }
            // )
        }
        catch (err) {
            console.log("Could not update token for" + req.body.userID + " with the error " + err)
            // res.status(400).send(err)
        }
       
    },

    // sendMessageNotification : (stff,stuff2) = {
    // need to do this for message notifications
    // },
};
