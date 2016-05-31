// ----- BOUCLE DU JEU (COMPOSANT UNE FRAME) -----
// Auteur : Sébastien Chappuis

// Boucle du jeu (1 itération = 1 frame)
function gameLoop() {
    
    requestAnimationFrame(gameLoop);
    
    var now = Date.now();
    delta = (now - lastTime) / 1000;
    fps = parseInt(1 / delta * 1) / 1;
    delta = Math.min(.1, delta);
    
    
    // Vitesse de chute augmentant avec le temps
    fallSpeed += 384 * delta;
    
    // Limite la vitesse de chute
    if (fallSpeed > 512) {
        fallSpeed = 512;
    }
    
    // Dissipe le flash
    if (character.flash.material.opacity > 0) {
        character.flash.material.opacity -= 2 * delta;
    }
    character.flash.material.opacity = Math.max(0, character.flash.material.opacity);
    
    // Modifie, si besoin, le matériel du bouclier
    if (!isSwiftness && character.shield.name != 'basic') {
        character.shield.name = 'basic';
        character.shield.material = materials.shieldBasic;
        
    } else if (isSwiftness && character.shield.name != 'boost') {
        character.shield.name = 'boost';
        character.shield.material = materials.shieldBoost;
    }
    
    shieldMaterial = '';
    
    // Diminue la durée du bouclier
    if (shieldTime > 0) {
        shieldTime -= delta;
        var opacity = shieldTime >= 2 ? .5 : shieldTime / 4;
        character.shield.material.opacity = opacity;
    } else {
        character.shield.material.opacity = 0;
    }
    
    // Si on a plus de bouclier, enlève le boost
    if (shieldTime <= 0) {
        isSwiftness = false;
    }
    
    // Fait chuter/sauter le personnage
    position.y -= fallSpeed * delta;
    
    // Diminue la durée de l'accroupissement
    if (squatTime > 0) {
        squatTime -= 1 * delta;
    }
    squatTime = Math.max(0, squatTime);
    
    
    // Gestion de la Kinect (déplacement, saut, se baisser)
    kinectManagement();
    
    
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
        squat();
        keysOnce[16] = true;
    } else if (!keys[16]) {
        keysOnce[16] = false;
    }
    
    
    // Si on est baissé
    if (squatTime) {
        
        // Animation : se baisser
        if (character.coyote.position.y > -2) {
            character.coyote.position.y -= 16 * delta;
        }
        character.coyote.position.y = Math.max(-2, character.coyote.position.y);
        
        character.endY = 6;
        
    } else {
        
        // Animation : se relever
        if (character.coyote.position.y < 1) {
            character.coyote.position.y += 16 * delta;
        }
        
        // Si on est entièrement relevé, change le masque de colision en Y
        if (character.coyote.position.y >= 1) {
            character.coyote.position.y = 1;
            character.endY = 8;
        }
    }
    
    onGround = false;
    
    
    // Empêche le personnage à rentrer dans le sol
    if (position.y <= 0) {
        position.y = 0;
        
        fallSpeed = Math.min(0, fallSpeed);
        
        onGround = true;
    }
    
    
    // Vitesse de déplacement du personnage avec l'effet de boost
    speed = VELOCITY + (isSwiftness * (Math.min(2, shieldTime)) * 64);
    position.z -= speed * delta;
    
    
    // Déplace le sol pour qu'il reste dans la vue
    while (camera.position.z < floor.position.z) {
        floor.position.z -= 64;
    }
    
    
    // Charge un niveau
    while (position.z < positionNextLevel + VIEW_DISTANCE + 64) {
        loadLevel(rand.int(1, NUMBER_LEVEL));
    }
    
    
    // Charge un décor
    while (position.z < positionNextDecor + VIEW_DISTANCE + 64) {
        
        // Position X : 1 chance sur 2 que le décor apparait à gauche de la route
        var x = rand.int() ? rand.int(-768, -48) : rand.int(48, 768);
        
        var decorName = rand.int() ? 'cactus' : 'stone';
        var index = decors.push(createObject(x, 0, positionNextDecor,
                                             [models[decorName]])) - 1;
        decors[index].name = decorName;
        
        // Si il s'agit d'une pierre, change de façon aléatoire sa taille en hauteur
        if (decorName == 'stone') {
            decors[index].scale.y *= rand.float(.5, 1.5);
        }
        
        // Donne une rotation aléatoire au décor
        decors[index].rotation.y = rand.float(2 * Math.PI);
        
        positionNextDecor -= rand.int(32, 128);
    }
    
    // Déplacement à gauche/droite du personnage
    if (position.x - roadPath * 21 > CHANGE_PATH_SPEED * delta ||
        roadPath * 21 - position.x > CHANGE_PATH_SPEED * delta) {
        
        if (position.x > roadPath * 21) {
            position.x -= CHANGE_PATH_SPEED * delta;
        } else {
            position.x += CHANGE_PATH_SPEED * delta;
        }
        
    } else {
        position.x -= position.x - roadPath * 21;
    }
    
    
    // Execute les tests pour les objets de la scène
    forEachBox();
    forEachSpike();
    forEachCoin();
    forEachDecor();
    
    
    // Si le tunnel sors de l'écran, le replace devant
    while (tunnel.position.z > camera.position.z + 2200) {
        
        tunnel.position.z -= rand.int(Math.max(6000, VIEW_DISTANCE + 2200), 10000);
    }
    
    distance = parseInt(position.z * -1 / 16);
    score = distance + 10 * coinsCollect;
    
    // La durée du bouclier ne peut pas être négative
    shieldTime = Math.max(0, shieldTime);
    
    
    // Animation de départ
    beginningAnimation();
    
    
    // Position de la caméra relative au personnage
    camera.position.set(position.x + viewX,
                        position.y + viewY,
                        position.z + viewZ);
    
    // Empêche la caméra d'être au dessus du tunnel
    if (camera.position.y > 68 &&
        camera.position.z <= tunnel.position.z + 8 &&
        camera.position.z >= tunnel.position.z - 2048) {
        
        camera.position.y = 68;
    }
    
    
    
    // --- AFFICHAGE ---
    
    // Affiche le contenu 3D à l'écran
    renderer.render(scene, camera);
    
    // Supprime le contenu du canvas 2D
    ctx.clearRect(0, 0, width, height);
    
    // Affiche le nombre d'image par seconde en haut à droite de l'écran
    ctx.font="32px Arial";
    ctx.textBaseline = 'top';
    
    // Affiche la jauge de bouclier
    ctx.fillStyle = isSwiftness ? '#FF8000' : '#C00020';
    ctx.fillRect(60, 20, Math.min(192, shieldTime * 19.2 * (isSwiftness+1)), 24);
    
    ctx.drawImage(images.interface, 0, 0, 256, 256);
    ctx.drawImage(isSwiftness ? images.iconLightning : images.iconShield, 16, 16);
    
    /*TEMPORAIRE*/
    ctx.fillStyle = fps < 50 ? 'red' : fps < 60 ? 'orange' : 'yellow';
    ctx.textAlign = 'right';
    ctx.fillText(fps + ' fps', width - 20, 20, 400);
    ctx.fillStyle = 'blue';
    ctx.fillText(Math.round(width / height * 10000) / 10000, width - 20, 60, 400);
    /*****/
    
    // Affichage de la distance et du nombre de pièces (avec une ombre au texte)
    for (var i = 0; i <= 2; i += 2) {
        
        ctx.fillStyle = !i ? 'rgba(0, 0, 0, .5)' : 'white';
        ctx.textAlign = 'left';
        ctx.fillText('Distance : ' + (getDistance() + 'm'), 62-i, 60-i);
        ctx.fillText('Pièces : ' + (coinsCollect), 62-i, 100-i);
    }
    
    lastTime = now;
}

// Réinitialise la partie
function reset() {
    
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    
    coinsCollect = 0;
    
    for (var i = 0; i < boxes.length; i++) {
        scene.remove(boxes[i]);
    }
    boxes = [];
    
    for (var i = 0; i < spikes.length; i++) {
        scene.remove(spikes[i]);
    }
    spikes = [];
    
    for (var i = 0; i < coins.length; i++) {
        scene.remove(coins[i]);
    }
    coins = [];
    
    for (var i = 0; i < decors.length; i++) {
        scene.remove(decors[i]);
    }
    decors = [];
    
    position.set(0, 0, 0);
    roadPath = 0;
    fallSpeed = 0;
    
    floor.position.z = 0;
    tunnel.position.z = -rand.int(3000, 6000);
    
    positionNextLevel = -400;
    positionNextDecor = rand.int(64) + VIEW_DISTANCE;
}



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
