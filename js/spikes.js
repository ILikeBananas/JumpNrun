// ----- EXECUTE DIFFÉRENTS TESTS POUR LES PIQUES -----
// Auteur : Sébastien Chappuis

// Execute pour chaque caisse
function forEachSpike() {
    
    // Pour chaque pique
    for (var i = 0; i < spikes.length; i++) {
        
        // Pique
        var spike = spikes[i];
        
        // Si le pique sort de l'écran
        if (spike.position.z >= camera.position.z + 16) {
            scene.remove(spike);
            delete spikes[i];
            spikes.clean();
        }
        // Si le pique n'est pas éjecté
        else if (spike.name == '') {
            
            // Si on fonce dans des piques
            if (collision(character, spike)) {
                
                // Si on n'a pas de bouclier
                if (!shieldTime) {
                    reset();
                } else {
                    // Si il ne s'agit pas du boost de vitesse, affaibli le bouclier
                    if (!isSwiftness) {
                        shieldTime--;
                        flash.material.opacity = 1;
                    }
                    spike.name = 'ejected';
                    spike['ejectSpeed'] = 64 + speed;
                    spike['fallSpeed'] = -96;
                }
            }
            
        }
        
        if (spike.name == 'ejected') {
            moveEjectedObstacle(spike);
        }
    }
}
