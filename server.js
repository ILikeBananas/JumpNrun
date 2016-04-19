// Server for the jump and run game

// Modules
var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require("fs");
var path = require("path");


  var connects = 0;
// Read the config file and start the server
fs.readFile("config/config.json", "utf8", (err, data) => {
  // Test if the read was succesfull
  if(err){
    console.log("Config file read error" + err);
  } else {
    data = JSON.parse(data);
    // Start the server
    server.listen(data["port"]);
    console.log("Server started on port %d", data["port"]);
  }
});

// Static routes
app.use("/js", express.static("js"));
app.use("/maps", express.static("maps"));
app.use("/img", express.static("img"));
app.use("/css", express.static("css"));

// Routings
app.get("/", (req, res) => {
  res.sendFile(path.join( __dirname+ "/index.html"));
});
io.on("connection", () => {
  connects++;
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(connects + " Client connected");

  io.on("newScore", (data) => {
    io.emit("newHighscore", data);
  });
});
