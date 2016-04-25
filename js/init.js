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
