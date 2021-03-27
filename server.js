const express = require("express");
const path = require('path');
const app = express();
const port = 80;
const bodyParser = require('body-parser');
const { MongoApis } = require('./mongo');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build')));

app.post("/service/login", (req, res) => {
  const { username, password } = req.body;
  MongoApis.authenticateUser(username, password).then((op) => {
    res.status(200);
    res.send(op);
  });
});

app.post("/service/teams/register", (req, res) => {
  const { userId, team, label, problemId } = req.body;
  MongoApis.registerTeam(userId, team, label, problemId).then((op) => {
    res.status(200);
    res.send(op);
  });
});

app.post("/service/teams/getbyuserid", (req, res) => {
  const { userId } = req.body;
  MongoApis.getTeamByUserId(userId).then((op) => {
    res.status(200);
    res.send(op);
  });
});

app.get("/service/employees/getallavailable", (req, res) => {
  MongoApis.getAllAvailableEmployees().then((op) => {
    res.status(200);
    res.send(op);
  });
});

app.get("/secret/teams", (req, res) => {
  MongoApis.getTeamsInfo().then((op) => {
    res.status(200);
    res.send(op);
  });
});

app.get("/secret/feedback", (req, res) => {
  MongoApis.getFeedbackInfo().then((op) => {
    res.status(200);
    res.send(op);
  });
});

app.post("/service/feedback", (req, res) => {
  const { name, feedback } = req.body;
  MongoApis.postFeedback(name, feedback).then((op) => {
    res.status(200);
    res.send(op);
  });
});

app.get("/*", (req, res) => {
  res.sendFile(__dirname + "/build/index.html");
});


app.listen(process.env.PORT || port, () => {
  console.log("Server listening on port " + port);
});
