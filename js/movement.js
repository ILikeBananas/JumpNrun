// ----- DÉPLACEMENT DU PERSONNAGE -----
// Auteur : Sébastien Chappuis


// Déplace le personnage à gauche
function moveLeft() {
    
    // Si la vue est derrière le personnage
    // et que l'on est pas déjà tout à gauche
    if (viewX == 0 && roadPath > -1) {
        roadPath--;
    }
}

// Déplace le personnage à droite
function moveRight() {
    
    // Si la vue est derrnière le personnage
    // et que l'on est pas déjà tout à droite
    if (viewX == 0 && roadPath < 1) {
        roadPath++;
    }
}

// Déplace le personnage pour aller sur le chemin
// correspondant à l'identifiant passé en paramètre
function goToPath(idPath) {
    
    idPath = idPath === undefined ? 0 : idPath;
    
    // Si la vue est derrière le personnage
    if (viewX == 0) {
        roadPath = idPath
    }
}

// Fait sauter le personnage
function jump() {
    
    // Si la vue est derrière le personnage
    // et que l'on est sur le sol
    if (viewX == 0 && onGround) {
        fallSpeed = -JUMP_SPEED; // Saut
        position.y = Math.ceil(position.y / 2) * 2;
        onGround = false;
        squatTime = 0; // Ne se baisse plus
    }
}

// Fait s'accroupir le personnage pendant une durée égale au paramètre
function squat(timeSecond) {
    
    timeSecond = timeSecond === undefined ? .01 : timeSecond;
    
    // Si la vue est derrière le personnage
    if (viewX == 0) {
        squatTime = Math.max(timeSecond, squatTime); // Se baisser pendant X seconde
        fallSpeed = 128; // Fait une charge au sol
    }
}
