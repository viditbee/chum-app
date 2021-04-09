import { io } from "socket.io-client";

let connectionCallback = () => {};
let eventCallback = () => {};

export const Socket = io(undefined, { autoConnect: false });

export const initiateConnection = (userInfo, callback, evCallback) => {
  if (userInfo) {
    connectionCallback = callback;
    eventCallback = evCallback;
    Socket.auth = {
      id: userInfo.id,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      timestamp: new Date().getTime()
    };
    Socket.connect();
  }

  return false;
};

export const initiateDisconnection = () => {
  connectionCallback = () => {};
  Socket.disconnect();
  return true;
};

Socket.on("connect", () => {
  connectionCallback.current();
  console.log(Socket.id);
});

Socket.onAny((event, ...args) => {
  eventCallback.current(event, args);
});
