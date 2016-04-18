// Server for the jump and run game
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require("fs");

// Read the config file and start the server
fs.readFile("config.json", "utf8", (err, data) => {
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



// Routings
app.get("/", (req, res) => {
  res.send("index.html");
});
io.on("connection", (data) => {
  console.log("Client connected");
  io.emit("test", "test");
});
