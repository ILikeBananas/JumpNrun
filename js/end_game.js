// ----- LORS DE LA FIN DE PARTIE -----
// Auteur : Sébastien Chappuis


// Met fin à la partie, en affichant le score
function endGame() {
    
    $('canvas').remove();
    $('body').append('<p style="color:white">Vous êtes mort !\nScore : ' + getScore() + '</p>'); // TEMP
}
