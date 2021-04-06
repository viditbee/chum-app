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

export const getFollowInfo = (userId) => {
  return getCall('/service/followInfo/' + userId);
};

export const getUserBasicInfo = (userId) => {
  return getCall('/service/userBasicInfo/' + userId);
};

export const getSubscribedChannels = (userId) => {
  return getCall('/service/subscribedChannels/' + userId);
};

export const followUser = (userId, followedBy) => {
  return postCall('/service/followUser', { userId, followedBy });
};

export const unFollowUser = (userId, followedBy) => {
  return postCall('/service/unFollowUser', { userId, followedBy });
};

export const getUsersToFollow = (userId) => {
  return getCall('/service/usersToFollow/' + userId);
};

export const addFeed = (userId, post, channelId) => {
  return postCall('/service/addFeed', { userId, post, channelId });
};

export const getAllUsers = () => {
  return getCall('/service/allUsers');
};

export const getAllChannels = () => {
  return getCall('/service/allChannels');
};

export const getFeeds = (userId, channelId) => {
  return postCall('/service/getFeeds', { userId, channelId });
};

export const likeFeed = (userId, feedId) => {
  return postCall('/service/likeFeed', { userId, feedId });
};

