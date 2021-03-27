const Mongoose = require("mongoose");
const schema = "hackathon";
const url = `mongodb+srv://vidit:newPass4mongo@cluster0.gfxr2.mongodb.net/${schema}?retryWrites=true&w=majority`;
const { empSchema, teamSchema, feedbackSchema } = require("./schemas");
const MongoApis = {};
const { cipher, decipher } = require('./encrypt');
const SECRET_SALT = "BLACKPEPPER";
const { sendRegistrationSuccessMails } = require('./mail-manager');

Mongoose.connect(url, async function () {

  Mongoose.Promise = global.Promise;

  MongoApis.authenticateUser = async (username, password) => {
    const UserModel = Mongoose.model("employees", empSchema);
    const user = await UserModel.findOne({ 'emailId': username });
    const decipherer = decipher(SECRET_SALT);
    if (user) {
      if (decipherer(password) === username) {
        return {
          status: "yay",
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          teamId: user.teamId,
          hakuna: user.admin ? "tamata" : "matata"
        };
      }
      return {
        status: "nay"
      }
    } else {
      return {
        status: "oops"
      }
    }
  };

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
});

module.exports = { MongoApis: MongoApis };
