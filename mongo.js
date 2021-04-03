const Mongoose = require("mongoose");
const database = "chumtest";
const url = `mongodb+srv://vidit:newPass4atlas@cluster0.ts0zq.mongodb.net/${database}?retryWrites=true&w=majority`;

const { userSchema, interestSchema, basicInfoSchema, followInfoSchema, channelInfoSchema, channelPostsSchema, lendAHandSchema } = require("./schemas");
const MongoApis = {};
const { decipher } = require('./encrypt');
const SECRET_SALT_FOR_PASSWORD = "BEE";
const { sendSignupSuccessMail } = require('./mail-manager');
const { validateEmail } = require('./utils');

Mongoose.connect(url, async function () {

  Mongoose.Promise = global.Promise;

  MongoApis.authenticateUser = async (username, password) => {
    const UserModel = Mongoose.model("users", userSchema);
    const user = await UserModel.findOne({ 'emailId': username });
    const decipherFunc = decipher(SECRET_SALT_FOR_PASSWORD);
    if (user) {
      if (decipherFunc(password) === username) {
        return {
          status: "success",
          response: {
            id: user.id,
            emailId: user.emailId,
            firstName: user.firstName,
            lastName: user.lastName,
            gotStarted: user.gotStarted
          }
        };
      }
      return {
        status: "failure"
      }
    } else {
      return {
        status: "user_not_found"
      }
    }
  };

  MongoApis.registerUser = async (username, firstName, lastName) => {
    if (validateEmail(username)/* && username.indexOf("@contentserv.com") !== -1*/) {
      const UserModel = Mongoose.model("users", userSchema);
      const user = await UserModel.findOne({ 'emailId': username });
      if (!user) {
        let userRep = new UserModel({
          id: Math.floor(Math.random() * 1000000) + "",
          createdOn: new Date().getTime() + "",
          emailId: username,
          firstName: firstName,
          lastName: lastName,
        });
        const userFromDB = await userRep.save();
        sendSignupSuccessMail(userFromDB);
        return {
          status: "success"
        }
      } else {
        return {
          status: "user_already_registered"
        }
      }
    } else {
      return {
        status: "invalid_email_id"
      }
    }
  };

  MongoApis.getAllInterests = async () => {
    const InterestModel = Mongoose.model("interests", interestSchema);
    const interests = await InterestModel.find({}).select(['id', 'label']).exec();

    return {
      status: "success",
      response: interests
    };
  };

  MongoApis.resetInterests = async (interests) => {
    const InterestModel = Mongoose.model("interests", interestSchema);
    try {
      await InterestModel.collection.drop();
    } catch (e) {
      console.log("Drop failed");
    }
    await InterestModel.insertMany(interests);

    return {
      status: "success"
    };
  };

  MongoApis.addInterest = async (label) => {
    const InterestModel = Mongoose.model("interests", interestSchema);
    const id = "cust_" + Math.floor(Math.random() * 100000);

    const newInterest = new InterestModel({
      id,
      label
    });

    const response = await newInterest.save();

    return {
      status: "success",
      response: {
        id: response.id,
        label: response.label
      }
    };
  };

  MongoApis.updateUserBasicInfo = async ({ userId, location, department, languages, aboutYou, interests }) => {
    const BasicInfoModel = Mongoose.model("userbasicinfos", basicInfoSchema);
    const UserModel = Mongoose.model("users", userSchema);

    const basicInfo = {
      userId,
      location,
      department,
      languages,
      aboutYou,
      interests
    };

    await BasicInfoModel.updateOne({ userId }, basicInfo, { upsert: true }).exec();
    await UserModel.updateOne({ id: userId }, { gotStarted: true }, { upsert: true }).exec();

    return {
      status: "success",
      response: basicInfo
    };
  };

  MongoApis.getSubscribedChannels = async (userId) => {
    const ChannelInfoModel = Mongoose.model("channelinfos", channelInfoSchema);
    const subscribedChannels = await ChannelInfoModel.find({ followedBy: { $in: [userId] } }).select(['id', 'label']);

    return {
      status: "success",
      response: subscribedChannels || []
    };
  };

  MongoApis.getUserBasicInfo = async (userId) => {
    const BasicInfoModel = Mongoose.model("userbasicinfos", basicInfoSchema);
    const basicInfo = await BasicInfoModel.findOne({ userId });

    if (basicInfo) {
      return {
        status: "success",
        response: basicInfo
      };
    }
    return {
      status: "failure"
    }
  };


  MongoApis.getFollowInfo = async (userId) => {
    const FollowInfoModel = Mongoose.model("followinfos", followInfoSchema);
    const UserModel = Mongoose.model("users", userSchema);
    const user = await UserModel.findOne({ id: userId });

    if (user) {
      const followedByInfo = await FollowInfoModel.find({ userId }).select('followedBy');
      const followerOfInfo = await FollowInfoModel.find({ followedBy: userId }).select('userId');

      const folByRes = followedByInfo.reduce((acc, item) => [...acc, item.followedBy], []);
      const folOfRes = followerOfInfo.reduce((acc, item) => [...acc, item.userId], []);

      return {
        status: "success",
        response: {
          followedBy: folByRes,
          followerOf: folOfRes,
        }
      }
    }
    return {
      status: "user_not_found"
    }
  };


  /*
    MongoApis.getAllAvailableEmployees = async () => {
      const UserModel = Mongoose.model("employees", empSchema);
      const employees = await UserModel.find({ 'teamId': "" }).sort('firstName').exec();
      if (employees && employees.length) {
        const mappedEmps = [];
        for (let i = 0; i < employees.length; i += 1) {
          mappedEmps.push({
            id: employees[i].id,
            firstName: employees[i].firstName,
            lastName: employees[i].lastName,
          })
        }
        console.log(mappedEmps);
        return mappedEmps;
      }
      return [];
    };

    MongoApis.registerTeam = async (userId, team, label, problemId) => {
      const UserModel = Mongoose.model("employees", empSchema);
      const TeamModel = Mongoose.model("teams", teamSchema);
      const user = await UserModel.findOne({ 'id': userId });
      const alreadyAssignedUsers = [];
      const teamUsers = [];
      let teamInfo = {};
      let status = "";

      if (user) {
        if (!user.teamId) {
          const records = await UserModel.find({ id: { $in: team } }).exec();
          if (records && records.length) {
            const alreadyAssigned = [];
            records.forEach((record) => {
              if (record.teamId) {
                alreadyAssigned.push(record);
                alreadyAssignedUsers.push({
                  id: record.id,
                  firstName: record.firstName,
                  lastName: record.lastName,
                })
              }
              teamUsers.push({
                id: record.id,
                firstName: record.firstName,
                lastName: record.lastName,
              })
            });
            teamUsers.push({
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
            });

            if (!alreadyAssigned.length) {
              let teamRep = new TeamModel({
                id: Math.floor(Math.random() * 100000) + "",
                createdOn: new Date().getTime() + "",
                name: label,
                captain: userId,
                problemId
              });
              const teamFromDB = await teamRep.save();
              await UserModel.updateMany({ id: { $in: [...team, user.id] } }, { teamId: teamFromDB.id }).exec();
              teamInfo.id = teamFromDB.id;
              teamInfo.label = label;
              teamInfo.team = teamUsers;
              teamInfo.problemId = teamFromDB.problemId;
              status = "yay";
              sendRegistrationSuccessMails(Mongoose, records, user, label);
            } else {
              status = "alreadyassigned";
            }
          } else {
            status = "noteam"
          }
        } else {
          status = "nay";
        }
      } else {
        status = "oops";
      }

      return { status, alreadyAssignedUsers, teamInfo };
    };

    MongoApis.getTeamByUserId = async (userId) => {
      const UserModel = Mongoose.model("employees", empSchema);
      const TeamModel = Mongoose.model("teams", teamSchema);
      const user = await UserModel.findOne({ 'id': userId }).exec();
      const alreadyAssignedUsers = [];
      const teamUsers = [];
      let teamInfo = {};
      let status = "";

      if (user) {
        if (user.teamId) {
          const records = await UserModel.find({ teamId: user.teamId }).exec();
          const team = await TeamModel.findOne({ id: user.teamId }).exec();

          if (records && records.length) {
            records.forEach((record) => {
              teamUsers.push({
                id: record.id,
                firstName: record.firstName,
                lastName: record.lastName,
              })
            });
          }
          teamInfo.id = team.id;
          teamInfo.label = team.name;
          teamInfo.problemId = team.problemId;
          teamInfo.team = teamUsers;
          status = "yay";
        } else {
          status = "nay";
        }
      } else {
        status = "oops";
      }

      return { status, alreadyAssignedUsers, teamInfo };
    };

    MongoApis.postFeedback = async (name, feedback) => {
      const FeedbackModel = Mongoose.model("feedback", feedbackSchema);
      let feedbackRep = new FeedbackModel({
        id: Math.floor(Math.random() * 100000) + "",
        createdOn: new Date().getTime() + "",
        name: name,
        text: feedback
      });
      await feedbackRep.save();
      return {
        status: "yay"
      }
    };

    MongoApis.getTeamsInfo = async () => {
      const TeamsModel = Mongoose.model("teams", teamSchema);
      const UserModel = Mongoose.model("employees", empSchema);
      const teams = await TeamsModel.find({}).exec();
      const res = [];

      for (let i = 0; i < teams.length; i += 1) {
        const { id, name, captain, createdOn, problemId } = teams[i];
        const records = await UserModel.find({ teamId: id }).exec();
        const teamMembers = [];

        if (records && records.length) {
          records.forEach((record) => {
            teamMembers.push({
              id: record.id,
              firstName: record.firstName,
              lastName: record.lastName,
            })
          });
        }

        res.push({
          id,
          name,
          captain,
          createdOn,
          problemId,
          members: teamMembers
        })
      }
      return res;
    };

    MongoApis.getFeedbackInfo = async () => {
      const FeedbackModel = Mongoose.model("feedback", feedbackSchema);
      return await FeedbackModel.find({}).exec();
    };
    */
});

module.exports = { MongoApis: MongoApis };
