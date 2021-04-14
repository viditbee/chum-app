const express = require("express");
const path = require('path');
const app = express();
const port = 80;
const bodyParser = require('body-parser');
const { MongoApis } = require('./mongo');
const { decipher } = require('./encrypt');
const SECRET_SALT_DATA_TRANSFER = "ANT";
const decipherFunc = decipher(SECRET_SALT_DATA_TRANSFER);
const http = require('http').Server(app);

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Chum App - Swagger",
      version: "0.1.0",
      description: "Chum is made with Node, Express & Mongo, documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
    },
  },
  apis: ["./server.js"],
};

const { initiate } = require('./socket');
initiate(http);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build')));

const authenticateReq = (userId, headers) => {
  const token = headers.securetoken;
  return decipherFunc(token) === userId;
};

const withSecurity = (cb) => {
  return (req, res) => {
    const userId = (req.body && req.body.userId) || req.params.userId || "";
    if (authenticateReq(userId, req.headers)) {
      cb(req, res);
    } else {
      res.status(401);
      res.send("Hackers are taken care of :P");
    }
  }
};

/**
 * @swagger
 * /service/signin:
 *   post:
 *     summary: API for signing-in to Chum
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Encrypted username (email-id) of the user to prevent MIM attack
 *                 example: WDW987808WDEDED0980OIWQW23
 *               password:
 *                 type: string
 *                 description: Encrypted password for signing in
 *                 example: KSDS20JHIUH878JH23HUHO
 *     responses:
 *      200:
 *        description: Successful sign-in
 */
app.post("/service/signin", (req, res) => {
  const { username, password } = req.body;
  const decryptedUsername = decipherFunc(username || "temp");
  const decryptedPassword = decipherFunc(password || "temp");

  MongoApis.authenticateUser(decryptedUsername, decryptedPassword).then((op) => {
    res.status(200);
    res.send(op);
  });
});

/**
 * @swagger
 * /service/signup:
 *   post:
 *     summary: API for registering to Chum
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username (email-id) of the user
 *                 example: brian.adams@contentserv.com
 *               firstName:
 *                 type: string
 *                 description: First name of the user
 *                 example: Brian
 *               lastName:
 *                 type: string
 *                 description: Last name of the user
 *                 example: Adams
 *     responses:
 *      200:
 *        description: Successful sign-up
 */
app.post("/service/signup", (req, res) => {
  const { username, firstName, lastName } = req.body;
  MongoApis.registerUser(username, firstName, lastName).then((op) => {
    res.status(200);
    res.send(op);
  });
});

/**
 * @swagger
 * /service/interests:
 *   get:
 *     summary: Fetch list of all interests
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: OJODEDN
 *                   label:
 *                     type: string
 *                     example: Badminton
 */
app.get("/service/interests", (req, res) => {
  MongoApis.getAllInterests().then((op) => {
    res.status(200);
    res.send(op);
  });
});

/**
 * @swagger
 * /service/interests/add:
 *   post:
 *     summary: API for adding an interest to the app
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *                 description: Name of the interest
 *                 example: Chess
 *     responses:
 *      200:
 *        description: Successful addition of interest to the app
 */
app.post("/service/interests/add", (req, res) => {
  const { label } = req.body;
  MongoApis.addInterest(label).then((op) => {
    res.status(200);
    res.send(op);
  });
});


/**
 * @swagger
 * /service/userBasicInfo:
 *   post:
 *     summary: API for saving basic information of the user like location, interests etc.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: OJODEDN
 *               location:
 *                 type: string
 *                 example: in
 *               department:
 *                 type: string
 *                 example: pr-eng
 *               languages:
 *                 type: array
 *                 example: []
 *               aboutYou:
 *                 type: string
 *                 example: Hey! This is Brian Adams.
 *               interests:
 *                 type: array
 *                 example: []
 *     responses:
 *      200:
 *        description: Successful save of user information
 */
app.post("/service/userBasicInfo", withSecurity((req, res) => {
  const { basicInfo } = req.body;
  MongoApis.updateUserBasicInfo(basicInfo).then((op) => {
    res.status(200);
    res.send(op);
  });
}));

/**
 * @swagger
 * /service/followUser:
 *   post:
 *     summary: API for registering a follower of a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: WDW987808WDEDED0980OIWQW23
 *               followedBy:
 *                 type: string
 *                 example: KSDS20JHIUH878JH23HUHO
 *     responses:
 *      200:
 *        description: Successful save/update
 */
app.post("/service/followUser", withSecurity((req, res) => {
  const { userId, followedBy } = req.body;
  MongoApis.followUser(userId, followedBy).then((op) => {
    res.status(200);
    res.send(op);
  });
}));

/**
 * @swagger
 * /service/unFollowUser:
 *   post:
 *     summary: API for removing a follower of a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: WDW987808WDEDED0980OIWQW23
 *               followedBy:
 *                 type: string
 *                 example: KSDS20JHIUH878JH23HUHO
 *     responses:
 *      200:
 *        description: Successful save/update
 */
app.post("/service/unFollowUser", withSecurity((req, res) => {
  const { userId, followedBy } = req.body;
  MongoApis.unFollowUser(userId, followedBy).then((op) => {
    res.status(200);
    res.send(op);
  });
}));

/**
 * @swagger
 * /service/addFeed:
 *   post:
 *     summary: API for adding a feed to home page / channel / lend a hand
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: WDW987808WDEDED0980OIWQW23
 *               post:
 *                 type: string
 *                 example: Hey there! Anybody up for swimming this weekend?
 *               channelId:
 *                 type: string
 *                 example: KSDS20JHIUH878JH23HUHO
 *     responses:
 *      200:
 *        description: Successful save/update
 */
app.post("/service/addFeed", withSecurity((req, res) => {
  const { userId, post, channelId } = req.body;
  MongoApis.addFeed(userId, post, channelId).then((op) => {
    res.status(200);
    res.send(op);
  });
}));

/**
 * @swagger
 * /service/followInfo/:userId:
 *   get:
 *     summary: Fetch followers and following info of a user
 *     responses:
 *       200:
 *         description: Followers and following info of a user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   followedBy:
 *                     type: array
 *                     example: [OIJDEIJDE, WDDJIJDED, EDIJEDJ]
 *                   followerOf:
 *                     type: array
 *                     example: [OIJDEIJDE, WDDJIJDED, EDIJEDJ]
 */
app.get("/service/followInfo/:userId", withSecurity((req, res) => {
  MongoApis.getFollowInfo(req.params.userId).then((op) => {
    res.status(200);
    res.send(op);
  });
}));

/**
 * @swagger
 * /service/userBasicInfo/:userId:
 *   get:
 *     summary: Fetch basic information like location, interests of a user
 *     responses:
 *       200:
 *         description: Basic information like location, interests of a user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: OJODEDN
 *                 location:
 *                   type: string
 *                   example: in
 *                 department:
 *                   type: string
 *                   example: pr-eng
 *                 languages:
 *                   type: array
 *                   example: []
 *                 aboutYou:
 *                   type: string
 *                   example: Hey! This is Brian Adams.
 *                 interests:
 *                   type: array
 *                   example: []
 */
app.get("/service/userBasicInfo/:userId", withSecurity((req, res) => {
  MongoApis.getUserBasicInfo(req.params.userId).then((op) => {
    res.status(200);
    res.send(op);
  });
}));

/**
 * @swagger
 * /service/subscribedChannels/:userId:
 *   get:
 *     summary: Fetch subscribed channels of a user
 *     responses:
 *       200:
 *         description: A list of channels.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: OJODEDN
 *                   label:
 *                     type: string
 *                     example: Badminton Club
 */
app.get("/service/subscribedChannels/:userId", withSecurity((req, res) => {
  MongoApis.getSubscribedChannels(req.params.userId).then((op) => {
    res.status(200);
    res.send(op);
  });
}));


/**
 * @swagger
 * /service/usersToFollow/:userId:
 *   get:
 *     summary: Fetch recommended users to follow
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     example: OJODEDN
 *                   firstName:
 *                     type: string
 *                     example: Rowan
 *                   lastName:
 *                     type: string
 *                     example: Atkinson
 *                   interests:
 *                     type: array
 *                     example: [OIWFWOEIJE, EWFEOFEWOFIFWE, WEFWEFIOEFJEW]
 *                   location:
 *                     type: string
 *                     example: eng
 *                   following:
 *                     type: array
 *                     example: [SDUFSDFDF, QOWIUQW83I, EOIWUEROEIURW]
 */
app.get("/service/usersToFollow/:userId", withSecurity((req, res) => {
  MongoApis.getUsersToFollow(req.params.userId).then((op) => {
    res.status(200);
    res.send(op);
  });
}));

/**
 * @swagger
 * /service/allUsers:
 *   get:
 *     summary: Fetch all users
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: OJODEDN
 *                   firstName:
 *                     type: string
 *                     example: Rowan
 *                   lastName:
 *                     type: string
 *                     example: Atkinson
 */
app.get("/service/allUsers", (req, res) => {
  MongoApis.getAllUsers().then((op) => {
    res.status(200);
    res.send(op);
  });
});

/**
 * @swagger
 * /service/allChannels:
 *   get:
 *     summary: Fetch all channels
 *     responses:
 *       200:
 *         description: A list of channels.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: OJODEDN
 *                   label:
 *                     type: string
 *                     example: Pet Corner
 *                   description:
 *                     type: string
 *                     example: This channel id for Pet lovers
 *                   createdBy:
 *                     type: string
 *                     example: JDIOJED
 *                   createdOn:
 *                     type: date
 *                     example: 12th March 2021
 *                   followedBy:
 *                     type: array
 *                     example: [DIJOIFJIOF, SDJKFHODFJOIDF, DSFDFSF]
 */
app.get("/service/allChannels", (req, res) => {
  MongoApis.getAllChannels().then((op) => {
    res.status(200);
    res.send(op);
  });
});

/**
 * @swagger
 * /service/allEvents:
 *   get:
 *     summary: Fetch all events
 *     responses:
 *       200:
 *         description: A list of events.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: OJODEDN
 *                   label:
 *                     type: string
 *                     example: Covid Vaccination Drive
 *                   description:
 *                     type: string
 *                     example: All are invited for vaccination drive
 *                   createdBy:
 *                     type: string
 *                     example: JDIOJED
 *                   createdOn:
 *                     type: date
 *                     example: 12th March 2021
 *                   followedBy:
 *                     type: array
 *                     example: [DIJOIFJIOF, SDJKFHODFJOIDF, DSFDFSF]
 *                   from:
 *                     type: date
 *                     example: 10th March 2021
 *                   to:
 *                     type: date
 *                     example: 12th March 2021
 */
app.get("/service/allEvents", (req, res) => {
  MongoApis.getAllEvents().then((op) => {
    res.status(200);
    res.send(op);
  });
});

/**
 * @swagger
 * /service/getFeeds:
 *   post:
 *     summary: API for fetching feeds by user id and channel id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: WDW987808WDEDED0980OIWQW23
 *               channelId:
 *                 type: string
 *                 example: KSDS20JHIUH878JH23HUHO
 *     responses:
 *       200:
 *         description: A list of posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: OJODEDN
 *                   text:
 *                     type: string
 *                     example: Hey, whatsup chums!
 *                   createdBy:
 *                     type: string
 *                     example: JDIOJED
 *                   createdOn:
 *                     type: date
 *                     example: 12th March 2021
 *                   likedBy:
 *                     type: array
 *                     example: [DIJOIFJIOF, SDJKFHODFJOIDF, DSFDFSF]
 *                   channelId:
 *                     type: string
 *                     example: OKIJO
 *                   comments:
 *                     type: array
 *                     example: []
 */
app.post("/service/getFeeds", withSecurity((req, res) => {
  const { userId, channelId } = req.body;
  MongoApis.getFeeds(userId, channelId).then((op) => {
    res.status(200);
    res.send(op);
  });
}));

/**
 * @swagger
 * /service/getActivity:
 *   post:
 *     summary: API for fetching activity of a user by user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: WDW987808WDEDED0980OIWQW23
 *     responses:
 *       200:
 *         description: A list of posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: OJODEDN
 *                   text:
 *                     type: string
 *                     example: Hey, whatsup chums!
 *                   createdBy:
 *                     type: string
 *                     example: JDIOJED
 *                   createdOn:
 *                     type: date
 *                     example: 12th March 2021
 *                   likedBy:
 *                     type: array
 *                     example: [DIJOIFJIOF, SDJKFHODFJOIDF, DSFDFSF]
 *                   channelId:
 *                     type: string
 *                     example: OKIJO
 *                   comments:
 *                     type: array
 *                     example: []
 */
app.post("/service/getActivity", withSecurity((req, res) => {
  const { userId } = req.body;
  MongoApis.getActivity(userId).then((op) => {
    res.status(200);
    res.send(op);
  });
}));


/**
 * @swagger
 * /service/likeFeed:
 *   post:
 *     summary: API for adding an entry of like for a post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: WDW987808WDEDED0980OIWQW23
 *               feedId:
 *                 type: string
 *                 example: KSDS20JHIUH878JH23HUHO
 *     responses:
 *      200:
 *        description: Successful save/update
 */
app.post("/service/likeFeed", withSecurity((req, res) => {
  const { userId, feedId } = req.body;
  MongoApis.likeFeed(userId, feedId).then((op) => {
    res.status(200);
    res.send(op);
  });
}));

/**
 * @swagger
 * /service/followChannel:
 *   post:
 *     summary: API for adding an entry of follow for a channel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: WDW987808WDEDED0980OIWQW23
 *               channelId:
 *                 type: string
 *                 example: KSDS20JHIUH878JH23HUHO
 *     responses:
 *      200:
 *        description: Successful save/update
 */
app.post("/service/followChannel", withSecurity((req, res) => {
  const { userId, channelId } = req.body;
  MongoApis.followChannel(userId, channelId).then((op) => {
    res.status(200);
    res.send(op);
  });
}));

/**
 * @swagger
 * /service/createChannel:
 *   post:
 *     summary: API for creating a new channel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: WDW987808WDEDED0980OIWQW23
 *               label:
 *                 type: string
 *                 example: Swimming Club
 *               description:
 *                 type: string
 *                 example: Sample description
 *     responses:
 *      200:
 *        description: Successful save/update
 */
app.post("/service/createChannel", withSecurity((req, res) => {
  const { userId, label, description } = req.body;
  MongoApis.createChannel(userId, label, description).then((op) => {
    res.status(200);
    res.send(op);
  });
}));


/**
 * @swagger
 * /service/followEvent:
 *   post:
 *     summary: API for adding an entry of attending (RSVP) for an event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: WDW987808WDEDED0980OIWQW23
 *               eventId:
 *                 type: string
 *                 example: KSDS20JHIUH878JH23HUHO
 *     responses:
 *      200:
 *        description: Successful save/update
 */
app.post("/service/followEvent", withSecurity((req, res) => {
  const { userId, eventId } = req.body;
  MongoApis.followEvent(userId, eventId).then((op) => {
    res.status(200);
    res.send(op);
  });
}));

/**
 * @swagger
 * /service/createEvent:
 *   post:
 *     summary: API for creating a new event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: WDW987808WDEDED0980OIWQW23
 *               label:
 *                 type: string
 *                 example: Covid Vaccination Drive
 *               description:
 *                 type: string
 *                 example: Sample description
 *               from:
 *                 type: date
 *                 example: 10th March 2021
 *               to:
 *                 type: date
 *                 example: 12th March 2021
 *     responses:
 *      200:
 *        description: Successful save/update
 */
app.post("/service/createEvent", withSecurity((req, res) => {
  const { userId, label, description, from, to } = req.body;
  MongoApis.createEvent(userId, label, description, from, to).then((op) => {
    res.status(200);
    res.send(op);
  });
}));


/**
 * @swagger
 * /service/userProfileInfo/:userId:
 *   get:
 *     summary: Fetch profile information like name, location, interests of a user
 *     responses:
 *       200:
 *         description: Profile information like name, location, interests of a user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: OJODEDN
 *                 firstName:
 *                   type: string
 *                   example: Britney
 *                 lastName:
 *                   type: string
 *                   example: Spears
 *                 location:
 *                   type: string
 *                   example: in
 *                 department:
 *                   type: string
 *                   example: pr-eng
 *                 languages:
 *                   type: array
 *                   example: []
 *                 aboutYou:
 *                   type: string
 *                   example: Hey! This is Brian Adams.
 *                 interests:
 *                   type: array
 *                   example: []
 */
app.get("/service/userProfileInfo/:userId", withSecurity((req, res) => {
  MongoApis.getUserProfileInfo(req.params.userId).then((op) => {
    res.status(200);
    res.send(op);
  });
}));

/**
 * @swagger
 * /service/upcomingEvents:
 *   get:
 *     summary: Fetch all running or upcoming events
 *     responses:
 *       200:
 *         description: A list of events.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: OJODEDN
 *                   label:
 *                     type: string
 *                     example: Covid Vaccination Drive
 *                   description:
 *                     type: string
 *                     example: All are invited for vaccination drive
 *                   createdBy:
 *                     type: string
 *                     example: JDIOJED
 *                   createdOn:
 *                     type: date
 *                     example: 12th March 2021
 *                   followedBy:
 *                     type: array
 *                     example: [DIJOIFJIOF, SDJKFHODFJOIDF, DSFDFSF]
 *                   from:
 *                     type: date
 *                     example: 10th March 2021
 *                   to:
 *                     type: date
 *                     example: 12th March 2021
 */
app.get("/service/upcomingEvents", (req, res) => {
  MongoApis.getUpcomingEvents().then((op) => {
    res.status(200);
    res.send(op);
  });
});

/**
 * @swagger
 * /service/usersWithBasicInfo/:
 *   get:
 *     summary: Fetch all users with basic info and follow info
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     example: OJODEDN
 *                   firstName:
 *                     type: string
 *                     example: Rowan
 *                   lastName:
 *                     type: string
 *                     example: Atkinson
 *                   interests:
 *                     type: array
 *                     example: [OIWFWOEIJE, EWFEOFEWOFIFWE, WEFWEFIOEFJEW]
 *                   location:
 *                     type: string
 *                     example: eng
 *                   following:
 *                     type: array
 *                     example: [SDUFSDFDF, QOWIUQW83I, EOIWUEROEIURW]
 */
app.post("/service/usersWithBasicInfo", withSecurity((req, res) => {
  const { userId } = req.body;
  MongoApis.getAllUsersWithBasicInfo(userId).then((op) => {
    res.status(200);
    res.send(op);
  });
}));


/********************** DEVLOPERS ***********************/

app.post("/secret/reset-interests", (req, res) => {
  const { interests } = req.body;
  MongoApis.resetInterests(interests).then((op) => {
    res.status(200);
    res.send(op);
  });
});

/********************** DEVLOPERS ***********************/

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

app.get("/*", (req, res) => {
  res.sendFile(__dirname + "/build/index.html");
});

http.listen(process.env.PORT || port, () => {
  console.log("Server listening on port " + port);
});
