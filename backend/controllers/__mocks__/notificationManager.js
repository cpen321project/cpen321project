module.exports = {
    userAddedNotification: jest.fn(async (userID, courseID) => {
        // trying to get the the users in a course
        if(userID==="1x1x1x"){
            return false;
        }else if(userID==="1y1y1y" && courseID === "CPEN 321"){
            return true;
        }else if(courseID === "CPEN321"){
            return false;
        }else if(userID === null || courseID === null){
            return false;
        }else if(userID === "" || courseID === ""){
            return false;
        }
    })
}