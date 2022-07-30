module.exports = {
    updateUserDisplayNameInQuestions: jest.fn(async (userID, newDisplayName) => {
        if (userID === "badUserID") {
            return false;
        } else if (userID === "goodUserID") {
            return true;
        } else if (userID === null || newDisplayName === null) {
            return false;
        } else if (userID === "" || newDisplayName === "") {
            return false;
        }

    }),

    updateUserDisplayNameInAnswers: jest.fn(async (userID, newDisplayName) => {
        if (userID === "badUserID") {
            return false;
        } else if (userID === "goodUserID") {
            return true;
        } else if (userID === null || newDisplayName === null) {
            return false;
        } else if (userID === "" || newDisplayName === "") {
            return false;
        }
    }),

    getAllQuestions: async (req, res) => {
        return res.status(200).send("getAllQuestions")
    },

    getAllQuestionsForATopic: async (req, res) => {
        return res.status(200).send("getAllQuestionsForATopic")
    },

    getAllQuestionsFromAUser: async (req, res) => {
        return res.status(200).send("getAllQuestionsFromAUser")
    },

    getAllAnswersForAQuestion: async (req, res) => {
        return res.status(200).send("getAllAnswersForAQuestion")
    },

    postQuestion: async (req, res) => {
        return res.status(200).send("postQuestion")
    },

    postAnswer: async (req, res) => {
        return res.status(200).send("postAnswer")
    },

    editQuestion: async (req, res) => {
        return res.status(200).send("editQuestion")
    },

    editAnswer: async (req, res) => {
        return res.status(200).send("editAnswer")
    },




}