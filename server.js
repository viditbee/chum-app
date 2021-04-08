const express = require("express");
const path = require('path');
const app = express();
const port = 80;
const bodyParser = require('body-parser');
const { MongoApis } = require('./mongo');

const http = require('http').Server(app);
const io = require('socket.io')(http);

const { decipher } = require('./encrypt');
const SECRET_SALT_DATA_TRANSFER = "ANT";
const decipherFunc = decipher(SECRET_SALT_DATA_TRANSFER);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build')));

app.post("/service/signin", (req, res) => {
  const { username, password } = req.body;
  const decryptedUsername = decipherFunc(username || "temp");
  const decryptedPassword = decipherFunc(password || "temp");

  MongoApis.authenticateUser(decryptedUsername, decryptedPassword).then((op) => {
    res.status(200);
    res.send(op);
  });
});

app.post("/service/signup", (req, res) => {
  const { username, firstName, lastName } = req.body;
  MongoApis.registerUser(username, firstName, lastName).then((op) => {
    res.status(200);
    res.send(op);
  });
});

app.get("/service/interests", (req, res) => {
  MongoApis.getAllInterests().then((op) => {
    res.status(200);
    res.send(op);
  });
});

app.post("/service/interests/add", (req, res) => {
  const { label } = req.body;
  MongoApis.addInterest(label).then((op) => {
    res.status(200);
    res.send(op);
  });
});


app.post("/service/userBasicInfo", (req, res) => {
  const { basicInfo } = req.body;
  MongoApis.updateUserBasicInfo(basicInfo).then((op) => {
    res.status(200);
    res.send(op);
  });
});

app.post("/service/followUser", (req, res) => {
  const { userId, followedBy } = req.body;
  MongoApis.followUser(userId, followedBy).then((op) => {
    res.status(200);
    res.send(op);
  });
});

app.post("/service/unFollowUser", (req, res) => {
  const { userId, followedBy } = req.body;
  MongoApis.unFollowUser(userId, followedBy).then((op) => {
    res.status(200);
    res.send(op);
  });
});

app.post("/service/addFeed", (req, res) => {
  const { userId, post, channelId } = req.body;
  MongoApis.addFeed(userId, post, channelId).then((op) => {
    res.status(200);
    res.send(op);
  });
});

app.get("/service/followInfo/:userId", (req, res) => {
  MongoApis.getFollowInfo(req.params.userId).then((op) => {
    res.status(200);
    res.send(op);
  });
});


app.get("/service/userBasicInfo/:userId", (req, res) => {
  MongoApis.getUserBasicInfo(req.params.userId).then((op) => {
    res.status(200);
    res.send(op);
  });
});


app.get("/service/subscribedChannels/:userId", (req, res) => {
  MongoApis.getSubscribedChannels(req.params.userId).then((op) => {
    res.status(200);
    res.send(op);
  });
});

app.get("/service/usersToFollow/:userId", (req, res) => {
  MongoApis.getUsersToFollow(req.params.userId).then((op) => {
    res.status(200);
    res.send(op);
  });
});

app.get("/service/allUsers", (req, res) => {
  MongoApis.getAllUsers().then((op) => {
    res.status(200);
    res.send(op);
  });
});

app.get("/service/allChannels", (req, res) => {
  MongoApis.getAllChannels().then((op) => {
    res.status(200);
    res.send(op);
  });
});

app.get("/service/allEvents", (req, res) => {
  MongoApis.getAllEvents().then((op) => {
    res.status(200);
    res.send(op);
  });
});

app.post("/service/getFeeds", (req, res) => {
  const { userId, channelId } = req.body;
  MongoApis.getFeeds(userId, channelId).then((op) => {
    res.status(200);
    res.send(op);
  });
});

app.post("/service/likeFeed", (req, res) => {
  const { userId, feedId } = req.body;
  MongoApis.likeFeed(userId, feedId).then((op) => {
    res.status(200);
    res.send(op);
  });
});

app.post("/service/followChannel", (req, res) => {
  const { userId, channelId } = req.body;
  MongoApis.followChannel(userId, channelId).then((op) => {
    res.status(200);
    res.send(op);
  });
});

app.post("/service/createChannel", (req, res) => {
  const { userId, label, description } = req.body;
  MongoApis.createChannel(userId, label, description).then((op) => {
    res.status(200);
    res.send(op);
  });
});

app.post("/service/followEvent", (req, res) => {
  const { userId, eventId } = req.body;
  MongoApis.followEvent(userId, eventId).then((op) => {
    res.status(200);
    res.send(op);
  });
});

app.post("/service/createEvent", (req, res) => {
  const { userId, label, description, from, to } = req.body;
  MongoApis.createEvent(userId, label, description, from, to).then((op) => {
    res.status(200);
    res.send(op);
  });
});



/********************** DEVLOPERS ***********************/

app.post("/secret/reset-interests", (req, res) => {
  const { interests } = req.body;
  console.log("iji");
  MongoApis.resetInterests(interests).then((op) => {
    res.status(200);
    res.send(op);
  });
});

/********************** DEVLOPERS ***********************/




app.get("/*", (req, res) => {
  res.sendFile(__dirname + "/build/index.html");
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on("hello", (data) => {
    console.log("HAHHAHAAHA", data);
  });
});

http.listen(process.env.PORT || port, () => {
  console.log("Server listening on port " + port);
});
