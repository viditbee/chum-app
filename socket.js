const initiate = (http) => {
  const io = require('socket.io')(http);

  io.use((socket, next) => {
    const {id, firstName, lastName, timestamp} = socket.handshake.auth;
    if (!id) {
      return next(new Error("invalid username"));
    }
    console.log("Socket registered under ", id, firstName, lastName);
    socket.userId = id;
    socket.firstName = firstName;
    socket.lastName = lastName;
    socket.timestamp = timestamp;
    next();
  });

  //informing connected user of already connected users
  io.on("connection", (socket) => {
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
      users.push({
        socketId: id,
        userId: socket.userId,
        firstName: socket.firstName,
        lastName: socket.lastName,
        timestamp: socket.timestamp
      });
    }
    socket.emit("users", users);
  });

  //notifying existing users
  io.on("connection", (socket) => {
    socket.broadcast.emit("user connected", {
      socketId: socket.id,
      userId: socket.userId,
      firstName: socket.firstName,
      lastName: socket.lastName,
      timestamp: socket.timestamp
    });

    socket.on("disconnect", () => {
      socket.broadcast.emit("user disconnected", {
        socketId: socket.id,
        userId: socket.userId,
        firstName: socket.firstName,
        lastName: socket.lastName,
        timestamp: socket.timestamp
      });
    });
  });
};

module.exports = {
  initiate
};
