const AWS = require('aws-sdk')
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
})

exports.createNewUser = async (email, password) => {
    count = 0
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
        TemporaryPassword: "FindYourPeersCS@gmail.com"
    }
    try {
        await cognito.adminCreateUser(cognitoParams).promise()
    }
    catch (e) {
        return e.code
    }

    
    await cognito.adminSetUserPassword({
        "Password": password,
        "Permanent": true,
        "Username": email,
        "UserPoolId": USERPOOLID
    }).promise()
}
