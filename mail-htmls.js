const getHTMLforSignUpSuccess = (firstName, emailId, password) => `<div>Hi ${firstName}, you have been successfully registered to Chum. Please use the following credentials to login. <p>Username: ${emailId}</p><p>Password: ${password}</p></div>`;

module.exports = {
  getHTMLforSignUpSuccess
};
