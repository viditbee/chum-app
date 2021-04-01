import { getFromLocalStorage, setInLocalStorage } from "./local-storage-manager";
import { requestSignin } from "../interface/interface";

const { cipher, decipher } = require('./../utils/encrypt');
const SECRET_SALT_DATA_TRANSFER = "ANT";
const cipherFunc = cipher(SECRET_SALT_DATA_TRANSFER);
const decipherFunc = decipher(SECRET_SALT_DATA_TRANSFER);

export const manageSuccessfulLogin = (id, uName, pwd) => {
  const username = cipherFunc(uName);
  const password = cipherFunc(pwd);
  setInLocalStorage("userInfo", JSON.stringify({ id, username, password }));
};

export const manageSuccessfulLogout = () => {
  setInLocalStorage("userInfo", "");
};

export const getUserInfo = () => {
  const userInfo = getFromLocalStorage("userInfo");
  try {
    let { id, username, password } = JSON.parse(userInfo);
    return {
      id,
      username: decipherFunc(username),
      password: decipherFunc(password),
    }
  } catch (e) {
    return null;
  }
};

export const checkIfLoggedIn = async (username, password) => {
  let user;
  let pass;

  if (!username && !password) {
    const userInfoFromLS = getUserInfo();
    if (userInfoFromLS) {
      user = userInfoFromLS.username;
      pass = userInfoFromLS.password;
    }
  } else {
    user = username;
    pass = password;
  }
  let { status, response } = await requestSignin(user, pass);
  if (status === "success") {
    manageSuccessfulLogin(response.id, user, pass);
  } else {
    manageSuccessfulLogout();
  }
  return { status, response };
};
