// Retourne la distance parcouru
function getDistance() {
    
    return parseInt(character.position.z * -1 / 16);
}

// Retourne le score obtenu
function getScore() {
    
    return parseInt(getDistance() / 10) + coinsCollect;
}
