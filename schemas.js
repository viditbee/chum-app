const Mongoose = require("mongoose");

module.exports = {
  superEmpSchema: new Mongoose.Schema({
    id: String,
    firstName: String,
    lastName: String,
    emailId: {
      type: String,
      unique: true
    },
    emailSent: {
      type: Boolean,
      default: false
    },
    teamId: {
      type: String,
      default: ""
    },
    admin: {
      type: Boolean,
      default: false
    }
  }),
  empSchema: new Mongoose.Schema({
    id: String,
    firstName: String,
    lastName: String,
    emailId: {
      type: String,
      unique: true
    },
    emailSent: {
      type: Boolean,
      default: false
    },
    teamId: {
      type: String,
      default: ""
    },
    admin: {
      type: Boolean,
      default: false
    }
  }),
  teamSchema: new Mongoose.Schema({
    id: String,
    createdOn: String,
    name: String,
    captain: String,
    problemId: String
  }),
  feedbackSchema: new Mongoose.Schema({
    id: String,
    createdOn: String,
    name: String,
    text: String
  })
};
