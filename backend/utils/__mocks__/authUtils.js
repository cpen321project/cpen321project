exports.validateAccessToken = jest.fn(async (JWT, userID) => {
    if (!JWT || !userID) {
        return false
    } else if (userID === "invalidUserID") {
        return false;
    } else if (userID === "validUserID" && JWT === "validJWT") {
        return true;
    } else if (JWT === "invalidJWT") {
        return false;
    } else if (JWT === "expiredJWT") {
        return false;
    }
})

exports.signUserUp = (email, password, username) => {
    // Signs the user up and sends a confirmation code to the provided email
    // Returns a user uuid
    return Promise.resolve()
}