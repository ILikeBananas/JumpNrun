// Boucle du jeu
function gameLoop() {
    
    requestAnimationFrame(gameLoop);
    
    now = Date.now();
    delta = (now - lastTime) / 1000;
    fps = parseInt(1 / delta * 1) / 1;
    if (delta > .025) {
        delta = .025;
    }
    
    // Vitesse de chute augmentant avec le temps
    fallSpeed += 384 * delta;
    
    // Limite la vitesse de chute
    if (fallSpeed > 256) {
        fallSpeed = 256;
    }
    
    // Fait chuter/sauter le personnage
    caracter.position.y -= fallSpeed * delta;
    
    // Empêche le personnage à rentrer dans le sol
    if (caracter.position.y <= 8) {
        caracter.position.y = 8;
        onGround = true;
    }
    
    
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
            fallSpeed = -128; // Saut
            onGround = false;
        }
        keysOnce[32] = true;
    } else if (!keys[32]) {
        keysOnce[32] = false;
    }
    
        
    // Si on est sur le sol, on ne chute pas
    if (onGround && fallSpeed > 0) {
        fallSpeed = 0;
    }
    
    onGround = false;
    
    // Déplacement du personnage
    caracter.position.z -= 96 * delta;
    
    // Déplace la route et le sable pour qu'ils restent dans la vue
    if (camera.position.z < road.position.z + 448) {
        road.position.z -= 64;
        floor.position.z -= 64;
    }
    
    // Charge un niveau
    if (camera.position.z < positionEndLevel + 800) {
        loadLevel(rand.int(1, NUMBER_LEVEL));
    }
    
    distanceNextDecor -= 96 * delta
    
    // Charge un décor
    if (distanceNextDecor <= 0) {
        rand.int() ? decors.push(modelCactus.clone()) : decors.push(modelRock.clone());
        var decor = decors[decors.length-1];
        var x = rand.int() ? rand.int(-768, -48) : rand.int(48, 768);
        decor.position.set(x, 0, camera.position.z - 896);
        decor.rotation.y = rand.int(0, Math.PI);
        scene.add(decor);
        distanceNextDecor = rand.int(32, 128);
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
        if (boxes[i].position.z >= camera.position.z + 16) {
            scene.remove(boxes[i]);
        }
        
        // Si il y a une collision
        if (collision(boxes[i], -8, -8, -8, 8, 2, 8)) {
            
            reset();
            
        } else if (collision(boxes[i], -8, 2, -8, 8, 8, 8)) {
            
            caracter.position.y = boxes[i].position.y + 16;
            onGround = true;
        }
    }
    
    // Pour chaque pique
    for (var i = 0; i < spikes.length; i++) {
        if (spikes[i].position.z >= camera.position.z + 16) {
            scene.remove(spikes[i]);
        }
        
        // Si il y a une collision
        if (collision(spikes[i], -8, -8, -8, 8, -6, 8)) {
            reset();
        }
    }
        
    // Pour chaque pièce
    for (var i = 0; i < coins.length; i++) {
        if (coins[i].position.z >= camera.position.z + 16) {
            scene.remove(coins[i]);
            
        } else {
            
            coins[i].rotation.y += 4 * delta;
            
            // Si il y a une collision
            if (collision(coins[i], -2, -2, -2, 2, 2, 2)) {
                
                coinsCollect++;
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
    
    // Position de la caméra relative au personnage
    camera.position.set(caracter.position.x,
                        caracter.position.y + 32,
                        caracter.position.z + 40);
    
    // Affiche le contenu à l'écran
    renderer.render(scene, camera);
    
    // Affiche le nombre d'image par seconde en haut à droite de l'écran
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font="30px Arial";
    ctx.textBaseline = 'top';
    
    ctx.fillStyle = fps < 50 ? 'red' : fps < 60 ? 'orange' : 'yellow';
    ctx.textAlign = 'right';
    ctx.fillText(fps + ' fps', width - 20, 20, 400);
    
    ctx.fillStyle = 'rgba(0, 0, 0, .5)';
    ctx.textAlign = 'left';
    ctx.fillText('Distance : ' + (distance + 'm'), 22, 22, 400);
    ctx.fillText('Pièces : ' + (coinsCollect), 22, 57, 400);
    ctx.fillText('Score : ' + (score), 22, 92, 400);
    
    ctx.fillStyle = 'white';
    ctx.fillText('Distance : ' + (distance + 'm'), 20, 20, 400);
    ctx.fillText('Pièces : ' + (coinsCollect), 20, 55, 400);
    ctx.fillText('Score : ' + (score), 20, 90, 400);
    
    lastTime = now;
}

// Réinitialise la partie
function reset() {
    
    alert('Vous êtes mort.\n\n' +
          'Distance parcouru : ' + distance + ' mètres\n' +
          'Nombre de pièces collectées : ' + coinsCollect + '\n\n' +
          'Score final : ' + score);
    
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
    
    caracter.position.set(0, 8, 0);
    roadPath = 1;
    fallSpeed = 0;
    
    road.position.z = floor.position.z = -448;
    
    positionEndLevel = 0;
    distanceNextDecor = rand.int(0, 64);
}