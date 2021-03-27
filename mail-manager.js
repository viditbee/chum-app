const { empSchema, teamSchema } = require("./schemas");
const { getTransporter, sendMail } = require("./mailer");
const { cipher, decipher } = require('./encrypt');
const { getHTMLforAddedToTeamMail, getTextforAddedToTeamMail, getHTMLforTeamCreatedMail, getTextforTeamCreatedMail } = require('./mail-htmls');
// const USERNAME = "hackathon.contentserv@gmail.com";
// const PASSWORD = "aurkyamazey1";
const USERNAME = "hackathon@contentserv.com";
const PASSWORD = "Cov22272";
const SECRET_SALT = "BLACKPEPPER";

const checkConnectivity = (successCallback) => {
  const transporter = getTransporter(USERNAME, PASSWORD);
  transporter.verify(async function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
      successCallback();
    }
  });
};

const sendRegSuccessMails = async (Mongoose, teamMates, createdBy, teamLabel) => {
  const subject = "Congratulations!";
  const transporter = getTransporter(USERNAME, PASSWORD);
  if (teamMates && teamMates.length) {
    let teamMateNames = [];
    for (let i = 0; i < teamMates.length; i += 1) {
      const { id, firstName, lastName, emailId } = teamMates[i];
      const HTML = getHTMLforAddedToTeamMail(firstName, teamLabel, createdBy.firstName);
      const text = getTextforAddedToTeamMail(firstName, teamLabel, createdBy.firstName);
      teamMateNames.push(`${firstName} ${lastName}`);
      sendMail(transporter, USERNAME, emailId, subject, text, HTML);
    }
    const teamMatesStr = teamMateNames.join(", ");
    const HTMLSelf = getHTMLforTeamCreatedMail(createdBy.firstName, teamLabel, teamMatesStr);
    const textSelf = getTextforTeamCreatedMail(createdBy.firstName, teamLabel, teamMatesStr);
    sendMail(transporter, USERNAME, createdBy.emailId, subject, textSelf, HTMLSelf);
  }
};

const sendRegistrationSuccessMails = async (Mongoose, teamMates, createdBy, teamLabel) => {
  checkConnectivity(sendRegSuccessMails.bind(this, Mongoose, teamMates, createdBy, teamLabel));
};

module.exports = {
  sendRegistrationSuccessMails
};
