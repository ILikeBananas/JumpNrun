// ----- EXECUTE DIFFÉRENTS TESTS POUR LES CAISSES -----
// Auteur : Sébastien Chappuis

// Execute pour chaque caisse
function forEachBox() {
    
    // Pour chaque caisse
    for (var i = 0; i < boxes.length; i++) {
        
        // Caisse
        var box = boxes[i];
        
        // Si la caisse sort de l'écran, l'enlève de la scène
        if (box.position.z >= camera.position.z + 16) {
            scene.remove(box);
            delete boxes[i];
            boxes.clean();
        }
        // Si la caisse n'est pas éjectée
        else if (box.name == '') {
            
            // Si fonce dans une caisse
            if (collision(character, box, -8, -8, -8,
                          8, 6 - delta * Math.max(0, fallSpeed), 8)) {
                // Si on n'a pas de bouclier
                if (!shieldTime) {
                    reset();
                } else {
                    // Si il ne s'agit pas du boost de vitesse, affaibli le bouclier
                    if (!isSwiftness) {
                        shieldTime--;
                        flash.material.opacity = 1;
                    }
                    box.name = 'ejected';
                    box['ejectSpeed'] = 64 + speed;
                    box['fallSpeed'] = -96;
                    
                    // Pour chaque pique
                    for (var j = 0; j < spikes.length; j++) {
                        
                        // Si un pique est collé à la caisse éjectée, l'éjecte aussi
                        if (box.position.x == spikes[j].position.x &&
                            box.position.z == spikes[j].position.z) {
                            
                            spikes[j].name = 'ejected';
                            spikes[j]['ejectSpeed'] = 64 + speed;
                            spikes[j]['fallSpeed'] = -96;
                        }
                    }
                }
                
            } else if (collision(character, box)) {
                position.y = box.position.y + 8;
                fallSpeed = Math.min(0, fallSpeed);
                onGround = true;
            }
            
        }
        
        // Si la caisse est éjectée
        if (box.name == 'ejected') {
            moveEjectedObstacle(box);
        }
    }
}
