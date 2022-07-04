const AWS = require('aws-sdk')
const { retry } = require('statuses')
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
const USERPOOLID = process.env.USERPOOLID
AWS.config.update({
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    },
    region: "us-west-2"
})
const cognito = new AWS.CognitoIdentityServiceProvider({
    apiVersion: "2016-04-18",
    maxRetries: 1
})




exports.createNewUser = async (email, password) => {
    
    const cognitoParams = {
        UserPoolId: USERPOOLID,
        Username: email,
        UserAttributes: [{
            Name: "email",
            Value: email,
        },
        {
            Name: "email_verified",
            Value: "true",
        },
        ],
        //generate temporary password consisting of alphanumeric and special characters
        TemporaryPassword: "FindYourPeersCS@gmail.com"
    }
    cognito.adminCreateUser(cognitoParams, (err, res) => {
        console.log("1")
        console.log(err)
        console.log("2")
        console.log(res)

    }).promise().then(async () => {
        await cognito.adminSetUserPassword({
            "Password": password,
            "Permanent": true,
            "Username": email,
            "UserPoolId": USERPOOLID
        }, (err, res) => {
            if (res) {
                throw (new Error(err.code))
            }
        }).promise()
    })
    
}

exports.createNewUser("nancynagy66@gmail.com", "bhbGG1234???")

