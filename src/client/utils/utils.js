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

export const debounce = (func, wait) => {
  let timeout;

  // This is the function that is returned and will be executed many times
  // We spread (...args) to capture any number of parameters we want to pass
  return function executedFunction(...args) {

    // The callback function to be executed after
    // the debounce time has elapsed
    const later = () => {
      // null timeout to indicate the debounce ended
      timeout = null;

      // Execute the callback
      func(...args);
    };
    // This will reset the waiting every function execution.
    // This is the step that prevents the function from
    // being executed because it will never reach the
    // inside of the previous setTimeout
    clearTimeout(timeout);

    // Restart the debounce waiting period.
    // setTimeout returns a truthy value (it differs in web vs Node)
    timeout = setTimeout(later, wait);
  };
};
