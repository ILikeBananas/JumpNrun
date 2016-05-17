// Boucle du jeu
function gameLoop() {
    
    requestAnimationFrame(gameLoop);
    
    now = Date.now();
    delta = (now - lastTime) / 1000;
    fps = parseInt(1 / delta * 1) / 1;
    if (delta > .1) {
        delta = .1;
    }
    
    
    // Vitesse de chute augmentant avec le temps
    fallSpeed += 384 * delta;
    
    // Limite la vitesse de chute
    if (fallSpeed > 256) {
        fallSpeed = 256;
    }
    
    caracter.children[5].material.opacity = flashOpacity;
    
    // Dissipe le flash
    if (flashOpacity > 0) {
        flashOpacity -= 2 * delta;
    }
    if (flashOpacity < 0) {
        flashOpacity = 0;
    }
    
    // Modifie, si besoin, le matériel du bouclier
    if (shieldMaterial == 'basic') {
        caracter.children[4].material = materials.shieldBasic;
        
    } else if (shieldMaterial == 'boost') {
        caracter.children[4].material = materials.shieldBoost;
    }
    
    shieldMaterial = '';
    
    // Diminue la durée du bouclier
    if (shieldTime > 0) {
        shieldTime -= delta;
        var opacity = shieldTime >= 2 ? .5 : shieldTime / 4;
        caracter.children[4].material.opacity = opacity;
    } else {
        caracter.children[4].material.opacity = 0;
    }
    if (shieldTime <= 0) {
        isSwiftness = false;
    }
    
    // Fait chuter/sauter le personnage
    caracter.position.y -= fallSpeed * delta;
    
    // Diminue la durée de l'accroupissement
    if (squatTime > 0) {
        squatTime -= 1 * delta;
    }
    if (squatTime < 0) {
        squatTime = 0;
    }
    
    // Si la camera est aligner verticalement, autorise les commandes
    if (viewX == 0) {
        
        // Touche gauche appuyée
        if (keys[65] && !keysOnce[65]) {
            if (roadPath > 0) {
                roadPath--;
            }
            keysOnce[65] = true;
        } else if (!keys[65]) {
            keysOnce[65] = false;
        }

        // Touche droite appuyée
        if (keys[68] && !keysOnce[68]) {
            if (roadPath < 2) {
                roadPath++;
            }
            keysOnce[68] = true;
        } else if (!keys[68]) {
            keysOnce[68] = false;
        }

        // Touche de saut appuyée
        if (keys[32] && !keysOnce[32]) {
            if (onGround) {
                fallSpeed = -JUMP_SPEED; // Saut
                caracter.position.y = Math.ceil(caracter.position.y);
                onGround = false;
                squatTime = 0; // Ne se baisse plus
            }
            keysOnce[32] = true;
        } else if (!keys[32]) {
            keysOnce[32] = false;
        }
        
        // Touche d'accroupissement appuyé
        if (keys[16]) {
            squatTime = 1; // Se baisser pendant 1 seconde
            keysOnce[16] = true;
        }
    }
    
    // Si on est baissé
    if (squatTime) {
        if (coyote.position.y > -2) {
            coyote.position.y -= 16 * delta;
        }
        if (coyote.position.y < -2) {
            coyote.position.y = -2;
        }
        caracter.endY = 6;
    } else {
        if (coyote.position.y < 1) {
            coyote.position.y += 16 * delta;
        }
        if (coyote.position.y >= 1) {
            coyote.position.y = 1;
            caracter.endY = 8;
        }
    }
    
    onGround = false;
    
    // Empêche le personnage à rentrer dans le sol
    if (caracter.position.y <= 0) {
        caracter.position.y = 0;
        
        if (fallSpeed > 0) {
            fallSpeed = 0;
        }
        onGround = true;
    }
    
    // Déplacement du personnage (se déplace plus vite avec l'effet de boost)
    speed = velocity + (isSwiftness*(shieldTime >= 2 ? 2 : shieldTime)*64);
    caracter.position.z -= speed * delta;
    
    // Déplace le sol pour qu'il reste dans la vue
    if (camera.position.z < floor.position.z) {
        floor.position.z -= 64;
    }
    
    // Charge un niveau
    if (caracter.position.z < positionEndLevel + 800) {
        loadLevel(rand.int(1, NUMBER_LEVEL));
    }
    
    // Charge un décor
    if (caracter.position.z < positionNextDecor + 800) {
        var x = rand.int() ? rand.int(-768, -48) : rand.int(48, 768);
        var decorName = rand.int() ? 'cactus' : 'rock';
        var index = decors.push(createObject(x, 0, camera.position.z - 896, [models[decorName]])) - 1;
        if (decorName == 'rock') {
            decors[index].scale.y *= rand.float(1, 2);
        }
        decors[index].rotation.y = rand.int(Math.PI);
        
        positionNextDecor = caracter.position.z - 800 - rand.int(32, 128);
    }
    
    // Déplacement à gauche/droite
    if (caracter.position.x - (roadPath-1) * 21 > 128 * delta ||
        (roadPath-1) * 21 - caracter.position.x > 128 * delta) {
        if (caracter.position.x > (roadPath-1) * 21) {
            caracter.position.x -= 128 * delta;
        } else {
            caracter.position.x += 128 * delta;
        }
    } else {
        caracter.position.x -= caracter.position.x - (roadPath-1) * 21;
    }
    
    // Pour chaque caisse
    for (var i = 0; i < boxes.length; i++) {
        
        var box = boxes[i];
        
        // Si la caisse sort de l'écran
        if (box.position.z >= camera.position.z + 16) {
            scene.remove(box);
        }
        
        // Si la caisse n'est pas éjectée
        if (box.name == '') {
            
            // Si fonce dans une caisse
            if (collision(caracter, box, -8, -8, -8, 8, 6-delta*(fallSpeed > 0 ? fallSpeed : 0), 8)) {
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
                
            } else if (collision(caracter, box)) {
                caracter.position.y = box.position.y + 8;
                if (fallSpeed > 0) {
                    fallSpeed = 0;
                }
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
        }
        
        // Si le pique n'est pas éjecté
        if (spike.name == '') {
            
            // Si on fonce dans des piques
            if (collision(caracter, spike)) {
                
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
    
    // Pour chaque pièce
    for (var i = 0; i < coins.length; i++) {
        
        if (coins[i].position.z >= camera.position.z + 16) {
            scene.remove(coins[i]);
            
        } else {
            
            coins[i].rotation.y += 4 * delta;
            
            // Si il y a une collision
            if (collision(caracter, coins[i])) {
                
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
    
    // Pour chaque décor, si il sort de l'écran
    for (var i = 0; i < decors.length; i++) {
        if (decors[i].position.z >= camera.position.z + 16) {
            scene.remove(decors[i]);
        }
    }
    
    distance = parseInt(caracter.position.z * -1 / 16);
    score = distance + 10 * coinsCollect;
    
    // La durée du bouclier ne peut pas être négative
    if (shieldTime < 0) {
        shieldTime = 0;
    }
    
    
    // Animation de départ
    beginningAnimation();
    
    
    // Position de la caméra relative au personnage
    camera.position.set(caracter.position.x + viewX,
                        caracter.position.y + viewY,
                        caracter.position.z + viewZ);
    
    // Affiche le contenu à l'écran
    renderer.render(scene, camera);
    
    // Affiche le nombre d'image par seconde en haut à droite de l'écran
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font="32px Arial";
    ctx.textBaseline = 'top';
    
    // Affiche la jauge de bouclier
    ctx.fillStyle = isSwiftness ? '#FF8000' : '#C00020';
    ctx.fillRect(60, 20, shieldTime * 19.2 * (isSwiftness+1), 24);
    
    ctx.drawImage(images.interface, 0, 0);
    ctx.drawImage(isSwiftness ? images.iconLightning : images.iconShield, 16, 16);
    
    ctx.fillStyle = fps < 50 ? 'red' : fps < 60 ? 'orange' : 'yellow';
    ctx.textAlign = 'right';
    ctx.fillText(fps + ' fps', width - 20, 20, 400);
    
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
    
    /*
    alert('Vous êtes mort.\n\n' +
          'Distance parcouru : ' + distance + ' mètres\n' +
          'Nombre de pièces collectées : ' + coinsCollect + '\n\n' +
          'Score final : ' + score);
          */
    
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
    
    caracter.position.set(0, 0, 0);
    roadPath = 1;
    fallSpeed = 0;
    
    floor.position.z = 0;
    
    positionEndLevel = 0;
    positionNextDecor = rand.int(64);
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
    if (viewX < 0) {
        viewX = 0;
    }
    
    if (viewY < 40) {
        viewY += delta * 6;
    }    
    if (viewY > 40) {
        viewY = 40;
    }
    
    if (viewZ < 40) {
        viewZ += delta * 32;
    }    
    if (viewZ > 40) {
        viewZ = 40;
    }
    
    if (camera.rotation.y > 0) {
        camera.rotation.y -= delta;
    }
    if (camera.rotation.y < 0) {
        camera.rotation.y = 0;
    }
    
    if (camera.rotation.y == 0 && camera.rotation.x > -Math.PI / 6) {
        camera.rotation.x -= delta * .5;
    }
    if (camera.rotation.x < -Math.PI / 6) {
        camera.rotation.x = -Math.PI / 6;
    }
}