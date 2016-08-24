// Server for the jump and run game

// Modules
var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require("fs");
var path = require("path");
var config = require("./config/config.json");
var util = require("util");

server.listen(config.port);
console.log("server started " +  config.port);

// Static routes
app.use("/js",    express.static("js"));
app.use("/maps",  express.static("maps"));
app.use("/img",   express.static("img"));
app.use("/css", express.static("css"));
app.use("/vendors", express.static("vendors"));
app.use("/obj", express.static("obj"));
app.use("/levels", express.static("levels"));

// Set the view engine
app.set("view engine", "pug");
app.set("views", "./views");
// Routings
app.get("/", (req, res) => {
  res.render("index");
});



io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("newScore", (user) => {
    console.log("new score : " + user.score + " from : " + user.name + "\ndistance : " + user.distance + " coins : " + user.coins);
  });
});
