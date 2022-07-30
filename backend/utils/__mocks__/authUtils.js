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
        return Promise.reject({message: "null"})
    }else if(email==="" || password === "" || username === ""){
        return Promise.reject({message: "empty"})
    }else if(containsSpecialChars(username)){
        return Promise.reject({message: "contains special character"})
    }else if(username.toString().length<1 ||username.toString().length>128){
        console.log("length not match")
        return Promise.reject({message: "length not match"})
    }else if(checkUppercase(username)){
        console.log("contains uppercase")
        return Promise.reject({message: "contains uppercase"})
    }else if(email === "a@my.com"){
        console.log("email in use")
        return Promise.reject({message: "email in use"})
    }else if(!containsSpecialChars(email)){
        console.log("invalid email")
        return Promise.reject({message: "invalid email"})
    }else if(!containsSpecialChars(password)){ 
    //|| password.toString().length<1 ||password.toString().length>256 || !checkUppercase(password) || !containsNumber(password)){
        console.log("invalid password")
        return Promise.reject({message: "invalid password"})
    }        

    return Promise.resolve({UserSub: "string sign up usersub"})
}

exports.confrimSignUP = (username, confirmationCode) => {
    if(confirmationCode === "mismatchCode"){
        return Promise.reject({message: "mismatch code"})
    }else if(confirmationCode === "expiredCode"){
        return Promise.reject({message: "code expired"})
    }else if(username === "notExist"){
        return Promise.reject({message: "username dne"})
    }
    
    return Promise.resolve({UserSub: "string sign up usersub"})
}

exports.login = (username, password) => {
    if(password === "wrongPassword"){
        return Promise.reject({message: "wrong password"})
    }else if(username === "" || password === ""){
        return Promise.reject({message: "empty parameter"})
    }else if(username === "notRegistered"){
        return Promise.reject({message: "no username"})
    }

    return Promise.resolve()

}

exports.resendConfrimationCode = async (username) => {
    // Resened confirmation code in case the previous confirmation code was expired
    if(username === ""){
        return Promise.reject({message: "empty username"})
    }else if(username === "notRegistered"){
        return Promise.reject({message: "no username"})
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