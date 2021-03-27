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

export const requestLogin = (username, password) => {
  return postCall('/service/login', { username, password });
};

export const getAllAvailableEmployees = () => {
  return getCall('/service/employees/getallavailable');
};

export const getRegisteredTeam = (userId) => {
  return postCall('/service/teams/getbyuserid', { userId });
};

export const requestRegisterTeam = (userId, team, label, problemId) => {
  return postCall('/service/teams/register', { userId, team, label, problemId});
};

export const sendFeedback = (name, feedback) => {
  return postCall('/service/feedback', { name, feedback });
};

export const getAllTeams = () => {
  return getCall('/secret/teams');
};

export const getAllFeedback = () => {
  return getCall('/secret/feedback');
};
