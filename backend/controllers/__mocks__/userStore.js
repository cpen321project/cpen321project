// Create  a  mock  for  any  of  your  back-end  modules 
// (https://jestjs.io/docs/en/mockfunctions). That is, you 
// should create mocks for all interfaces exposed by this 
// module.  For  now,  each  mock  should  return  a 
// predefined  value of  the  right  return type,  as  
// expected from the corresponding interface.  
// There is no need to mock databases and APIs of 
// external components. Implement a test suite that 
// triggers each of the mocks.  

// Mocking User Module Interfaces (from userStore.js):
// signUp
// confirmSignUp
// login
//resendConfirmationCode
//getUserProfile
//getCourseList
//createProfile
//block
//unblock
//getDisplayNameByUserID
//editProfile

module.exports = {
    signup: jest.fn( async (email, password, username)=> {
            if (username === "$%*^*$##$") {
                return({code: -1, err: "Data store not updated"})
            } else if (username === "" || username === "zsfocoabakmny8zp8053ihpz2l2yafl55uaik1fm6p8xasz20vh3xi22mid7zw3d4vswodbl4it6q4w49rarlrltf0fljnk6liw155jyla1th40pse22xtq78osibaxmd") {
                return({code: -1, err: "Invalid username"})
            } else if (username === "Abc,,") {
                return({code: -1, err: "Invalid username"})
            } else if(email==="johndoe@hjhmail.com" && username === "Johndoe" && password === "John123??"){
                return({code: 0})
            } else if(email === "a@my.com"){
                return({code: -1, err: "Data store not updated"})
            } else if(password==="s4NxU06GDTDtHJdYuAN7jwxT42Uwwth2WayAvEwHXt9orY6euOXvgyZM1bd2jT6IPcbco4mYNLMKCFg8iKQGox5K7B5eFTUhI7k8Uo53DXuVY0bgbc5q2n4QOxISG5mXmYuJe22bdH4lR46Vn7ObCfUCqDyx9MdkjMKLZBGzPgCyV14QjXBKjrUKLwQu7fyrnfH6v6mBBYKyCW6RzorwZWwbndvlucvAR4q7n3Lx1LP4IQf6JgElbJxhz6CEEF0Mab"){
                return({code: -1, err: "Password invalid"})
            }
      }),
    }

   
