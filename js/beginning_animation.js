// ----- ANIMATION LORS DU DÉBUT DE LA PARTIE -----
// Auteur : Sébastien Chappuis

// Animation de départ
function beginningAnimation() {
    
    if (viewX > 0) {
        viewX -= deltaTime * 16;
    }
    
    viewX = Math.max(0, viewX);
    
    if (viewY < 40) {
        viewY += deltaTime * 6;
    }
    
    viewY = Math.min(40, viewY);
    
    if (viewZ < 40) {
        viewZ += deltaTime * 32;
    }
    
    viewZ = Math.min(40, viewZ);
    
    var rotation = camera.rotation;
    
    if (rotation.y > 0) {
        rotation.y -= deltaTime
    }
    
    rotation.y = Math.max(0, rotation.y);
    
    if (camera.rotation.y == 0 && camera.rotation.x > -Math.PI / 6) {
        camera.rotation.x -= deltaTime * .5;
    }
    
    rotation.x = Math.max(-Math.PI / 6, rotation.x);
}
