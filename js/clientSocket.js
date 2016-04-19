var socket = io();
//io.emit("connection", "");
socket.on("test", () => {
  console.log("a client connected");
});
