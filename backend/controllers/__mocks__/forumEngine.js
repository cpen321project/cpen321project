module.exports = {
    updateUserDisplayNameInQuestions: jest.fn(async (userID, newDisplayName) => {
        if(userID==="badUserID"){
            return false;
        }else if(userID==="goodUserID"){
            return true;
        }else if(userID === null || newDisplayName === null){
            return false;
        }else if(userID === "" || newDisplayName === ""){
            return false;
        }
        
    }),

    updateUserDisplayNameInAnswers: jest.fn(async (userID, newDisplayName) => {
        if(userID==="badUserID"){
            return false;
        }else if(userID==="goodUserID"){
            return true;
        }else if(userID === null || newDisplayName === null){
            return false;
        }else if(userID === "" || newDisplayName === ""){
            return false;
        }
    })
}