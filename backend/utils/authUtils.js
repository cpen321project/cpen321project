const AWS = require('aws-sdk')
const Axios = require('axios')
const jwkToPem = require('jwk-to-pem')
const crypto = require('crypto')
const AmazonCognitoIdentity = require('amazon-cognito-identity-js')

const AWS_ACCESS_KEY_ID = "AKIAV5LKEBZTW5LR5BRX" // "AKIA4YSA6A6DFAOYM7U3"//"AKIATNLYKFHXVBMV5DOO"
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
const USERPOOLID = "us-west-2_1vNfplMQN" //"us-west-2_rmLw5ym1e"//us-west-2_LJltK6RSZ"
const CLIENTID = "man4ddlj357j9l7kf8cqfhut5"// "tqre75iiboauf7t26amf9cda2"//"7docu6553pf9vi5ipv1ig1huns"
const COGNITO_ISSUER = `https://cognito-idp.us-west-2.amazonaws.com/${USERPOOLID}`
const userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: USERPOOLID,
    ClientId: CLIENTID
});

//AWS cognito generates two pairs of RSA keys (a public and local key) for each userpool,
// the public key available at the following URL, and the local key is generated when user logs in
const url = COGNITO_ISSUER + '/.well-known/jwks.json'

getPublicKey = async () => {
    return await Axios.get(url)
}

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


exports.signUserUp = (email, password, username) => {
    // Signs the user up and sends a confirmation code to the provided email
    // Returns a user uuid
    return new Promise ((resolve, reject) => {
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
            if (err) {
                reject(err)    // Example error codes: InvalidPasswordException, InvalidParameterException (invalid email address)
                return 
            }
            resolve(res.UserSub)
        })
    })
}

exports.confrimSignUP = (username, confirmationCode) => {
    // Changes the status of the user to CONFIRMED in AWS cognito
    return new Promise ((resolve, reject) => {
        const cognitoParams = {
            "ClientId": CLIENTID,
            "ConfirmationCode": confirmationCode,
            "Username": username
        }
        cognito.confirmSignUp(cognitoParams, (err, res) => {
            if (err) {
                reject(err) // Example error codes: ExpiredCodeException (expired or incorrect or invalid username), InvalidParameterType (invalid email)
            }
            resolve(res)
        })
    })

}


exports.login = (username, password) => {
    return new Promise((resolve, reject) => {
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
                var accessToken = result.getAccessToken().getJwtToken();
                var userID = result.getAccessToken().payload.sub
                resolve({ accessToken, userID })
            },
            onFailure: function (err) {
                reject(err)
            }
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
            throw (err)
        }
    })
}

exports.validateAccessToken = async (JWT, userID) => {
    // Decodes and verifies a jwt access token 
    // Referneced from: https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html
    // For future reference: https://github.com/awslabs/aws-jwt-verify is a library maintained by AWS to verify JSON Web Tokens,
    // we did NOT use this library for the purposes of this course
    console.log("---------validateAccessToken---------")

    if (!JWT) {
        console.log("No JWT provided")
        return false
    }

    // Step 1: Confirm the structure of the JWT
    const JWTSections = [tokenHeader, tokenPayload, tokenSignature] = JWT.split('.')
    if (JWTSections.length !== 3) {
        console.log("Invalid JWT structure")
        return false
    }

    // Step 2: Validate the JWT signature
    // TODO: fix 
    publicKey = await getPublicKey()
    console.log("---------------------") 
    console.log("publicKey: " + publicKey) // returns [object Promise]
    console.log("publicKey.data: " + publicKey.data) 
    console.log("---------------------")
    const keys = publicKey.data.keys 
    decodedTokenHeader = JSON.parse(Buffer.from(tokenHeader, 'base64').toString('utf8'))
    // compare the local key ID (kid) to the public kid
    if (keys[1].kid != decodedTokenHeader.kid) {
        console.log("JWT local key ID not same as public key ID")
        return false
    }
    decodedtokenPayload = JSON.parse(Buffer.from(tokenPayload, 'base64').toString('utf8'))
    let currentTimestamp = Math.floor((new Date()).valueOf() / 1000)
    // verify token is not expired
    if (currentTimestamp > decodedtokenPayload.exp) {
        console.log("Token expired")
        return false
    }
    // verify token signature
    var pem = jwkToPem(keys[1]);
    validSignature = crypto.createVerify('RSA-SHA256')
                    .update(`${tokenHeader}.${tokenPayload}`)
                    .verify(crypto.createPublicKey(pem), tokenSignature, 'base64')
    if (!validSignature) {
        console.log("Invalid token signature")
        return false
    }

    // Step 3: Verify the claims
    if (decodedtokenPayload.client_id != CLIENTID
        || decodedtokenPayload.token_use != 'access'
        || decodedtokenPayload.iss != COGNITO_ISSUER
        || decodedtokenPayload.sub != userID) {
        
        console.log("Token bad match")

        console.log("Gotten:")
        console.log("decodedtokenPayload.client_id: " + decodedtokenPayload.client_id)
        console.log("decodedtokenPayload.token_use: " + decodedtokenPayload.token_use)
        console.log("decodedtokenPayload.iss: " + decodedtokenPayload.iss)
        console.log("decodedtokenPayload.sub: " + decodedtokenPayload.sub)
        console.log("Expected:")
        console.log("decodedtokenPayload.client_id: " + CLIENTID)
        console.log("decodedtokenPayload.token_use: 'access'")
        console.log("decodedtokenPayload.iss: " + COGNITO_ISSUER)
        console.log("decodedtokenPayload.sub: " + userID)

        return false
    }

    return true;
}
