module.exports = {
    updateUserDisplayNameInQuestions: jest.fn(async (userID, newDisplayName) => {
        if(userID==="1x1x1x"){
            return false;
        }else if(userID==="1y1y1y"){
            return true;
        }else if(userID === null || newDisplayName === null){
            return false;
        }else if(userID === "" || newDisplayName === ""){
            return false;
        }
        
    }),

    updateUserDisplayNameInAnswers: jest.fn(async (userID, newDisplayName) => {
        if(userID==="1x1x1x"){
            return false;
        }else if(userID==="1y1y1y"){
            return true;
        }else if(userID === null || newDisplayName === null){
            return false;
        }else if(userID === "" || newDisplayName === ""){
            return false;
        }
    })
}