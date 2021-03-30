const Mongoose = require("mongoose");

module.exports = {
  superUserSchema: new Mongoose.Schema({
    id: String,
    firstName: String,
    lastName: String,
    emailId: {
      type: String,
      unique: true
    }
  }),
  userSchema: new Mongoose.Schema({
    id: String,
    firstName: String,
    lastName: String,
    emailId: {
      type: String,
      unique: true
    }
  }),
  teamSchema: new Mongoose.Schema({
    id: String,
    createdOn: String,
    name: String,
    captain: String,
    problemId: String
  })
};
