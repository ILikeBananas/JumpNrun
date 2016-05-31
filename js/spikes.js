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
        
        collisionObstacle(spike, false, false);
    }
}
