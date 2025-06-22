const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const socket = require("socket.io");
const server = http.createServer(app);
require("dotenv").config();

const io = new socket.Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("message", (text) => {
    console.log(text);
    io.to(text.room).emit("message", text);
  });

  socket.on("joinRoom", (info) => {
    socket.join(info.id);

    // Only notify others in the room (excluding the current socket)
    socket.to(info.id).emit("roomJoined", { userId: socket.id }); // Changed event name

    console.log(`User ${socket.id} joined ${info.id}`);
  });

  socket.on("leaveRoom", (info) => {
    socket.leave(info.id);
    console.log(`User ${socket.id} left ${info.id}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(process.env.NODE_PORT, () =>
  console.log("Running on port", process.env.NODE_PORT)
);
