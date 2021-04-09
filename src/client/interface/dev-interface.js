/*eslint-disable*/
import Interests from "../../facts/interests";

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

export const resetInterests = () => {
  return postCall('/secret/reset-interests', { interests: Interests });
};
