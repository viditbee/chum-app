const initiate = (http) => {
  const io = require('socket.io')(http, {
    maxHttpBufferSize: 1e8
  });

  const idLabelMap = {};

  io.use((socket, next) => {
    const { id, firstName, lastName, timestamp } = socket.handshake.auth;
    if (!id) {
      return next(new Error("invalid username"));
    }
    console.log("Socket registered under ", id, firstName, lastName);
    socket.userId = id;
    socket.firstName = firstName;
    socket.lastName = lastName;
    socket.timestamp = timestamp;

    idLabelMap[socket.id] = firstName + " " + lastName;
    next();
  });

  //informing connected user of already connected users
  io.on("connection", (socket) => {
    const users = [];
    const rooms = {};
    for (let [id, socket] of io.of("/").sockets) {
      let labelStr = socket.firstName + " " + socket.lastName;
      users.push({
        socketId: id,
        userId: socket.userId,
        firstName: socket.firstName,
        lastName: socket.lastName,
        timestamp: socket.timestamp
      });

      for (let item of socket.rooms) {
        rooms[item] = rooms[item] ? [...rooms[item], labelStr] : [labelStr];
      }
    }

    socket.emit("users", users);
    socket.emit("rooms", rooms);
  });

  //notifying existing users
  io.on("connection", (socket) => {
    socket.broadcast.emit("user_connected", {
      socketId: socket.id,
      userId: socket.userId,
      firstName: socket.firstName,
      lastName: socket.lastName,
      timestamp: socket.timestamp
    });

    socket.on("disconnect", () => {
      socket.broadcast.emit("user_disconnected", {
        socketId: socket.id,
        userId: socket.userId,
        firstName: socket.firstName,
        lastName: socket.lastName,
        timestamp: socket.timestamp
      });
      delete idLabelMap[socket.id];
    });
  });

  //custom events
  io.on("connection", (socket) => {
    socket.on("create_room", (label) => {
      socket.join(label);
      socket.broadcast.emit("room_created", label);
    });

    socket.on("leave_room", (label) => {
      socket.leave(label);
    });

    socket.on("join_room", (label) => {
      socket.join(label);
    });

    socket.on("canvas_changed", ({ roomId, paths }) => {
      socket.to(roomId).emit("canvas_updated", paths)
    });
  });

  io.of("/").adapter.on("delete-room", (room) => {
    io.emit("room_destroyed", room);
  });

  io.of("/").adapter.on("join-room", (room, id) => {
    io.emit("user_joined", { roomId: room, userLabel: idLabelMap[id] });
  });

  io.of("/").adapter.on("leave-room", (room, id) => {
    io.emit("user_left", { roomId: room, userLabel: idLabelMap[id] });
  });
};

module.exports = {
  initiate
};
