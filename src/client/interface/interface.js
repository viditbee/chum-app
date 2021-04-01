const { cipher } = require('./../utils/encrypt');
const SECRET_SALT_DATA_TRANSFER = "ANT";
const cipherFunc = cipher(SECRET_SALT_DATA_TRANSFER);

const getCall = async (url) => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    },
  });
  return res.json();
};

const postCall = async (url, data) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const requestSignin = (uName = "", pwd = "") => {
  const username = cipherFunc(uName);
  const password = cipherFunc(pwd);
  return postCall('/service/signin', { username, password });
};

export const requestSignup = (username, firstName, lastName) => {
  return postCall('/service/signup', { username, firstName, lastName });
};

export const getInterestsList = () => {
  return getCall('/service/interests');
};

export const addNewInterest = (label) => {
  return postCall('/service/interests/add', { label });
};

export const updateUserBasicInfo = (basicInfo) => {
  return postCall('/service/userBasicInfo', { basicInfo });
};
