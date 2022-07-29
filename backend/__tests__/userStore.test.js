jest.mock("../controllers/chatEngine")
jest.mock("../controllers/forumEngine")
jest.mock("../utils/authUtils")
jest.mock("../controllers/courseManager")

const userStore = require("../controllers/userStore")

describe("userStore tests", () => {

    it("triggers signUp", async () => {
        // app.get("/getstudentlist/:coursename/:jwt/:userID", courseManager.getStudentList)
        let email = "aa"
        let password = "dfadfaf"//"goodUserID"
        let username = "$%*^*$##$"
        await request(app).post("/signup")
            .expect(400)
            .then(response => {
                console.log("response: " + response)
            })
    })

    


})