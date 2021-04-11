const Mongoose = require("mongoose");
const database = "chumtest";
const url = `mongodb+srv://vidit:newPass4atlas@cluster0.ts0zq.mongodb.net/${database}?retryWrites=true&w=majority`;
const { userSchema, interestSchema, basicInfoSchema, followInfoSchema, channelInfoSchema, postsSchema, eventInfoSchema } = require("./schemas");
const MongoApis = {};
const { decipher } = require('./encrypt');
const SECRET_SALT_FOR_PASSWORD = "BEE";
const { sendSignupSuccessMail } = require('./mail-manager');
const { validateEmail } = require('./utils');
const DefChannels = require('./src/facts/def-channels');

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
          id: Math.floor(Math.random() * 100000000) + "",
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
    const id = "cust_" + Math.floor(Math.random() * 10000000);

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

  MongoApis.followUser = async (userId, followedBy) => {
    const FollowInfoModel = Mongoose.model("followinfos", followInfoSchema);
    const followRep = new FollowInfoModel({
      userId, followedBy
    });
    await followRep.save();

    return {
      status: "success"
    }
  };

  MongoApis.unFollowUser = async (userId, followedBy) => {
    const FollowInfoModel = Mongoose.model("followinfos", followInfoSchema);
    await FollowInfoModel.deleteOne({ userId, followedBy });

    return {
      status: "success"
    }
  };

  MongoApis.getUsersToFollow = async (id, includeFollowed) => {
    const BasicInfoModel = Mongoose.model("userbasicinfos", basicInfoSchema);
    const UserModel = Mongoose.model("users", userSchema);
    const FollowInfoModel = Mongoose.model("followinfos", followInfoSchema);

    try {
      let res = [];
      const followerOfInfo = await FollowInfoModel.find({ followedBy: id }).select('userId');
      const followerOfIds = followerOfInfo.reduce((acc, item) => [...acc, item.userId], []);
      const usersToFollow = await UserModel.find({
        gotStarted: true,
        id: { $nin: includeFollowed ? [id] : [...followerOfIds, id] }
      }).select(['id', 'firstName', 'lastName']);
      const usersToFollowIds = usersToFollow.reduce((acc, item) => [...acc, item.id], []);
      const usersToFollowBasicInfo = await BasicInfoModel.find({ userId: { $in: usersToFollowIds } }).select(['userId', 'location', 'interests']);

      const userBasicInfo = await BasicInfoModel.findOne({ userId: id }).select(['userId', 'location', 'interests']);
      const userInterestIds = userBasicInfo.interests ? userBasicInfo.interests.reduce((acc, item) => [...acc, item.id], []) : [];
      const scoreUserMap = {};

      for (let i = 0; i < usersToFollowBasicInfo.length; i += 1) {
        const { userId, interests, location } = usersToFollowBasicInfo[i];
        let userOb = null;
        let intMatches = 0;

        for (let k = 0; k < usersToFollow.length; k += 1) {
          if (usersToFollow[k].id === userId) {
            userOb = usersToFollow[k];
            break;
          }
        }

        for (let j = 0; j < interests.length; j += 1) {
          if (userInterestIds.indexOf(interests[j].id) !== -1) {
            intMatches++;
          }
        }

        const key = intMatches + "";
        scoreUserMap[key] = scoreUserMap[key] || [];

        const obToPush = {
          userId,
          interests,
          location,
          firstName: userOb.firstName,
          lastName: userOb.lastName,
          following: followerOfIds.indexOf(userId) !== -1
        };

        if (location === userBasicInfo.location) {
          scoreUserMap[key].unshift(obToPush);
        } else {
          scoreUserMap[key].push(obToPush);
        }
      }
      const sorted = Object.keys(scoreUserMap).sort((x, y) => +x < +y ? 1 : -1);

      for (let m = 0; m < sorted.length; m += 1) {
        res = [...res, ...scoreUserMap[sorted[m]]]
      }

      return {
        status: "success",
        response: res
      }
    } catch (e) {
      console.log(e);
      return {
        status: "failure"
      }
    }
  };

  MongoApis.getAllUsersWithBasicInfo = async (uId) => {
    const BasicInfoModel = Mongoose.model("userbasicinfos", basicInfoSchema);
    const UserModel = Mongoose.model("users", userSchema);
    const FollowInfoModel = Mongoose.model("followinfos", followInfoSchema);

    try {
      let res = [];
      const usersBasicInfo = await BasicInfoModel.find({}).select(['userId', 'location', 'interests']);
      const followerOfInfo = await FollowInfoModel.find({ followedBy: uId }).select('userId');
      const followerOfIds = followerOfInfo.reduce((acc, item) => [...acc, item.userId], []);

      for (let i = 0; i < usersBasicInfo.length; i += 1) {
        const { userId, interests, location } = usersBasicInfo[i];
        let userOb = await UserModel.findOne({ id: userId });

        res.push({
          userId,
          interests,
          location,
          firstName: userOb.firstName,
          lastName: userOb.lastName,
          following: followerOfIds.indexOf(userId) !== -1
        });
      }

      return {
        status: "success",
        response: res
      }
    } catch (e) {
      console.log(e);
      return {
        status: "failure"
      }
    }
  };

  MongoApis.addFeed = async (userId, post, channelId) => {
    const PostModel = Mongoose.model("posts", postsSchema);
    const postRep = new PostModel({
      id: Math.floor(Math.random() * 10000000),
      createdOn: new Date(),
      createdBy: userId,
      text: post,
      channelId: channelId
    });
    const savedInst = await postRep.save();

    return {
      status: "success",
      response: savedInst
    }
  };

  MongoApis.getAllUsers = async () => {
    const UserModel = Mongoose.model("users", userSchema);
    const allUsers = await UserModel.find({}).select(['id', 'firstName', 'lastName']);

    return {
      status: "success",
      response: allUsers
    }
  };

  MongoApis.getAllChannels = async () => {
    const ChannelModel = Mongoose.model("channelinfos", channelInfoSchema);
    const allChannels = await ChannelModel.find({}).select(['id', 'label', 'description', 'createdBy', 'createdOn', 'followedBy']);

    return {
      status: "success",
      response: allChannels
    }
  };

  MongoApis.getAllEvents = async () => {
    const EventModel = Mongoose.model("eventinfos", eventInfoSchema);
    const allEvents = await EventModel.find({}).select(['id', 'label', 'description', 'createdBy', 'createdOn', 'followedBy', 'from', 'to']);

    return {
      status: "success",
      response: allEvents
    }
  };

  MongoApis.getFeeds = async (userId, channelId) => {
    const PostModel = Mongoose.model("posts", postsSchema);
    const ChannelModel = Mongoose.model("channelinfos", channelInfoSchema);
    const FollowInfoModel = Mongoose.model("followinfos", followInfoSchema);
    let folOfRes = [];
    let folChanRes = [];

    if (!channelId) {
      const followedChannels = await ChannelModel.find({ followedBy: userId }).select('id');
      folChanRes = followedChannels.reduce((acc, item) => [...acc, item.id], []);
      folChanRes.push(DefChannels.lend);

      const followerOfInfo = await FollowInfoModel.find({ followedBy: userId }).select('userId');
      folOfRes = followerOfInfo.reduce((acc, item) => [...acc, item.userId], []);
      folOfRes.push(userId);
    } else {
      folOfRes = ['admin'];
      folChanRes = [channelId];
    }

    const posts = await PostModel
      .find({ $or: [{ createdBy: { $in: folOfRes } }, { channelId: { $in: folChanRes } }] })
      .sort({ createdOn: 'desc' })
      .select(['id', 'createdOn', 'createdBy', 'channelId', 'text', 'comments', 'likedBy']);

    return {
      status: "success",
      response: posts
    }
  };

  MongoApis.getActivity = async (userId) => {
    const PostModel = Mongoose.model("posts", postsSchema);

    const posts = await PostModel
      .find({ createdBy: userId })
      .sort({ createdOn: 'desc' })
      .select(['id', 'createdOn', 'createdBy', 'channelId', 'text', 'comments', 'likedBy']);

    return {
      status: "success",
      response: posts
    }
  };

  MongoApis.likeFeed = async (userId, feedId) => {
    const PostModel = Mongoose.model("posts", postsSchema);
    let post = await PostModel.findOne({ id: feedId });
    let stat = false;

    if (post) {
      if (post.likedBy.indexOf(userId) !== -1) {
        post.likedBy.splice(post.likedBy.indexOf(userId), 1);
      } else {
        post.likedBy.push(userId);
        stat = true;
      }
      await post.save();
    }

    return {
      status: "success",
      response: stat
    }
  };

  MongoApis.followChannel = async (userId, channelId) => {
    const ChannelModel = Mongoose.model("channelinfos", channelInfoSchema);
    let channel = await ChannelModel.findOne({ id: channelId });
    let stat = false;

    if (channel) {
      if (channel.followedBy.indexOf(userId) !== -1) {
        channel.followedBy.splice(channel.followedBy.indexOf(userId), 1);
      } else {
        channel.followedBy.push(userId);
        stat = true;
      }
      await channel.save();
    }

    return {
      status: "success",
      response: stat
    }
  };

  MongoApis.createChannel = async (userId, label, description) => {
    const ChannelModel = Mongoose.model("channelinfos", channelInfoSchema);
    let channelRes = new ChannelModel({
      id: Math.floor(Math.random() * 10000000),
      createdOn: new Date(),
      createdBy: userId,
      label,
      description,
      followedBy: [userId]
    });

    const savedInst = await channelRes.save();

    return {
      status: "success",
      response: savedInst
    };
  };

  MongoApis.followEvent = async (userId, eventId) => {
    const EventModel = Mongoose.model("eventinfos", eventInfoSchema);
    let event = await EventModel.findOne({ id: eventId });
    let stat = false;

    if (event) {
      if (event.followedBy.indexOf(userId) !== -1) {
        event.followedBy.splice(event.followedBy.indexOf(userId), 1);
      } else {
        event.followedBy.push(userId);
        stat = true;
      }
      await event.save();
    }

    return {
      status: "success",
      response: stat
    }
  };

  MongoApis.createEvent = async (userId, label, description, from, to = null) => {
    const EventModel = Mongoose.model("eventinfos", eventInfoSchema);
    let eventRes = new EventModel({
      id: Math.floor(Math.random() * 10000000),
      createdOn: new Date(),
      createdBy: userId,
      label,
      description,
      followedBy: [userId],
      from,
      to
    });

    const savedInst = await eventRes.save();

    return {
      status: "success",
      response: savedInst
    };
  };

  MongoApis.getUserProfileInfo = async (userId) => {
    const BasicInfoModel = Mongoose.model("userbasicinfos", basicInfoSchema);
    const UserModel = Mongoose.model("users", userSchema);

    const userMainInfo = await UserModel.findOne({ id: userId });
    const userBasicInfo = await BasicInfoModel.findOne({ userId: userId });

    const res = {
      userId: userId,
      firstName: userMainInfo.firstName,
      lastName: userMainInfo.lastName,
    };

    if (userBasicInfo) {
      res.location = userBasicInfo.location;
      res.languages = userBasicInfo.languages;
      res.aboutYou = userBasicInfo.aboutYou;
      res.department = userBasicInfo.department;
      res.interests = userBasicInfo.interests;
    }

    return {
      status: "success",
      response: res
    }
  };

  MongoApis.getUpcomingEvents = async () => {
    const EventModel = Mongoose.model("eventinfos", eventInfoSchema);
    const currentDate = new Date();
    const events = await EventModel.find({ $or: [{ from: { $gt: currentDate } }, { to: { $gt: currentDate } }] })
      .sort({ from: 'asc' })
      .select(['id', 'createdBy', 'createdOn', 'label', 'description', 'followedBy', 'from', 'to']);

    return {
      status: "success",
      response: events
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
