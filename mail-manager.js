const { getTransporter, sendMail } = require("./mailer");
const { cipher } = require('./encrypt');
const { getHTMLforSignUpSuccess } = require('./mail-htmls');
const USERNAME = "hackathon.contentserv@gmail.com";
const PASSWORD = "aurkyamaze1";
const SECRET_SALT_FOR_PASSWORD = "BEE";

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

const sendSignUpSuccess = async (firstName, lastName, emailId) => {
  const cipherFunc = cipher(SECRET_SALT_FOR_PASSWORD);
  const subject = "Congratulations!";
  const transporter = getTransporter(USERNAME, PASSWORD);
  const password = cipherFunc(emailId);
  const HTML = getHTMLforSignUpSuccess(firstName, emailId, password);
  sendMail(transporter, USERNAME, emailId, subject, HTML);
};

const sendSignupSuccessMail = (user) => {
  checkConnectivity(sendSignUpSuccess.bind(this, user.firstName, user.lastName, user.emailId))
};

module.exports = {
  sendSignupSuccessMail
};
