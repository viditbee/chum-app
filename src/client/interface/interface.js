const { cipher } = require('./../utils/encrypt');
const SECRET_SALT_DATA_TRANSFER = "ANT";
const cipherFunc = cipher(SECRET_SALT_DATA_TRANSFER);

const getCall = async (url, userId = "def") => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      secureToken: cipherFunc(userId)
    },
  });
  return res.json();
};

const postCall = async (url, data, userId = "def") => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      secureToken: cipherFunc(userId)
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

export const updateUserBasicInfo = (userId, basicInfo) => {
  return postCall('/service/userBasicInfo', { userId, basicInfo }, userId);
};

export const getFollowInfo = (userId) => {
  return getCall('/service/followInfo/' + userId, userId);
};

export const getUserBasicInfo = (userId) => {
  return getCall('/service/userBasicInfo/' + userId, userId);
};

export const getSubscribedChannels = (userId) => {
  return getCall('/service/subscribedChannels/' + userId, userId);
};

export const followUser = (userId, followedBy) => {
  return postCall('/service/followUser', { userId, followedBy }, userId);
};

export const unFollowUser = (userId, followedBy) => {
  return postCall('/service/unFollowUser', { userId, followedBy }, userId);
};

export const getUsersToFollow = (userId) => {
  return getCall('/service/usersToFollow/' + userId, userId);
};

export const addFeed = (userId, post, channelId) => {
  return postCall('/service/addFeed', { userId, post, channelId }, userId);
};

export const getAllUsers = () => {
  return getCall('/service/allUsers');
};

export const getAllChannels = () => {
  return getCall('/service/allChannels');
};

export const getFeeds = (userId, channelId) => {
  return postCall('/service/getFeeds', { userId, channelId }, userId);
};

export const getActivity = (userId) => {
  return postCall('/service/getActivity', { userId }, userId);
};

export const likeFeed = (userId, feedId) => {
  return postCall('/service/likeFeed', { userId, feedId }, userId);
};

export const followChannel = (userId, channelId) => {
  return postCall('/service/followChannel', { userId, channelId }, userId);
};

export const createChannel = (userId, label, description) => {
  return postCall('/service/createChannel', { userId, label, description }, userId);
};

export const followEvent = (userId, eventId) => {
  return postCall('/service/followEvent', { userId, eventId }, userId);
};

export const getUpcomingEvents = () => {
  return getCall('/service/upcomingEvents');
};

export const createEvent = (userId, label, description, from, to) => {
  return postCall('/service/createEvent', { userId, label, description, from, to }, userId);
};

export const getAllEvents = () => {
  return getCall('/service/allEvents');
};

export const getUserProfileInfo = (userId) => {
  return getCall('/service/userProfileInfo/' + userId, userId);
};

export const getUsersWithBasicInfo = (userId) => {
  return postCall('/service/usersWithBasicInfo', { userId }, userId);
};

