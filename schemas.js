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
  }),
  followInfoSchema: new Mongoose.Schema({
    userId: String,
    followedBy: String
  }),
  channelInfoSchema: new Mongoose.Schema({
    id: String,
    label: String,
    createdBy: String,
    createdOn: Date,
    followedBy: {
      type: Array,
      default: []
    }
  }),
  postsSchema: new Mongoose.Schema({
    id: String,
    createdOn: Date,
    createdBy: String,
    channelId: String,
    text: String,
    comments: {
      type: Array,
      default: []
    },
    likedBy: {
      type: Array,
      default: []
    }
  }),
  lendAHandSchema: new Mongoose.Schema({
    id: String,
    createdOn: Date,
    createdBy: String,
    text: String,
    comments: {
      type: Array,
      default: []
    },
    likedBy: {
      type: Array,
      default: []
    },
  })
};
