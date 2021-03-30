const nodemailer = require("nodemailer");

/*const getTransporter = (username, password) => {
  return nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: username,
      pass: password,
    },
  });
};*/

const getTransporter = (username, password) => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: username,
      pass: password,
    },
  });
};

const sendMail = (transporter, from, to, subject, html) => {
  return transporter.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: html,
  });
};

module.exports = {
  getTransporter, sendMail
};
