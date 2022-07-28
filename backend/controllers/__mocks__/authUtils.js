exports.validateAccessToken = async (JWT, userID) => {
    if (!JWT || !userID) {
        return false
    }else if(userID==="1x1x1x"){
        return false;
    }else if(userID==="1y1y1y" && JWT === "validJWT"){
        return true;
    }else if(JWT === "invalidJWT"){
        return false;
    }else if(JWT === "expiredJWT"){
        return false;
    }
}
