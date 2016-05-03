// Boucle du jeu
function gameLoop() {
    
    requestAnimationFrame(gameLoop);
    
    now = Date.now();
    delta = (now - lastTime) / 1000;
    fps = parseInt(1 / delta * 1) / 1;
    if (delta > .05) {
        delta = .05;
    }
    
    
    // Diminue la durée du bouclier
    if (shieldTime > 0) {
        shieldTime -= delta;
    }
    // Le temps ne peut pas être négatif
    if (shieldTime < 0) {
        shieldTime = 0;
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
    if (caracter.position.y <= 0) {
        caracter.position.y = 0;
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
    
    isSquat = false;
    
    // Touche d'accroupissement appuyé
    if (keys[16]) {
        isSquat = true;
        keysOnce[16] = true;
    }
    
    if (isSquat) {
        caracter.children[0].position.y = -3;
        caracter.endY = 6;
    } else {
        caracter.children[0].position.y = 1;
        caracter.endY = 8;
    }
    
    // Si on est sur le sol, on ne chute pas
    if (onGround && fallSpeed > 0) {
        fallSpeed = 0;
    }
    
    onGround = false;
    
    // Déplacement du personnage
    caracter.position.z -= 112 * delta;
    
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
        if (boxes[i].position.z >= camera.position.z + 16) {
            scene.remove(boxes[i]);
        }
        
        // Si fonce dans une caisse
        if (collision(caracter, boxes[i], -8,-8,-8, 8,0,8)) {
            
            // Si on n'a pas de bouclier
            if (!shieldTime) {
                reset();
            } else {
                boxes[i].position.z -= delta * 128;
            }
            
        } else if (collision(caracter, boxes[i])) {
            
            caracter.position.y = boxes[i].position.y + 8;
            onGround = true;
            
        }
    }
    
    // Pour chaque pique
    for (var i = 0; i < spikes.length; i++) {
        if (spikes[i].position.z >= camera.position.z + 16) {
            scene.remove(spikes[i]);
        }
        
        // Si il y a une collision
        if (collision(caracter, spikes[i])) {
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
            if (collision(caracter, coins[i])) {
                
                // Si la pièce est jaune/verte/bleue/rouge
                if (coins[i].name == 'coin') {
                    coinsCollect++;
                } else if (coins[i].name == 'coin5') {
                    coinsCollect += 5;
                } else if (coins[i].name == 'coin10') {
                    coinsCollect += 10;
                }  else if (coins[i].name == 'coinShield') {
                    shieldTime = 20;
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
    
    // Animation de départ
    
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
    if (camera.rotation.y == 0 && camera.rotation.x > -Math.PI / 6 && !yolo) {
        camera.rotation.x -= delta * .5;
    }
    if (camera.rotation.x < -Math.PI / 6) {
        camera.rotation.x = -Math.PI / 6;
    }
    
    
    
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
    ctx.fillStyle = '#C0001A';
    ctx.fillRect(60, 20, shieldTime * 9.6, 24);
    
    // Affichage de l'interface
    var interface = new Image();
    interface.src = 'img/other/interface.png';
    ctx.drawImage(interface, 0, 0);
    
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