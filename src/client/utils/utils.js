import { getFromLocalStorage, setInLocalStorage } from "./local-storage-manager";
// import { requestLogin } from "../interface/interface";

export const manageSuccessfulLogin = (id, username, password) => {
  setInLocalStorage("userInfo", JSON.stringify({id, username, password}));
};

export const manageSuccessfulLogout = () => {
  setInLocalStorage("userInfo", "");
};

export const getUserInfo = () => {
  const userInfo = getFromLocalStorage("userInfo");
  try {
    return JSON.parse(userInfo);
  } catch (e) {
    return null;
  }
};

export const checkIfLoggedIn = async (username, password) => {
  let user;
  let pass;

  if(!username && !password) {
    const userInfoFromLS = getUserInfo();
    if(userInfoFromLS) {
      user = userInfoFromLS.username;
      pass = userInfoFromLS.password;
    }
  } else {
    user = username;
    pass = password;
  }
  // let res = await requestLogin(user, pass);
  // if(res){
  //   const id = res.id;
  //   const status = res.status;
  //   const firstName = res.firstName;
  //   const lastName = res.lastName;
  //   const teamId = res.teamId;
  //   const hakuna = res.hakuna;
  //
  //
  //   if (status === "yay") {
  //     manageSuccessfulLogin(id, user, pass);
  //   } else {
  //     manageSuccessfulLogout();
  //   }
  //   return {
  //     id,
  //     status,
  //     firstName,
  //     lastName,
  //     teamId,
  //     hakuna
  //   };
  // }
  return null;
};
