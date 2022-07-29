module.exports = {
    newRegistrationToken: (req,res) => {
        console.log("mocked newRegToken")
        return true
    },
    _userAddedNotification: async (userID, courseID) => {
        // trying to get the the users in a course
        console.log("mocked userAddedNotification")
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
    },
    get userAddedNotification() {
        return this._userAddedNotification;
    },
    set userAddedNotification(value) {
        this._userAddedNotification = value;
    },
}