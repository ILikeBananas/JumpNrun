// Server for the jump and run game

// Modules
var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require("fs");
var path = require("path");
var colog = require("colog");
var config = require("./config/config.json");


  var connects = 0;
  if(config.port){
    server.listen(config.port);
    colog.success("Server started on port " + config.port);
  } else {
    colog.error("server port is not defined");
    colog.error("Programm stopped");
    process.exit(1);
  }

// Static routes
app.use("/js",    express.static("js"));
app.use("/maps",  express.static("maps"));
app.use("/img",   express.static("img"));
app.use("/css",   express.static("css"));

// Routings
app.get("/", (req, res) => {
  res.sendFile(path.join( __dirname+ "/index.html"));
});
app.get("/score", (req, res) => {
  app.set("view engine", "jade");
  res.render("scoretest.jade");
})

io.on("connection", () => {
  console.log("client connected");
  io.on("newScore", (score, name) => {
    console.log("newscore")
    var allScore = addScore(score);
    colog.dump(score);
    io.emit("updateScore", score);
  });
});

// Add a new score to the scores json
// Retun the complete scoreboard
function addScore (score){
  data = readJSON("config/highscores.json");
  colog.cyan(data[3].name);
  data.scores[data.viewers.length + 1].name = score.name;
  data.scores[data.viewers.length + 1].score = score.score;
  var json = JSON.stringify(score);
  // Update json file
  fs.writeFile("config/highscores.json", score, (err) => {
    if (err) throw err;
    colog.success("Scores has been saved!");
  });
  return score;
}

function readJSON (fileName) {
  fs.readFile(fileame, "utf8", (err, data) => {
    data = JSON.parse(data);
    if(err){
      colog.error(err);
      throw err;
    } else {
      return data;
    }
  });
}
