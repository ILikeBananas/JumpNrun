// ----- EXECUTE DIFFÉRENTS TESTS POUR LES CAISSES -----
// Auteur : Sébastien Chappuis

// Execute pour chaque caisse
function forEachBox() {
    
    // Pour chaque caisse
    for (var i = 0; i < boxes.length; i++) {
        
        // Caisse
        var box = boxes[i];
        
        // Si la caisse sort de l'écran, l'enlève de la scène
        if (box.position.z >= camera.position.z + 16 || box.position.y < -16) {
            scene.remove(box);
            delete boxes[i];
            boxes.clean();
        }
        
        collisionObstacle(box, true, true);
    }
}
