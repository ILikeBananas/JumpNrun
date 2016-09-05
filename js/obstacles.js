// ----- FONCTIONS LIÉES AU OBSTACLES -----
// Auteur : Sébastien Chappuis

// Lorsque le personnage percute un obstacle
// obstacle : object que le personnage doit percuter
// canWalkOn : si vrai, le personnage peut marcher sur l'obstacle
// ejectSpike : si vrai, l'obstacle éjecté transporte les piques avec lui
function collisionObstacle(obstacle, canWalkOn, ejectSpike) {
    
    canWalkOn  === undefined ? false : canWalkOn;
    ejectSpike === undefined ? false : ejectSpike;
    
    // Si l'obstacle n'est pas éjectée
    if (obstacle.name == '') {
        
        // Hauteur jusqu'à laquelle la collision est mortèle
        var collisionEndY = obstacle.endY - (canWalkOn ?
                                             2 + deltaTime * Math.max(0, fallSpeed)
                                             : 0);
        
        // Si fonce dans un obstacle
        if (collision(character, obstacle, obstacle.startX, obstacle.startY, obstacle.startZ,
                      obstacle.endX, collisionEndY, obstacle.endZ)) {
            
            // Si on n'a pas de bouclier
            if (!shieldTime) {
                endGame();
                
            } else {
                
                // Si il ne s'agit pas du boost de vitesse, affaibli le bouclier
                if (!isSwiftness) {
                    shieldTime--;
                    character.flash.material.opacity = 1;
                }
                
                obstacle.name = 'ejected';
                obstacle['ejectSpeed'] = 64 + getCharacterSpeed();
                obstacle['fallSpeed'] = -96;
                
                // Si on éjecte un pique avec
                if (ejectSpike) {
                    
                    // Pour chaque pique
                    for (var j = 0; j < spikes.length; j++) {
                        
                        // Si un pique est collé à l'obstacle éjectée, l'éjecte aussi
                        if (obstacle.position.x == spikes[j].position.x &&
                            obstacle.position.z == spikes[j].position.z) {
                            
                            spikes[j].name = 'ejected';
                            spikes[j]['ejectSpeed'] = 64 + getCharacterSpeed();
                            spikes[j]['fallSpeed'] = -96;
                        }
                    }
                }
            }

        } else if (canWalkOn && collision(character, obstacle)) {
            position.y = obstacle.position.y + obstacle.endY;
            fallSpeed = Math.min(0, fallSpeed);
            onGround = true;
        }
    }
    
    // Si l'obstacle est éjectée
    if (obstacle.name == 'ejected') {
        moveEjectedObstacle(obstacle);
    }
}



// Éjecte l'obstacle passé en paramètre
function moveEjectedObstacle(obj) {
    
    if (obj.position.z <= camera.position.z) {
        
        obj.position.y -= obj.fallSpeed * deltaTime;
        obj.fallSpeed += GRAVITY * deltaTime;
        obj.fallSpeed = Math.min(640, obj.fallSpeed);
        obj.position.z -= obj.ejectSpeed * deltaTime;
    }
}
