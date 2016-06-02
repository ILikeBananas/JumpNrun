// ----- EXECUTE DIFFÉRENTS TESTS POUR LES PIÈCES -----
// Auteur : Sébastien Chappuis

// Execute pour chaque pièce
function forEachCoin() {
    // Fait tourner toutes les pièces sur elles-même
    coinsRotation += Math.PI * 1.25 * delta;
    
    // Pour chaque pièce
    for (var i = 0; i < coins.length; i++) {
        
        // Pièce
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
                
                // Si la pièce est verte/bleue/rouge/orange/jaune
                if (coins[i].name == 'coin5') {
                    coinsCollect += 5;
                } else if (coins[i].name == 'coin10') {
                    coinsCollect += 10;
                } else if (coins[i].name == 'coinShield') {
                    shieldTime = 10;
                    isSwiftness = false;
                } else if (coins[i].name == 'coinSwiftness') {
                    shieldTime = 5;
                    isSwiftness = true;
                } else {
                    coinsCollect++;
                }
                scene.remove(coin);
                delete coins[i];
                coins.clean();
            }
        }
    }
  }
