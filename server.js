const express = require("express");
const path = require('path');
const app = express();
const port = 80;
const bodyParser = require('body-parser');
const { MongoApis } = require('./mongo');

const { decipher } = require('./encrypt');
const SECRET_SALT_DATA_TRANSFER = "ANT";
const decipherFunc = decipher(SECRET_SALT_DATA_TRANSFER);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build')));

app.post("/service/signin", (req, res) => {
  const { username, password } = req.body;
  const decryptedUsername = decipherFunc(username);
  const decryptedPassword = decipherFunc(password);

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

app.get("/*", (req, res) => {
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(process.env.PORT || port, () => {
  console.log("Server listening on port " + port);
});
