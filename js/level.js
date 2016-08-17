// ----- CHARGEMENT D'UN NIVEAU ALÉATOIRE -----
// Auteur : Sébastien Chappuis


// Charge le fichier d'un niveau à partir de son identifiant,
// retourne le contenu sous forme d'une chaîne de caractères
function loadFileLevel(idLevel) {
    
    var index = loadings.push(false) - 1;
    
    // Requête AJAX asynchrone chargant le niveau
    var xhr = $.ajax('levels/' + idLevel + '.txt')
        .done(function(level) {
            levels[idLevel] = level;
        })
        .fail(function() {
            levels[idLevel] = undefined;
        })
        .always(function() {
            loadings[index] = true;
    });
}


// Ajoute un niveau à la scène à partir de son identifiant
function createLevel(idLevel) {
    
    var level = levels[idLevel];
    
    // Si le niveau n'a pas pu être chargé
    if (!level) {
        level = 'cBBg s bs           ss';
    }
    
    // Remplace les sauts de ligne par un seul caractère : \n
    level = level.replace(/(\r\n|\r)/gm, '\n');
    
    // Supprime tous les retours à la ligne en fin de niveau
    level = level.replace(/\n+$/g,'');
    
    // Sépare en plusieurs ligne le niveau
    var lines = level.split('\n');
    level = '';
    
    // Pour chaque ligne
    for (var i = 0; i < lines.length; i++) {
        
        // Si une ligne à moins de 3 caractères, lui ajoute un/des espaces
        while (lines[i].length < 3) {
            lines[i] += ' ';
        }
        
        level += lines[i];
    }
    
    // Longueur du niveau
    var levelLength = 16 * parseInt((level.length - 1) / 3);
    
    // Position Z de la fin du niveau actuel
    var endZ = positionNextLevel - levelLength;
    
    // Espacement entre deux niveaux
    var spacingLevels = 256;
    
    // Position Z du début du prochain niveau
    positionNextLevel -= levelLength + spacingLevels + 16;
    
    // Si le niveau est inversé sur l'axe des X ou non
    var isLevelRevert = rand.int();
    
    // Pour chaque caractère composant le niveau
    for (var i = 0; i < level.length; i++) {
        
        var x = (i % 3 - 1) * 21;
        x = isLevelRevert ? -x : x;
        var z = endZ + parseInt(i / 3) * 16;
        var coinName =
             rand.int(4) ? 'coin5'      :
            (rand.int(3) ? 'coin10'     :
            (rand.int(3) ? 'coinShield' : 'coinSwiftness'));
        
        switch (level[i]) {
            case 1:
                
            case 'b': // Caisse (box)
                boxes.push(createObject(x, 8, z, [models.box], 16));
                break;
                
            case 'B': // Deux caisses empilées
                boxes.push(createObject(x, 8, z, [models.box], 16));
                boxes.push(createObject(x, 24, z, [models.box], 16));
                break;
                
            case 's': // Pique (spike)
                spikes.push(createObject(x, 8, z, [models.spikes], -8,-8,-8, 8,-4,8));
                break;
                
            case 'S': // Pique sur une caisse
                boxes.push(createObject(x, 8, z, [models.box], 16));
                spikes.push(createObject(x, 24, z, [models.spikes], -8,-8,-8, 8,-4,8));
                break;
                
            case 'c': // Pièce de valeur aléatoire (coin)
                coins.push(createObject(x, 8, z, [models[coinName]], 12));
                coins[coins.length-1].name = coinName;
                break;
                
            case 'C': // Pièce de valeur aléatoire sur une caisse
                boxes.push(createObject(x, 8, z, [models.box], 16));
                coins.push(createObject(x, 24, z, [models[coinName]], 12));
                coins[coins.length-1].name = coinName;
                break;
                
            case 'g': // Pièce en or (gold)
                coins.push(createObject(x, 8, z, [models.coin], 12));
                coins[coins.length-1].name = 'coin';
                break;
                
            case 'G': // Pièce en or sur une caisse
                boxes.push(createObject(x, 8, z, [models.box], 16));
                coins.push(createObject(x, 24, z, [models.coin], 12));
                coins[coins.length-1].name = 'coin';
                break;
                
            case '^': // Pièce donnant un boost
                coins.push(createObject(x, 8, z, [models.coinSwiftness], 12));
                coins[coins.length-1].name = 'coinSwiftness';
                break;
                
            case '-': // Caisse, pique et flèche sous laquel il faut passer
                boxes.push(createObject(x, 24, z, [models.box, models.arrow], 16));
                spikes.push(createObject(x, 8, z, [models.spikes], -8,2,-8, 8,8,8));
                var spike = spikes[spikes.length-1];
                spike.scale.y = 1.5;
                spike.position.y -= 4;
                spike.rotation.x = Math.PI;
                break;
        }
    }
}
