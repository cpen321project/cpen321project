exports.validateAccessToken = async (JWT, userID) => {
    if (!JWT || !userID) {
        return false
    } else if (userID === "badUserID") {
        return false;
    } else if (userID === "goodUserID" && JWT === "validJWT") {
        return true;
    } else if (JWT === "invalidJWT") {
        return false;
    } else if (JWT === "expiredJWT") {
        return false;
    }
}
