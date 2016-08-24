// ----- LORS DE LA FIN DE LA PARTIE -----
// Auteur : Sébastien Chappuis

// Met fin à la partie, en affichant le score
function endGame() {
    
    executionGameLoop = false;
    
    ctx.fillStyle = 'rgba(0,0,0,.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
