// ----- FONCTIONS PERMETTANT DE RÉCUPÉRER DES VALEURS CALCULÉES -----
// Auteur : Sébastien Chappuis

// Retourne la distance parcourue à partir de la position Z du personnage
function getDistance() {
    
    return parseInt(character.position.z * -1 / 16);
}

// Retourne le score obtenu à partir de la distance
// parcourue et du nombre de pièces collectées
function getScore() {
    
    return parseInt(getDistance() / 5) + coinsCollect;
}


// Récupère le nombre d'images par seconde
function getFps() {
    
    return parseInt(1 / deltaTime);
}


// Récupère la vitesse du personnage jouable
function getCharacterSpeed() {
    
    return VELOCITY + (isSwiftness * (Math.min(2, shieldTime)) * 64);
}
