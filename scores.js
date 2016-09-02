var jsonFile = require("jsonfile");

// Add a score to the json file
// @param the new score (object with score and name)
exports.addScore = (newScore) => {
  console.log("addscore");
  jsonFile.readFile("scores.json", (err, score) => {
    score.scores.push(newScore);
    score.scores.sort(sortByScore);
    console.log(score);

    jsonFile.writeFile("scores.json", score,{spaces: 2},  (err) => {
      console.log(score);
      if(err)
        console.log("err" + err);
    })
  });
},

// Get the scores for the highscores lists
exports.getScore = () => {
  jsonFile.readFile("scores.json", (err, score)=>{

    // chantier en cours
  })
}

// Sort by score
// @Param object with score
function sortByScore(a, b) {
  return b.score - a.score;
}
