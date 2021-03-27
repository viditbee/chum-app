const nodemailer = require("nodemailer");

const getTransporter = (username, password) => {
  return nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: username,
      pass: password,
    },
  });
};

const sendMail = (transporter, from, to, subject, text, html) => {
  return transporter.sendMail({
    from: from,
    to: to,
    subject: subject,
    text: text,
    html: html,
    attachments: [
      {
        filename: 'mail-bg.png',
        path: __dirname + '/mail-bg.png',
        cid: 'mail-bg.png'
      }
    ]
  });
};

module.exports = {
  getTransporter, sendMail
};
