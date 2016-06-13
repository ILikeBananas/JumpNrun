// ----- BOUCLE DU JEU (COMPOSANT UNE FRAME) -----
// Auteur : Sébastien Chappuis


// Boucle du jeu (1 itération = 1 frame)
function gameLoop() {
    
    var now = Date.now();
    delta = (now - lastTime) / 1000;
    delta = Math.min(.1, delta);
    
    // Vitesse de chute augmentant avec le temps
    fallSpeed += 384 * delta;
    fallSpeed = Math.min(384, fallSpeed);
    
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
    
    
    // Test les commandes du clavier
    testCommands();
    

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
    position.z -= getCharacterSpeed() * delta;
    
    // La durée du bouclier ne peut pas être négative
    shieldTime = Math.max(0, shieldTime);
    
    
    // Execute les tests pour les objets de la scène
    forEachBox();
    forEachSpike();
    forEachCoin();
    forEachDecor();
    
    
    // Déplace le sol pour qu'il reste dans la vue
    while (camera.position.z < floor.position.z) {
        floor.position.z -= 64;
    }
    
    // Si le tunnel sors de l'écran, le replace devant
    while (tunnel.position.z > camera.position.z + 2200) {
        
        tunnel.position.z -= rand.int(Math.max(6000, VIEW_DISTANCE + 2200), 10000);
    }
    
        
    // Charge un niveau
    while (position.z < positionNextLevel + VIEW_DISTANCE + 64) {
        createLevel(rand.int(1, NUMBER_LEVEL));
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
    
    // Supprime le contenu du canvas 2D de la frame précédente
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    
    
    ctx.textBaseline = 'alphabetic';

    // Affiche la jauge de bouclier
    ctx.fillStyle = isSwiftness ? '#FF8000' : '#C00020';
    ctx.fillRect(60, 20, Math.min(192, shieldTime * 19.2 * (isSwiftness+1)), 24);

    ctx.drawImage(images.interface, 0, 0, 256, 256);
    ctx.drawImage(isSwiftness ? images.iconLightning : images.iconShield, 16, 16);

    /*TEMPORAIRE*/
    ctx.font = '28px Arial';
    ctx.fillStyle = getFps() < 50 ? 'red' : getFps() < 60 ? 'orange' : 'yellow';
    ctx.textAlign = 'right';
    ctx.fillText(getFps() + ' fps', innerWidth - 20, 45, 400);
    ctx.fillStyle = 'blue';
    ctx.fillText(Math.round(innerWidth / innerHeight * 10000) / 10000, innerWidth - 20, 815, 400);
    /*****/
    
    // Affichage de la distance et du nombre de pièces (avec une ombre au texte
    for (var i = 0; i <= 2; i += 2) {
        
        ctx.font = '32px Arial';
        ctx.fillStyle = i ? 'white' : 'rgba(0, 0, 0, .5)';
        ctx.textAlign = 'left';
        ctx.fillText('Distance : ' + (getDistance() + 'm'), 62-i, 86-i);
        ctx.fillText('Pièces : ' + (coinsCollect), 62-i, 126-i);
        ctx.font = '40px Arial';
        ctx.fillStyle = i ? '#FFFF80' : 'rgba(0, 0, 0, .5)';
        ctx.fillText('Score : ' + (getScore()), 18-i, 170-i);
    }
    
    
    // Si la boucle doit contunuer à s'executer
    if (executionGameLoop) {
        
        // Rapelle la fonction pour qu'elle s'execute la frame suivante
        requestAnimationFrame(gameLoop);
    }
    
    lastTime = now;
}
