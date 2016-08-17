// ----- LORS DE LA FIN DE LA PARTIE -----
// Auteur : Sébastien Chappuis

// Met fin à la partie, en affichant le score
function endGame() {
    
    executionGameLoop = false;
    
    $('canvas').remove();
    
    $('p').remove()
    $('body').append('<p style="color:white">Vous êtes mort !</p>')
             .append('<p style="color:white">Score : ' + getScore() + '</p>'); // TEMP
}
