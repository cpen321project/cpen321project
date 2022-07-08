const AWS = require('aws-sdk')
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const { getMaxListeners } = require('../models/Message');
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
const USERPOOLID = process.env.USERPOOLID
const CLIENTID = process.env.CLIENTID
const userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: USERPOOLID,
    ClientId: CLIENTID
});

//Update AWS configuration with the correct credentials and region
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

exports.signUserUp = async (email, password, username) => {
    // Signs the user up and sends a confirmation code to the provided email
    const cognitoParams = {
        "ClientId": CLIENTID,
        "Password": password,
        "UserAttributes": [
            {
                "Name": "email",
                "Value": email
            }
        ],
        "Username": username,
    }
    cognito.signUp(cognitoParams, function (err, res) {
        if (err)
            throw (err.code)    // Example error codes: InvalidPasswordException, InvalidParameterException (invalid email address)
        return res
    })
}

exports.confrimSignUP = async (username, confirmationCode) => {
    // Changes the status of the user to CONFIRMED in AWS cognito
    const cognitoParams = {
        "ClientId": CLIENTID,
        "ConfirmationCode": confirmationCode,
        "Username": username
    }
    cognito.confirmSignUp(cognitoParams, (err, res) => {
        if (err) {
            console.log(err)
            throw (err.code) // Example error codes: ExpiredCodeException (expired or incorrect or invalid username), InvalidParameterType (invalid email)
        }
        return res
    })
}

exports.login = async (username, password) => {
    // Logs the user in and gets the jwtToken of the current user session
    var userData = {
        Username: username,
        Pool: userPool,
    }
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: username,
        Password: password
    });
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            var accesstoken = result.getAccessToken().getJwtToken();
            return accesstoken
        },
        onFailure: (function (err) {
            throw (err.code)  //Example error code: NotAuthorizedException
        })
    })
}

exports.resendConfrimationCode = async (username) => {
    // Resened confirmation code in case the previous confirmation code was expired
    cognitoParams = {
        "ClientId": CLIENTID,
        "Username": username
    }
    cognito.resendConfirmationCode(cognitoParams, (err, res) => {
        if (err) {
            console.log(err)
            throw (err.code)
        }
        return res
    })
} 
