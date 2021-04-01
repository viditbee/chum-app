const Mongoose = require("mongoose");

module.exports = {
  superUserSchema: new Mongoose.Schema({
    id: String,
    firstName: String,
    lastName: String,
    emailId: {
      type: String,
      unique: true
    },
    gotStarted: {
      type: Boolean,
      default: false
    }
  }),
  userSchema: new Mongoose.Schema({
    id: String,
    firstName: String,
    lastName: String,
    emailId: {
      type: String,
      unique: true
    },
    gotStarted: {
      type: Boolean,
      default: false
    }
  }),
  interestSchema: new Mongoose.Schema({
    id: String,
    label: String
  }),
  basicInfoSchema: new Mongoose.Schema({
    userId: String,
    location: String,
    department: String,
    aboutYou: String,
    languages: {
      type: Array,
      default: []
    },
    interests: {
      type: Array,
      default: []
    }
  })
};
