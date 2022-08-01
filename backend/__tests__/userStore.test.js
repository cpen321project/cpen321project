jest.mock("../controllers/userStore")
const userStore = require("../controllers/userStore")

describe("userStore tests", () => {

  it("triggers signUp", async () => {
    expect.assertions(1)
    let username = "$%*^*$##$"
    const receivedResult = await userStore.signup("email", "password", username)
    return expect(receivedResult).toEqual({code: -1, err: "Data store not updated"})
  })

//   it("triggers addUserToCourse", async () => {
//     expect.assertions(2)
//     const req = {
//       body: { displayName: "john", userID: "john"}
//     }
//     let res = {}
//     await courseManager.addUserToCourse(req, res)
//     expect(res.status).toEqual(200)
//     expect(res.json).toEqual("User added successfully\n")
//   })

//   it("triggers addCourseToUser", async () => {
//     expect.assertions(2)
//     const req = {
//       body: { userID: "john", coursename: "CPEN 321" }
//     }
//     let res = {}
//     await courseManager.addCourseToUser(req, res)
//     expect(res.status).toEqual(200)
//     expect(res.json).toEqual({ ok: true })
//   })

//   it("triggers deleteUserFromCourse", async () => {
//     expect.assertions(2)
//     const req = {
//       params: { coursename: "CPEN 321"},
//       body: { userID: "john" }
//     }
//     let res = {}
//     await courseManager.deleteUserFromCourse(req, res)
//     expect(res.status).toEqual(200)
//     expect(res.json).toEqual("User deleted successfully\n")
//   })

//   it("triggers deleteCourseFromUser", async () => {
//     expect.assertions(2)
//     const req = {
//       body: { userID: "john", coursename: "CPEN 321" }
//     }
//     let res = {}
//     await courseManager.deleteCourseFromUser(req, res)
//     expect(res.status).toEqual(200)
//     expect(res.json).toEqual("Course deleted successfully\n")
//   })

})