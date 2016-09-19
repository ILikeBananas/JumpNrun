// ----- EXECUTE DIFFÉRENTS TESTS POUR LES DÉCORS -----
// Auteur : Sébastien Chappuis

// Execute pour chaque décors
function forEachDecor() {
    
    // Pour chaque décor
    for (var i = 0; i < decors.length; i++) {
        
        // Décor
        var decor = decors[i];
        
        // Si le décor sort de l'écran
        if (camera.rotation.y == 0 && decor.position.z >= camera.position.z + 16) {
            scene.remove(decor);
            delete decors[i];
            decors.clean();
        }
    }
}
