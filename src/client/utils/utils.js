import { getFromLocalStorage, setInLocalStorage } from "./local-storage-manager";
import { requestLogin } from "../interface/interface";

export const PixelMap = {
  A: ["0_1", "1_0", "1_2", "2_0", "2_2"],
  B: ["0_0", "0_1", "1_0", "1_1", "1_2", "2_0", "2_1", "2_2"],
  C: ["0_0", "0_1", "0_2", "1_0", "2_0", "2_1", "2_2"],
  D: ["0_0", "0_1", "1_0", "1_2", "2_0", "2_1"],
  E: ["0_0", "0_1", "0_2", "1_0", "1_1", "2_0", "2_1", "2_2"],
  F: ["0_0", "0_1", "0_2", "1_0", "1_1", "2_0"],
  G: ["0_0", "0_1", "1_0", "1_2", "2_0", "2_1", "2_2"],
  H: ["0_0", "0_2", "1_0", "1_1", "1_2", "2_0", "2_2"],
  I: ["0_0", "0_1", "0_2", "1_1", "2_0", "2_1", "2_2"],
  J: ["0_2", "1_0", "1_2", "2_0", "2_1", "2_2"],
  K: ["0_0", "0_2", "1_0", "1_1", "2_0", "2_2"],
  L: ["0_0", "1_0", "2_0", "2_1", "2_2"],
  M: ["0_0", "0_1", "0_2", "1_0", "1_1", "1_2", "2_0", "2_2"],
  N: ["0_0", "0_1", "1_0", "0_2", "1_2", "2_0", "2_2"],
  O: ["0_0", "0_1", "0_2", "1_0", "1_2", "2_0", "2_1", "2_2"],
  P: ["0_0", "0_1", "0_2", "1_0", "1_1", "1_2", "2_0"],
  Q: ["0_0", "0_1", "0_2", "1_0", "1_1", "1_2", "2_2"],
  R: ["0_0", "0_1", "0_2", "1_0", "2_0"],
  S: ["0_1", "0_2", "1_1", "2_0", "2_1"],
  T: ["0_0", "0_1", "0_2", "1_1", "2_1"],
  U: ["0_0", "0_2", "1_0", "1_2", "2_0", "2_1", "2_2"],
  V: ["0_0", "0_2", "1_0", "1_2", "2_1"],
  W: ["0_0", "0_2", "1_0", "1_1", "1_2", "2_0", "2_1", "2_2"],
  X: ["0_0", "0_2", "1_1", "2_0", "2_2"],
  Y: ["0_0", "0_2", "1_1", "2_1"],
  Z: ["0_0", "0_1", "1_1", "2_1", "2_2"],
};

export const getPixDim = () => {
  const windowWidth = window.innerWidth;
  const pixelWidth = Math.floor(windowWidth / 60);

  return Math.min(pixelWidth - 2, 26);
};

export const getWidthInPix = () => {
  const windowWidth = window.innerWidth;

  return Math.floor(windowWidth / (getPixDim() + 4));
};

export const getHeightInPix = () => {
  const windowHeight = window.innerHeight;

  return Math.floor(windowHeight / (getPixDim() + 4));
};

export const getAliveMatCentered = (alive) => {
  const newAlive = [];
  let minRow = Infinity;
  let maxRow = -Infinity;
  let minCol = Infinity;
  let maxCol = -Infinity;

  for (let i = 0; i < alive.length; i += 1) {
    let [row, col] = alive[i].split("_");
    if (minRow > +row) minRow = +row;
    if (maxRow < +row) maxRow = +row;
    if (minCol > +col) minCol = +col;
    if (maxCol < +col) maxCol = +col;
  }

  let horiMid = Math.floor(getWidthInPix()/2);
  let vertiMid = Math.floor(getHeightInPix()/2);
  let shapeHoriMid = Math.floor((maxCol - minCol) / 2);
  let shapeVertiMid = Math.floor((maxRow - minRow) / 2);

  let horiDiff = (horiMid - shapeHoriMid) - minCol;
  let vertiDiff = (vertiMid - shapeVertiMid) - minRow;

  for(let i=0; i<alive.length; i+=1){
    let [row, col] = alive[i].split("_");
    newAlive.push(`${+row+vertiDiff}_${+col+horiDiff}`);
  }

  return newAlive;
};

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
  let res = await requestLogin(user, pass);
  if(res){
    const id = res.id;
    const status = res.status;
    const firstName = res.firstName;
    const lastName = res.lastName;
    const teamId = res.teamId;
    const hakuna = res.hakuna;


    if (status === "yay") {
      manageSuccessfulLogin(id, user, pass);
    } else {
      manageSuccessfulLogout();
    }
    return {
      id,
      status,
      firstName,
      lastName,
      teamId,
      hakuna
    };
  }
  return null;
};
