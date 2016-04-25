var socket = io();
//io.emit("connection", "");
socket.on("test", (data) => {
  console.log("a client connecte");
});
socket.on("clicked", () => {
  console.log("Server confirme que tu as cliquer dur");
  newScore();
});


socket.on("updateScore", (data) => {
  console.log("nouveau score est arrivé");
  console.log(data);
})
function newScore () {
  console.log("tu m'as cliquer dur");
  socket.emit("newScore", {"name":"Max", "score":"500"});
}
