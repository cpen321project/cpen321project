module.exports = {
    userAddedNotification: jest.fn(async (userID, courseID) => {
        // trying to get the the users in a course
        if (userID === "badUserID") {
            return false;
        } else if (userID === "goodUserID" && courseID === "CPEN 321") {
            return true;
        } else if (courseID === "CPEN321") {
            return false;
        } else if (userID === null || courseID === null) {
            return false;
        } else if (userID === "" || courseID === "") {
            return false;
        }
    })
}