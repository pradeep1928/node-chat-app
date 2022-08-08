const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

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

  socket.emit("message", "Welcome!");
  socket.broadcast.emit('message', 'A new user has joined!')

  socket.on("sendMsg", (message) => {
    io.emit("message", message);
  });

  socket.on('sendLocation', (coords) => {
    io.emit('message', `Location: ${coords.latitude}, ${coords.longitude}`)
    io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
  })

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left')
  })

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
