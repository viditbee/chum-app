import React, { useState, useEffect, useRef } from 'react';
import './go-live.scss';
import UserMiniList from './user-mini-list';
import RoomList from './room-list';
import { initiateConnection, initiateDisconnection } from "../../interface/socket";

function GoLive({ userInfo, goLiveClosed }) {

  const [onlineUsersSocketMap, setOnlineUsersSocketMap] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineRooms, setOnlineRooms] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const onSocketConnectCb = useRef();
  const onSocketEventCb = useRef();

  useEffect(() => {
    initiateConnection(userInfo, onSocketConnectCb, onSocketEventCb);
    return () => {
      initiateDisconnection();
    }
  }, []);

  onSocketConnectCb.current = () => {
    setSocketConnected(true);
  };

  const filterAndSetUniqueUsers = (users) => {
    const res = [];
    const map = {};
    for (let i = 0; i < users.length; i += 1) {
      let user = users[i];
      let mapEntry = map[user.userId];
      if ((!mapEntry || !mapEntry.length) && userInfo.id !== user.userId) {
        res.push(user);
        map[user.userId] = [...(map[user.userId] || []), user.socketId];
      }
    }
    setOnlineUsers(res);
    setOnlineUsersSocketMap(map);
  };

  const addOnlineUser = (user) => {
    let found = false;
    if (userInfo.id !== user.userId) {
      for (let i = 0; i < onlineUsers.length; i += 1) {
        if (user.userId === onlineUsers[i].userId) {
          found = true;
          break;
        }
      }
      let mapDup = { ...onlineUsersSocketMap };
      mapDup[user.userId] = mapDup[user.userId] ? [...mapDup[user.userId], user.socketId] : [user.socketId];
      setOnlineUsersSocketMap(mapDup);
      if (!found) {
        setOnlineUsers([user, ...onlineUsers]);
      }
    }
  };

  const removeOnlineUser = (user) => {
    if (onlineUsersSocketMap[user.userId]) {
      let arrDup = [...onlineUsersSocketMap[user.userId]];
      let mapDup = { ...onlineUsersSocketMap };
      arrDup = arrDup.filter((val) => val !== user.socketId);
      mapDup[user.userId] = arrDup;
      setOnlineUsersSocketMap(mapDup);
      if (!arrDup.length) {
        let usersDup = [...onlineUsers];
        usersDup = usersDup.filter((usr) => usr.userId !== user.userId);
        setOnlineUsers(usersDup);
      }
    }
  };

  onSocketEventCb.current = (event, args) => {
    console.log("In sock event");
    console.log(event, args);
    console.log("MAPO", onlineUsersSocketMap);

    switch (event) {
      case "users":
        filterAndSetUniqueUsers(args[0]);
        break;
      case "user connected":
        addOnlineUser(args[0]);
        break;
      case "user disconnected":
        removeOnlineUser(args[0]);
        break;
      default:
      //do nothing
    }
  };

  const onJoinClicked = (id) => {

  };

  const getLeftPanel = () => {
    return <div className="gl-left-panel" title={JSON.stringify(onlineUsersSocketMap)}>
      <UserMiniList list={onlineUsers} />
      <RoomList list={onlineRooms} onJoinClicked={(id) => {
        onJoinClicked(id)
      }} />
    </div>
  };

  const getRightPanel = () => {
    return <div className="gl-right-panel">

    </div>
  };

  const goLiveCloseButton = () => {
    return <div className="gl-close-btn" onClick={() => {
      goLiveClosed()
    }} />
  };

  return <div className="go-live-onion">
    <div className="go-live-dialog">
      {getLeftPanel()}
      {getRightPanel()}
      {goLiveCloseButton()}
    </div>
  </div>;
}

GoLive.propTypes = {};

GoLive.defaultProps = {};

export default GoLive;


