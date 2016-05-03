// Nombre de niveaux
const NUMBER_LEVEL = 10;

// Maintenant
var now = Date.now();
// Temps à la dernière frame
var lastTime = now;
// Secondes écoulée par image
var delta = 0;
// Images par secondes
var fps = 0;
// Largeur de la fenêtre du jeu
var width = window.innerWidth;
// Hauteur de la fenêtre du jeu
var height = window.innerHeight;

// Tableau de booléens représentant les chargements terminés ou non
var loadings = [];
// Tableau contenant des modèles 3D chargés
var models = [];
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
// Si on est accroupi ou non
var isSquat = false;
// Distance avant de faire apparaître un décor
var positionNextDecor = rand.int(64);
// Position X de la camera relative au personnage
var viewX = 60;
// Position Y de la camera relative au personnage
var viewY = 5;
// Position Z de la camera relative au personnage
var viewZ = -40;

// Temps restant avant que le bouclier se dissipe
var shieldTime = 0;

// TEMP
var yolo = false;

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
camera.rotation.set(0, Math.PI, 0);

// Scène et brouillard
var scene = new THREE.Scene();
var fog = new THREE.Fog('#80C0FF', 200, 800);
scene.fog = fog;

var ambLight = new THREE.AmbientLight('#FF0000');
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
    skateboard: new THREE.TextureLoader().load('img/textures/skateboard.png'),
    box: new THREE.TextureLoader().load('img/textures/box.png'),
    test: new THREE.TextureLoader().load('img/textures/test.png'),
};

textures.road.wrapS = textures.road.wrapT = THREE.RepeatWrapping;
textures.road.repeat.set(1, 32);

textures.sand.wrapS = textures.sand.wrapT = THREE.RepeatWrapping;
textures.sand.repeat.set(512, 128);

textures.rock.wrapS = textures.rock.wrapT = THREE.RepeatWrapping;
textures.rock.repeat.set(.005, .005);

textures.cactus.wrapS = textures.cactus.wrapT = THREE.RepeatWrapping;
textures.cactus.repeat.set(.25, .25);

textures.skateboard.wrapS = textures.skateboard.wrapT = THREE.RepeatWrapping;
textures.skateboard.repeat.set(.0016, .0016);


// Liste des reflets
var reflexions = {
    
    dull: new THREE.TextureLoader().load('img/env/dull.png'),
    iron: new THREE.TextureLoader().load('img/env/iron.png'),
    gold: new THREE.TextureLoader().load('img/env/gold.png'),
    emerald: new THREE.TextureLoader().load('img/env/emerald.png'),
    ruby: new THREE.TextureLoader().load('img/env/ruby.png'),
    sapphire: new THREE.TextureLoader().load('img/env/sapphire.png'),
    test: new THREE.TextureLoader().load('img/env/test.png'),
};

reflexions.dull.mapping = THREE.SphericalReflectionMapping;
reflexions.iron.mapping = THREE.SphericalReflectionMapping;
reflexions.gold.mapping = THREE.SphericalReflectionMapping;
reflexions.emerald.mapping = THREE.SphericalReflectionMapping;
reflexions.sapphire.mapping = THREE.SphericalReflectionMapping;
reflexions.ruby.mapping = THREE.SphericalReflectionMapping;
reflexions.test.mapping = THREE.SphericalReflectionMapping;


// Liste des matériaux
var materials = {
    
    test: new THREE.MeshBasicMaterial({map: textures.test, envMap: reflexions.dull}),
    road: new THREE.MeshBasicMaterial({map: textures.road}),
    sand: new THREE.MeshBasicMaterial({map: textures.sand}),
    rock: new THREE.MeshBasicMaterial({map: textures.rock, envMap: reflexions.dull}),
    cactus: new THREE.MeshBasicMaterial({map: textures.cactus, envMap: reflexions.dull}),
    red: new THREE.MeshBasicMaterial({color: '#FF0000', envMap: reflexions.dull}),
    fur: new THREE.MeshBasicMaterial({map: textures.fur, envMap: reflexions.dull}),
    skateboardPattern: new THREE.MeshBasicMaterial({map: textures.skateboard, envMap: reflexions.dull}),
    black: new THREE.MeshBasicMaterial({color: '#404040', envMap: reflexions.dull}),
    box: new THREE.MeshBasicMaterial({map: textures.box, envMap: reflexions.dull}),
    iron: new THREE.MeshBasicMaterial({color: '#C0C0C0', envMap: reflexions.iron}),
    gold: new THREE.MeshBasicMaterial({color: '#FFFFFF', envMap: reflexions.gold}),
    emerald: new THREE.MeshBasicMaterial({color: '#FFFFFF', envMap: reflexions.emerald}),
    ruby: new THREE.MeshBasicMaterial({color: '#FFFFFF', envMap: reflexions.ruby}),
    sapphire: new THREE.MeshBasicMaterial({color: '#FFFFFF', envMap: reflexions.sapphire}),
};


// Liste des formes géométriques
var geometries = {
    
    cube: new THREE.BoxBufferGeometry(16, 16, 16),
    sphere: new THREE.SphereBufferGeometry(11, 11, 11),
    path: new THREE.BoxBufferGeometry(64, 0, 2048),
    ground: new THREE.BoxBufferGeometry(8192, 0, 2048),
};


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



// Charge un modèle 3D au format obj/*.obj,
// stock l'objet dans un tableau
function loadModel(fileName, material, modelName) {
    
    var index = loadings.push(false) - 1;
    var loader = new THREE.OBJLoader();
    
    if (typeof modelName === 'undefined') {
        modelName = fileName;
    }
    
    // Chargement du modèle
    loader.load('obj/' + fileName + '.obj', function (object) {
        
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material = material;
            }
        });
        
        loadings[index] = true;
        models[modelName] = object;
    });
}



// --- Chargement des modèles 3D et des formes géométriques ---

loadModel('coyote', materials.fur);
loadModel('skateboard_pattern', materials.skateboardPattern, 'skateboardPattern');
loadModel('skateboard_edge',    materials.black,             'skateboardEdge');
loadModel('skateboard_wheels',  materials.iron,              'skateboardWheels');
loadModel('spikes',             materials.iron);
loadModel('coin',               materials.gold);
loadModel('coin_star_4',        materials.emerald,           'coin5');
loadModel('coin_star_5',        materials.sapphire,          'coin10');
loadModel('coin_shield',        materials.ruby,              'coinShield');
loadModel('cactus',             materials.cactus);
loadModel('rock',               materials.rock);
loadModel('arrow',              materials.red);

models['box'] = new THREE.Mesh(geometries.cube, materials.box);
models['road'] = new THREE.Mesh(geometries.path, materials.road);
models['ground'] = new THREE.Mesh(geometries.ground, materials.sand);
models.ground.position.y = -0.01;

// --- Création des objets ---

// Personnage jouable
var caracter;
// Sol
var floor;
// Liste des caisses
var boxes = [];
// Liste des piques
var spikes = [];
// Liste des pièces
var coins = [];
// Liste des décors
var decors = [];



var interval = setInterval(waiting, 10);

// Tant que le jeu n'est pas chargé, attend...
function waiting() {
    
    // Si le jeu est chargé
    if (isGameLoaded()) {
        
        clearInterval(interval);
        
        // --- Application des modèles à certains objets ---
        
        models.coyote.position.y += 1;
        caracter = createObject(0, 0, -40, [models.coyote,
                                            models.skateboardPattern,
                                            models.skateboardEdge,
                                            models.skateboardWheels], -3,0,-4, 3,8,4);
        floor = createObject(0, 0, 0, [models.road, models.ground]);
        
        // Lancement de la boucle du jeu
        gameLoop();
    }
}


// Si le jeu est chargé ou non
function isGameLoaded() {
    
    // Pour chaque élément du tableau des chargements
    for (var i = 0; i < loadings.length; i++) {
        
        if (!loadings[i]) {
            return false;
        }
    }
    
    return true;
}