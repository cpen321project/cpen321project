exports.validateAccessToken = async (JWT, userID) => {
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
}
