var now = Date.now();
var lastTime = now;
// Secondes écoulée par image
var delta = 0;
// Images par secondes
var fps = 0;
// Largeur de la fenêtre du jeu
var width = window.innerWidth;
// Hauteur de la fenêtre du jeu
var height = window.innerHeight;

// Si le jeu est chargée ou non
var gameLoaded = false;
// Tableau de booléens des touches appuyées
var keys = [];
// Tableau de booléens des touches qui viennent d'être appuyées
var keysOnce = [];
// Distance parcouru (1 bloc = 1 mètre)
var distance = 0;
// Nombre de pièces collectées
var coinsCollect = 0;
// Score obtenu
var score = 0;
// Chemin sur la route (0 = Gauche, 1 = Millieu, 2 = Droite)
var roadPath = 1;
// Vitesse du chute
var fallSpeed = 0;
// Si on est au sol ou non
var onGround = false;
// Distance avant de faire apparaître un décor
var distanceNextDecor = rand.int(0, 64);

// Canvas 2D
var canvas;
// Contexte du canvas 2D
var ctx;

// Position Z de la fin du dernier niveau chargé
var positionEndLevel = 0;

// Canvas en 2 dimensions
canvas = document.getElementById('canvas2d');
canvas.width = width
canvas.height = height
ctx = canvas.getContext('2d');

// Caméra
var camera = new THREE.PerspectiveCamera(70, width / height, 1, 800);
camera.rotation.x = -Math.PI / 6;

// Scène et brouillard
var scene = new THREE.Scene();
var fog = new THREE.Fog('#80C0FF', 200, 800);
scene.fog = fog;

var ambLight = new THREE.AmbientLight('#C0C0C0');
scene.add(ambLight);

var light = new THREE.SpotLight('#FF0000', 1, 0, Math.PI / 2 );
light.position.set(0, 1000, -256);
light.target.position.set( 0, 0, 0 );
light.castShadow = true;
scene.add(light);

// Liste des textures
var textures = {
    
    road: new THREE.TextureLoader().load('img/textures/road.png'),
    sand: new THREE.TextureLoader().load('img/textures/sand.png'),
    rock: new THREE.TextureLoader().load('img/textures/rock.png'),
    cactus: new THREE.TextureLoader().load('img/textures/cactus.png'),
    fur: new THREE.TextureLoader().load('img/textures/fur.png'),
    box: new THREE.TextureLoader().load('img/textures/box.png'),
    iron: new THREE.TextureLoader().load('img/textures/iron.png'),
    test: new THREE.TextureLoader().load('img/textures/test.png'),
};
textures.road.wrapS = textures.road.wrapT = THREE.RepeatWrapping;
textures.road.repeat.set(1, 16);

textures.sand.wrapS = textures.sand.wrapT = THREE.RepeatWrapping;
textures.sand.repeat.set(512, 64);

textures.rock.wrapS = textures.rock.wrapT = THREE.RepeatWrapping;
textures.rock.repeat.set(.005, .005);

textures.cactus.wrapS = textures.cactus.wrapT = THREE.RepeatWrapping;
textures.cactus.repeat.set(.25, .25);


// Liste des reflets
var reflexions = {
    
    dull: new THREE.TextureLoader().load('img/env/dull.png'),
    bright: new THREE.TextureLoader().load('img/env/bright.png'),
    gold: new THREE.TextureLoader().load('img/env/gold.png'),
    test: new THREE.TextureLoader().load('img/env/test.png'),
};

reflexions.dull.mapping = THREE.SphericalReflectionMapping;
reflexions.bright.mapping = THREE.SphericalReflectionMapping;
reflexions.gold.mapping = THREE.SphericalReflectionMapping;
reflexions.test.mapping = THREE.SphericalReflectionMapping;


// Liste des matériaux
var materials = {
    
    test: new THREE.MeshBasicMaterial({map: textures.test, envMap: reflexions.dull}),
    road: new THREE.MeshBasicMaterial({map: textures.road}),
    sand: new THREE.MeshBasicMaterial({map: textures.sand}),
    rock: new THREE.MeshBasicMaterial({map: textures.rock, envMap: reflexions.dull}),
    cactus: new THREE.MeshBasicMaterial({map: textures.cactus, envMap: reflexions.dull}),
    fur: new THREE.MeshBasicMaterial({map: textures.fur, envMap: reflexions.dull}),
    box: new THREE.MeshBasicMaterial({map: textures.box, envMap: reflexions.dull}),
    iron: new THREE.MeshBasicMaterial({color: '#C0C0C0', envMap: reflexions.bright}),
    coin: new THREE.MeshBasicMaterial({color: '#FFFFFF', envMap: reflexions.gold}),
};


// Liste des formes géométriques
var geometries = {
    
    cube: new THREE.BoxBufferGeometry(16, 16, 16),
    road: new THREE.BoxBufferGeometry(64, 0, 1024),
    floor: new THREE.BoxBufferGeometry(8192, 0, 1024),
};



// Création de la route
var road = new THREE.Mesh(geometries.road, materials.road);
road.position.z = -512;
road.receiveShadow = true;
scene.add(road);

// Création du sol
var floor = new THREE.Mesh(geometries.floor, materials.sand);
floor.position.set(0, -0.01, -512);
floor.receiveShadow = true;
scene.add(floor);

// Liste des caisses
var boxes = [];
// Objet sur lequel les caisses seront créées
var modelBox = new THREE.Mesh(geometries.cube, materials.box);
modelBox.receiveShadow = true;

// Liste des piques
var spikes = [];
// Objet sur lequel les piques seront créés
var modelSpike;
// Chargement du modèle 3D et du matériel des piques
var loader = new THREE.OBJLoader();
loader.load( 'obj/spikes.obj', function (object) {
    
    object.traverse(function (child) {
        
        if (child instanceof THREE.Mesh) {
            child.material = materials.iron;
        }
    });
    
    modelSpike = object;
    gameLoaded = true;
});

// Liste des pièces
var coins = [];
// Objet sur lequel les pièces seront créées
var modelCoin;
// Chargement du modèle 3D et du matériel des pièces
var loader = new THREE.OBJLoader();
loader.load( 'obj/coin.obj', function (object) {
    
    object.traverse(function (child) {
        
        if (child instanceof THREE.Mesh) {
            child.material = materials.coin;
        }
    });
    
    modelCoin = object;
    gameLoaded = true;
});

// Liste des piques
var spikes = [];
// Objet sur lequel les piques seront créés
var modelSpike;
// Chargement du modèle 3D et du matériel des piques
var loader = new THREE.OBJLoader();
loader.load( 'obj/spikes.obj', function (object) {
    
    object.traverse(function (child) {
        
        if (child instanceof THREE.Mesh) {
            child.material = materials.iron;
        }
    });
    
    modelSpike = object;
    gameLoaded = true;
});

// Liste des décors
var decors = [];
// Objet sur lequel les décors de type cactus seront créés
var modelCactus;
// Chargement du modèle 3D et du matériel des piques
var loader = new THREE.OBJLoader();
loader.load( 'obj/cactus.obj', function (object) {
    
    object.traverse(function (child) {
        
        if (child instanceof THREE.Mesh) {
            child.material = materials.cactus;
        }
    });
    
    modelCactus = object;
    gameLoaded = true;
});
// Objet sur lequel les décors de type pierre seront créés
var modelRock;
// Chargement du modèle 3D et du matériel des piques
var loader = new THREE.OBJLoader();
loader.load( 'obj/rock.obj', function (object) {
    
    object.traverse(function (child) {
        
        if (child instanceof THREE.Mesh) {
            child.material = materials.rock;
        }
    });
    
    modelRock = object;
    gameLoaded = true;
});

// Personnage jouable
var caracter = new THREE.Mesh(geometries.cube, materials.iron);
caracter.position.set(0, 8, -40);
scene.add(caracter);


// Rendu
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor('#80C0FF');
renderer.domElement.setAttribute('id', 'canvas3d');
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

document.body.appendChild(renderer.domElement); // Créer le canvas

window.addEventListener('resize', onWindowResize, false);



// Lorsque l'on change la taille de la fenêtre
function onWindowResize() {
    
    width = window.innerWidth;
    height = window.innerHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
}



// Lorsque l'on appuie une touche
$(document).keydown(function (e) {
    keys[e.which] = true;
});

// Lorsque l'on relâche une touche
$(document).keyup(function (e) {
    keys[e.which] = false;
});

// Lorsque l'on scroll
$(document).scroll(function() {
	$(this).scrollLeft(0).scrollTop(0);
});








var interval = setInterval(waiting, 10);

// Tant que le jeu n'est pas chargée, attend...
function waiting() {
    if (gameLoaded) {
        clearInterval(interval);
        gameLoop();
    }
}

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
        loadLevel(rand.int(0, 2));
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
            boxes[i].remove();
        }
        
        // Si il y a une collision
        if (collision(boxes[i], -8, -8, -8, 8, 2, 8)) {
            
            caracter.position.z += 96 * delta;
            
        } else if (collision(boxes[i], -8, 2, -8, 8, 8, 8)) {
            
            caracter.position.y = boxes[i].position.y + 16;
            onGround = true;
        }
    }
    
    // Pour chaque pique
    for (var i = 0; i < spikes.length; i++) {
        if (spikes[i].position.z >= camera.position.z + 16) {
            scene.remove(spikes[i]);
            spikes[i].remove();
        }
        
        // Si il y a une collision
        if (collision(spikes[i], -8, -8, -8, 8, -6, 8)) {
            
            caracter.position.y = 256;
            
        }
    }
        
    // Pour chaque pièce
    for (var i = 0; i < coins.length; i++) {
        if (coins[i].position.z >= camera.position.z + 16) {
            scene.remove(coins[i]);
            coins[i].remove();
            
        } else {
            
            coins[i].rotation.y += 4 * delta;
            
            // Si il y a une collision
            if (collision(coins[i], -2, -2, -2, 2, 2, 2)) {
                
                coinsCollect++;
                coins[i].position.y = -64;
                scene.remove(coins[i]);
                coins[i].remove();
            }
        }
    }
    
    // Pour chaque décor, si il sort de l'écran
    for (var i = 0; i < decors.length; i++) {
        if (decors[i].position.z >= camera.position.z + 16) {
            scene.remove(decors[i]);
            decors[i].remove();
        }
    }
    
    
    distance = parseInt(caracter.position.z * -1 / 16);
    score = distance * 10 * coinsCollect;
    
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
    
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.fillText('Score : ' + (distance + coinsCollect), 20, 20, 400);
    
    lastTime = now;
}