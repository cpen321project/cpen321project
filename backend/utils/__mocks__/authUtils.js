exports.validateAccessToken = jest.fn(async (JWT, userID) => {
    if (!JWT || !userID) {
        return false
    } else if (userID === "invalidUserID") {
        return false
    } else if (userID === "validUserID" && JWT === "validJWT") {
        return true
    } else if (JWT === "invalidJWT") {
        return false
    } else if (JWT === "expiredJWT") {
        return false
    } else {
        return false
    }
})

exports.signUserUp = (email, password, username) => {
    // Signs the user up and sends a confirmation code to the provided email
    // Returns a user uuid

    if(!email||!password||!username){
        return new Promise.reject("null")
    }else if(email==="" || password === "" || username === ""){
        return Promise.reject("empty")
    }else if(containsSpecialChars(username)){
        return Promise.reject("contains special character")
    }else if(username.toString().length<1 ||username.toString().length>128){
        console.log("length not match")
        return Promise.reject("length not match")
    }else if(checkUppercase(username)){
        console.log("contains uppercase")
        return Promise.reject("contains uppercase")
    }else if(email === "a@my.com"){
        console.log("email in use")
        return Promise.reject("email in use")
    }else if(!containsSpecialChars(email)){
        console.log("invalid email")
        return Promise.reject("invalid email")
    }else if(!containsSpecialChars(password) || password.toString().length<1 ||password.toString().length>256 || !checkUppercase(password) || !containsNumber(password)){
        console.log("invalid password")
        return Promise.reject("invalid password")
    }        

    return Promise.resolve()
}

exports.confrimSignUP = (username, confirmationCode) => {
    if(confirmationCode === "mismatchCode"){
        console.log("mismatch code")
        return res.status(400).json({ success: false, result: "code mismatch" })
    }else if(confirmationCode === "expiredCode"){
        console.log("expired code")
        return res.status(400).json({ success: false, result: "code expired" })
    }else if(username === "notExist"){
        console.log("username dne")
        return res.status(400).json({ success: false, result: "username dne" })
    }
    
    return Promise.resolve()
}

exports.login = (username, password) => {
    if(password === "wrongPassword"){
        console.log("wrongPassword")
        return res.status(400).json({ success: false, result: "wrong password" })
    }else if(username === "" || password === ""){
        console.log("empty password or username")
        return res.status(400).json({ success: false, result: "empty parameter" })
    }else if(username === "notRegistered"){
        console.log("no username")
        return res.status(400).json({ success: false, result: "no username" })
    }

    return Promise.resolve()

}

exports.resendConfrimationCode = async (username) => {
    // Resened confirmation code in case the previous confirmation code was expired
    if(username === ""){
        console.log("empty username")
        return res.status(400).json({ success: false, result: "empty parameter" })
    }else if(username === "notRegistered"){
        console.log("no username")
        return res.status(400).json({ success: false, result: "no username" })
    }

    return Promise.resolve()
}

function containsSpecialChars(str) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
};

function checkUppercase(str){
    for (var i=0; i<str.length; i++){
      if (str.charAt(i) == str.charAt(i).toUpperCase() && str.charAt(i).match(/[a-z]/i)){
        return true;
      }
    }
    return false;
};

function containsNumber(str) {
    return /\d/.test(str);
};