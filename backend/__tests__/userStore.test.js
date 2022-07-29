jest.mock("../controllers/userStore")
const userStore = require("../controllers/userStore")

describe("userStore tests", () => {

    it("triggers signUp", async () => {
        expect.assertions(1)
        let username = "$%*^*$##$"
        const receivedResult = await userStore.signup("email", "password", username)
        return expect(receivedResult).toEqual({ code: -1, err: "Data store not updated" })
    })


})