const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");

const { generateMessage, generatLocationMessage } = require("./utils/messages");
const {
  addUser,
  getUser,
  removeUser,
  getUserInRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

app.use(express.json());

const publicDirPath = path.join(__dirname, "../public");
app.use(express.static(publicDirPath));

// let count = 0;

io.on("connection", (socket) => {
  console.log("new websocket connection");

  socket.on("join", ({ username, room }, callback) => {
    const {error, user } = addUser({id: socket.id, username, room})
    if (error) {
        return callback(error)
    }
    socket.join(user.room);

    socket.emit("message", generateMessage('Admin',"Welcome!"));
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage('Admin',`${user.username} has joined`));
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUserInRoom(user.room)
      })
  });

  socket.on("sendMsg", (message, callback) => {
    const user = getUser(socket.id)
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback("profanity is not allowed");
    }
    io.to(user.room).emit("message", generateMessage(user.username, message));
    callback("msg Deliverd");
  });

  socket.on("sendLocation", (coords, callback) => {
    const user = getUser(socket.id)
    io.to(user.room).emit(
      "locationMessage",
      generatLocationMessage(
        user.username,
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id)
    if (user)  {
        io.to(user.room).emit("message", generateMessage('Admin',`${user.username} has left`));
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUserInRoom(user.room)
          })
    }
  });

  // socket.emit('countUpdated', count)

  // socket.on('increament', () => {
  //     count++
  //     // socket.emit('countUpdated', count)  // this will update  only single connection count
  //     io.emit('countUpdated', count) // this will update for all the connections
  // })
});

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
