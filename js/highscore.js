var socket = io();
socket.on("newHighscore", (data) => {
  console.log("a client connected");
});
