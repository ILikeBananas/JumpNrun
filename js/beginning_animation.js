// ----- ANIMATION LORS DU DÉBUT DE LA PARTIE -----
// Auteur : Sébastien Chappuis

// Animation de départ
function beginningAnimation() {

    if (viewX > 0) {
        viewX -= delta * 16;
    }

    viewX = Math.max(0, viewX);

    if (viewY < 40) {
        viewY += delta * 6;
    }

    viewY = Math.min(40, viewY);

    if (viewZ < 40) {
        viewZ += delta * 32;
    }

    viewZ = Math.min(40, viewZ);

    var rotation = camera.rotation;

    if (rotation.y > 0) {
        rotation.y -= delta
    }

    rotation.y = Math.max(0, rotation.y);

    if (camera.rotation.y == 0 && camera.rotation.x > -Math.PI / 6) {
        camera.rotation.x -= delta * .5;
    }

    rotation.x = Math.max(-Math.PI / 6, rotation.x);
}
