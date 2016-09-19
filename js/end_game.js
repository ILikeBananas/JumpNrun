// ----- LORS DE LA FIN DE LA PARTIE -----
// Auteur : Sébastien Chappuis

// Met fin à la partie, en affichant le score
var lives = 3;
function endGame() {
    console.log(lives);
    lives--;
    if (lives == 0){
      executionGameLoop = false;

      ctx.fillStyle = 'rgba(0,0,0,.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (IS_TUTORIAL) {
          document.location.href = '/';
      } else {
          document.location.href = 'newScore?score=' + getScore() + '&distance=' + getDistance() + '&coins=' + coinsCollect;
      }
    } else {
      shieldTime = 5;
    }
}
