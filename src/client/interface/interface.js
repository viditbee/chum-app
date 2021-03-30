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

export const requestSignin = (username, password) => {
  return postCall('/service/signin', { username, password });
};

export const requestSignup = (username, firstName, lastName) => {
  return postCall('/service/signup', { username, firstName, lastName });
};
