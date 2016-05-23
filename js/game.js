// ----- BOUCLE DU JEU (COMPOSANT UNE FRAME) -----
// Auteur : Sébastien Chappuis


// Boucle du jeu (1 itération = 1 frame)
function gameLoop() {
    
    requestAnimationFrame(gameLoop);
    
    now = Date.now();
    delta = (now - lastTime) / 1000;
    fps = parseInt(1 / delta * 1) / 1;
    delta = Math.min(.1, delta);
    
    
    // Vitesse de chute augmentant avec le temps
    fallSpeed += 384 * delta;
    
    // Limite la vitesse de chute
    if (fallSpeed > 256) {
        fallSpeed = 256;
    }
    
    character.children[5].material.opacity = flashOpacity;
    
    // Dissipe le flash
    if (flashOpacity > 0) {
        flashOpacity -= 2 * delta;
    }
    if (flashOpacity < 0) {
        flashOpacity = 0;
    }
    
    // Modifie, si besoin, le matériel du bouclier
    if (shieldMaterial == 'basic') {
        character.children[4].material = materials.shieldBasic;
        
    } else if (shieldMaterial == 'boost') {
        character.children[4].material = materials.shieldBoost;
    }
    
    shieldMaterial = '';
    
    // Diminue la durée du bouclier
    if (shieldTime > 0) {
        shieldTime -= delta;
        var opacity = shieldTime >= 2 ? .5 : shieldTime / 4;
        character.children[4].material.opacity = opacity;
    } else {
        character.children[4].material.opacity = 0;
    }
    
    // Si on a plus de bouclier
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
        if (positionCoyote.y > -2) {
            positionCoyote.y -= 16 * delta;
        }
        positionCoyote.y = Math.max(-2, positionCoyote.y);
        
        character.endY = 6;
        
    } else {
        
        // Animation : se relever
        if (positionCoyote.y < 1) {
            positionCoyote.y += 16 * delta;
        }
        
        // Si on est entièrement relevé, change le masque de colision en Y
        if (positionCoyote.y >= 1) {
            positionCoyote.y = 1;
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
    while (position.z < positionNextLevel + VIEW_DISTANCE) {
        loadLevel(rand.int(1, NUMBER_LEVEL));
    }
    
    
    // Charge un décor
    while (position.z < positionNextDecor + VIEW_DISTANCE) {
        
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
    
    // Déplacement à gauche/droite
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
    
    
    // Pour chaque caisse
    for (var i = 0; i < boxes.length; i++) {
        
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
            if (collision(character, box, -8, -8, -8, 8, 6-delta*(fallSpeed > 0 ? fallSpeed : 0), 8)) {
                // Si on n'a pas de bouclier
                if (!shieldTime) {
                    reset();
                } else {
                    // Si il ne s'agit pas du boost de vitesse, affaibli le bouclier
                    if (!isSwiftness) {
                        shieldTime--;
                        flashOpacity = 1;
                    }
                    box.name = 'ejected';
                    box['ejectSpeed'] = 64 + speed;
                    box['fallSpeed'] = -96;
                    
                    // Pour chaque piques
                    for (var j = 0; j < spikes.length; j++) {
                        
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
            ejectObstacle(box);
        }
    }
    
    
    // Pour chaque pique
    for (var i = 0; i < spikes.length; i++) {
        
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
                        flashOpacity = 1;
                    }
                    spike.name = 'ejected';
                    spike['ejectSpeed'] = 64 + speed;
                    spike['fallSpeed'] = -96;
                }
            }
            
        }
        
        if (spike.name == 'ejected') {
            ejectObstacle(spike);
        }
    }
    
    
    // Fait tourner toutes les pièces sur elles-même
    coinsRotation += Math.PI * 1.25 * delta; 
    
    // Pour chaque pièce
    for (var i = 0; i < coins.length; i++) {
        
        var coin = coins[i];
        
        // Si la pièce sort de l'écran
        if (coin.position.z >= camera.position.z + 16) {
            scene.remove(coin);
            delete coins[i];
            coins.clean();
            
        } else {
            
            coins[i].rotation.y = coinsRotation;
            
            // Si il y a une collision
            if (collision(character, coins[i])) {
                
                // Si la pièce est jaune/verte/bleue/rouge
                if (coins[i].name == 'coin') {
                    coinsCollect++;
                } else if (coins[i].name == 'coin5') {
                    coinsCollect += 5;
                } else if (coins[i].name == 'coin10') {
                    coinsCollect += 10;
                } else if (coins[i].name == 'coinShield') {
                    shieldTime = 10;
                    isSwiftness = false;
                    shieldMaterial = 'basic';
                } else if (coins[i].name == 'coinSwiftness') {
                    shieldTime = 5;
                    isSwiftness = true;
                    shieldMaterial = 'boost';
                }
                coins[i].position.y = -64;
                scene.remove(coins[i]);
            }
        }
    }
    
    
    // Pour chaque décor
    for (var i = 0; i < decors.length; i++) {
        
        var decor = decors[i];
        
        // Si le décor sort de l'écran
        if (camera.rotation.y == 0 && decor.position.z >= camera.position.z + 16) {
            scene.remove(decor);
            delete decors[i];
            decors.clean();
        }
    }
    
    
    // Si le tunnel sors de l'écran, le replace devant
    while (tunnel.position.z > camera.position.z + 2200) {
        
        tunnel.position.z -= rand.int(8000, 12000) + VIEW_DISTANCE;
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
    
    // Affiche le contenu à l'écran
    renderer.render(scene, camera);
    
    
    // Supprime le contenu du canvas 2D
    ctx.clearRect(0, 0, width, height);
    
    // Affiche le nombre d'image par seconde en haut à droite de l'écran
    ctx.font="32px Arial";
    ctx.textBaseline = 'top';
    
    // Affiche la jauge de bouclier
    ctx.fillStyle = isSwiftness ? '#FF8000' : '#C00020';
    ctx.fillRect(60, 20, shieldTime * 19.2 * (isSwiftness+1), 24);
    
    ctx.drawImage(images.interface, 0, 0, 256, 256);
    ctx.drawImage(isSwiftness ? images.iconLightning : images.iconShield, 16, 16);
    
    ctx.fillStyle = fps < 50 ? 'red' : fps < 60 ? 'orange' : 'yellow';
    ctx.textAlign = 'right';
    ctx.fillText(fps + ' fps', width - 20, 20, 400);
    ctx.fillStyle = 'blue';
    ctx.fillText(Math.round(width / height * 10000) / 10000, width - 20, 60, 400);
    
    ctx.fillStyle = 'rgba(0, 0, 0, .5)';
    ctx.textAlign = 'left';
    ctx.fillText('Distance : ' + (distance + 'm'), 62, 60);
    ctx.fillText('Pièces : ' + (coinsCollect), 62, 100);
    
    ctx.fillStyle = 'white';
    ctx.fillText('Distance : ' + (distance + 'm'), 60, 58);
    ctx.fillText('Pièces : ' + (coinsCollect), 60, 98);
    
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


// Éjecte l'obstacle passé en paramètre
function ejectObstacle(obj) {
    
    if (obj.position.z <= camera.position.z) {
        
        obj.position.y -= obj.fallSpeed * delta;
        obj.fallSpeed += 384 * delta;
        obj.position.z -= obj.ejectSpeed * delta;
    }
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
