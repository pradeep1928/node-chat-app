const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require('bad-words');

const { generateMessage, generatLocationMessage } = require('./utils/messages')

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

  socket.on('join', ({username, room}) => {
    socket.join(room)

    socket.emit("message", generateMessage("Welcome!"));
    socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined`))
  
  })


  socket.on("sendMsg", (message, callback) => {
    const filter = new Filter()
    if (filter.isProfane(message)) {
        return callback("profanity is not allowed")
    }
    io.to('webdev').emit("message", generateMessage(message));
    callback("msg Deliverd")
  });

  socket.on('sendLocation', (coords, callback) => {
    io.emit('locationMessage', generatLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
    callback()
  })

  socket.on('disconnect', () => {
    io.emit('message', generateMessage('A user has left'))
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
