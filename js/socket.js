var socket = io();
socket.emit("connection", "bonjour");
console.log("socket connected");

function sendScore (score) {
  socket.emit("newScore", score);
  console.log("score sended");
}
