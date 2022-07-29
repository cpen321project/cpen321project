const { MongoClient } = require("mongodb")
const uri = "mongodb://localhost:27017"

let dbUser, dbCourse, userCollection

module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect( uri,  { useNewUrlParser: true, useUnifiedTopology: true }, function( err, client ) {
        dbUser = client.db("user")
        dbCourse = client.db("course")
        userCollection = dbUser.collection("userCollection")
      return callback( err );
    } );
  },

  getDbUser: function() {
    return dbUser;
  },

  getDbCourse: function() {
    return dbCourse;
  },

  getUserCollection: function() {
    return userCollection;
  }

};