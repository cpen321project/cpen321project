module.exports = {
    getDisplayNameByUserID: async function (req, res) {
        let retrievedDisplayName = await module.exports.getDisplayNameByUserIDfromDB(req.params.userID)
        console.log("retrievedDisplayName: " + retrievedDisplayName)
        res.status(200).json({ retrievedDisplayName })
    },
    getDisplayNameByUserIDfromDB: (userID) => {
        console.log("----------------getDisplayNameByUserIDfromDB------------------")
        console.log("userID: " + userID)
    
        if (userID === "validUserID") {
            return "displayName1"
        } else if (userID === "receiverID") {
            return "displayName2"
        } else {
            return "defaultDisplayName"
        }
    }, 
    signup: async (req, res) => {
        return res.status(200)
    },
    confirmSignUp: async (req, res) => {
        return res.status(200)
    },
    login: async (req, res) => {
        return res.status(200)
    },
    resendConfirmationCode: async (req, res) => {
        return res.status(200)
    },
    getUserProfile: async (req, res) => {
        return res.status(200)
    },
    getCourseList: async (req, res) => {
        return res.status(200)
    },
    createProfile: async (req, res) => {
        return res.status(200)
    },
    block: async (req, res) => {
        return res.status(200)
    },
    unblock: async (req, res) => {
        return res.status(200)
    },
    getDisplayNameByUserID: async (req, res) => {
        return res.status(200)
    },
    editProfile: async (req, res) => {
        return res.status(200)
    }
}