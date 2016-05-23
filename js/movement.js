// ----- DÉPLACEMENT DU PERSONNAGE -----
// Auteur : Sébastien Chappuis


// Déplace le personnage à gauche
function moveLeft() {
    
    if (viewX == 0 && roadPath > -1) {
        roadPath--;
    }
}

// Déplace le personnage à droite
function moveRight() {
    
    if (viewX == 0 && roadPath < 1) {
        roadPath++;
    }
}

// Fait sauter le personnage
function jump() {
    
    if (viewX == 0 && onGround) {
        fallSpeed = -JUMP_SPEED; // Saut
        position.y = Math.ceil(position.y);
        onGround = false;
        squatTime = 0; // Ne se baisse plus
    }
}

// Fait s'accroupir le personnage
function squat() {
    
    if (viewX == 0) {
        squatTime = 1; // Se baisser pendant 1 seconde
        fallSpeed = 128; // Fait une charge au sol
    }
}