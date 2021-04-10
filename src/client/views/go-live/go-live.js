import React, { useState, useEffect, useRef } from 'react';
import './go-live.scss';
import { ReactSketchCanvas } from "react-sketch-canvas";
import UserMiniList from './user-mini-list';
import RoomList from './room-list';
import {
  initiateConnection,
  initiateDisconnection,
  createRoom,
  joinRoom,
  leaveRoom,
  canvasChanged
} from "../../interface/socket";
import { debounce } from "../../utils/utils";
import Button from "../misc/button";

const SPLITTER = "%@%";

function GoLive({ userInfo, goLiveClosed }) {

  const [onlineUsersSocketMap, setOnlineUsersSocketMap] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineRooms, setOnlineRooms] = useState([]);
  const [joinedRoom, setJoinedRoom] = useState("");
  const [roomUserMap, setRoomUserMap] = useState({});
  const [socketConnected, setSocketConnected] = useState(false);
  const onSocketConnectCb = useRef();
  const onSocketEventCb = useRef();
  const reactSketchCanvas = useRef();
  let latestPaths = [];

  useEffect(() => {
    initiateConnection(userInfo, onSocketConnectCb, onSocketEventCb);
    return () => {
      initiateDisconnection();
    }
  }, []);

  onSocketConnectCb.current = () => {
    setSocketConnected(true);
  };

  const userJoinedARoom = ({ roomId, userLabel }) => {
    const oldList = roomUserMap[roomId] ? [...roomUserMap[roomId]] : [];
    oldList.push(userLabel);
    setRoomUserMap({ ...roomUserMap, [roomId]: oldList })
  };

  const userLeftARoom = ({ roomId, userLabel }) => {
    const oldList = roomUserMap[roomId] ? [...roomUserMap[roomId]] : [];
    if (oldList.indexOf(userLabel) !== -1) {
      oldList.splice(oldList.indexOf(userLabel), 1);
      setRoomUserMap({ ...roomUserMap, [roomId]: oldList })
    }
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

  const filterAndSetRooms = (rooms) => {
    const res = [];
    const userRes = {};
    for (let key in rooms) {
      let split = key.split(SPLITTER);
      if (split.length > 1) {
        res.push({
          id: key,
          label: split[0]
        });
        userRes[key] = rooms[key];
      }
    }
    setOnlineRooms(res);
    setRoomUserMap(userRes);
  };

  const addRoom = (label) => {
    let found = false;
    for (let i = 0; i < onlineRooms.length; i += 1) {
      if (onlineRooms[i].id === label) {
        found = true;
        break;
      }
    }

    if (!found) {
      let roomsDup = [{ id: label, label: label.split(SPLITTER)[0] }, ...onlineRooms];
      setOnlineRooms(roomsDup);
    }
  };

  const removeRoom = (label) => {
    const dup = [];
    for (let i = 0; i < onlineRooms.length; i += 1) {
      if (onlineRooms[i].id !== label) {
        dup.push(onlineRooms[i]);
      }
    }
    setOnlineRooms(dup);
    if (label === joinedRoom) {
      setJoinedRoom("");
    }
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

  const updateCanvas = (paths) => {
    if (reactSketchCanvas && reactSketchCanvas.current && paths.length !== latestPaths.length) {
      reactSketchCanvas.current.clearCanvas();
      reactSketchCanvas.current.loadPaths(paths);
    }
  };

  onSocketEventCb.current = (event, args) => {
    console.log(event, args);

    switch (event) {
      case "users":
        filterAndSetUniqueUsers(args[0]);
        break;
      case "rooms":
        filterAndSetRooms(args[0]);
        break;
      case "user_connected":
        addOnlineUser(args[0]);
        break;
      case "room_created":
        addRoom(args[0]);
        break;
      case "room_destroyed":
        removeRoom(args[0]);
        break;
      case "user_joined":
        userJoinedARoom(args[0]);
        break;
      case "user_left":
        userLeftARoom(args[0]);
        break;
      case "user_disconnected":
        removeOnlineUser(args[0]);
        break;
      case "canvas_updated":
        updateCanvas(args[0]);
        break;
      default:
      //do nothing
    }
  };

  const onJoinClicked = (id) => {
    if (joinedRoom) {
      const conf = window.confirm("Are you sure you want to leave the current room?");
      if (conf) {
        leaveRoom(joinedRoom);
      } else {
        return;
      }
    }
    joinRoom(id);
    setJoinedRoom(id);
  };

  const onRoomCreate = (label) => {
    const newLabel = label + SPLITTER + Math.floor(Math.random() * 1000);
    createRoom(newLabel);
    addRoom(newLabel);
    setJoinedRoom(newLabel);
  };

  const onRoomCreateRequest = () => {
    if (joinedRoom) {
      const conf = window.confirm("You will have to leave the current room before creating a" +
        " new room. Do you want to continue?");
      if (conf) {
        leaveRoom(joinedRoom);
      } else {
        return;
      }
    }
    const roomName = prompt("Give your room a name");
    if (roomName.trim()) {
      onRoomCreate(roomName);
    } else {
      alert("Please try again with a better name");
    }
  };

  const getLeftPanel = () => {
    return <div className="gl-left-panel">
      <UserMiniList list={onlineUsers} />
      <RoomList list={onlineRooms}
                roomUserMap={roomUserMap}
                joinedRoom={joinedRoom}
                onJoinClicked={(id) => {
                  onJoinClicked(id)
                }}
                onRoomCreateRequest={() => {
                  onRoomCreateRequest()
                }} />
    </div>
  };

  const onCanvasUpdate = async (...args) => {
    // console.log(args);
    const paths = await reactSketchCanvas.current.exportPaths();
    latestPaths = paths;
    canvasChanged(joinedRoom, paths);
    // console.log("paths", paths);
  };

  const handleCanvasToolClicked = async (action) => {
    if (reactSketchCanvas && reactSketchCanvas.current) {
      switch (action) {
        case "undo":
          reactSketchCanvas.current.undo();
          break;
        case "clear":
          reactSketchCanvas.current.clearCanvas();
          break;
        case "export":
          const img = await reactSketchCanvas.current.exportImage("png");
          let a = document.createElement("a");
          a.href = img;
          a.download = "art-from-chum.png";
          a.click();
          break;
        default:
          return null;
      }
    }
  };

  const getCanvasToolbar = () => {
    if (joinedRoom) {
      return <div className="canvas-toolbar">
        <Button text="Undo" onClick={() => {
          handleCanvasToolClicked("undo")
        }} />
        <Button text="Clear All" onClick={() => {
          handleCanvasToolClicked("clear")
        }} />
        <Button text="Export" onClick={() => {
          handleCanvasToolClicked("export")
        }} />
      </div>
    }
    return null;
  };

  const getRightPanel = () => {
    return <div className={`gl-right-panel ${joinedRoom ? "room-joined" : ""}`}>
      {getCanvasToolbar()}
      {joinedRoom ? <ReactSketchCanvas
          ref={reactSketchCanvas}
          strokeWidth={5}
          strokeColor="black"
          onUpdate={debounce(onCanvasUpdate, 1000)}
        /> :
        <div className="rp-room-not-joined">Join a room to start the magic ;)</div>}
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


