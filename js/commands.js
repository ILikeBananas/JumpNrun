// ----- TEST SI LE JOUEUR SE DÉPLACE AVEC LES COMMANDES DU CLAVIER -----
// Auteur : Sébastien Chappuis

// Test les différentes commandes du claviers
function testCommands() {
    
    // Touche gauche appuyée
    if (keys[65] && !keysOnce[65]) {
        moveLeft();
        keysOnce[65] = true;
    } else if (!keys[65]) {
        keysOnce[65] = false;
    }

    // Touche droite appuyée
    if (keys[68] && !keysOnce[68]) {
        moveRight();
        keysOnce[68] = true;
    } else if (!keys[68]) {
        keysOnce[68] = false;
    }

    // Touche de saut appuyée
    if (keys[32] && !keysOnce[32]) {
        jump();
        keysOnce[32] = true;
    } else if (!keys[32]) {
        keysOnce[32] = false;
    }

    // Touche d'accroupissement appuyé
    if (keys[16] && !keysOnce[16]) {
        squat(1);
        keysOnce[16] = true;
    } else if (!keys[16]) {
        keysOnce[16] = false;
    }
}
