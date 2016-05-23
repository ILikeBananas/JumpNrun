// ----- INITIATION DU JEU -----
// Auteur : Sébastien Chappuis


// --- Constantes ---

// Nombre de niveaux
const NUMBER_LEVEL = 11;
// Distance de vue
const VIEW_DISTANCE = 800;
// Couleur du ciel
const SKY_COLOR = '#80C0FF';
// Vitesse des sauts
const JUMP_SPEED = 128;
// Vitesse de course
const VELOCITY = 112;
// Vitesse de changement de chemin
const CHANGE_PATH_SPEED = 128;

// --- Variables globales ---

// Maintenant
var now = Date.now();
// Temps lors de la dernière frame
var lastTime = now;
// Secondes écoulée depuis la dernière image
var delta = 0;
// Images par secondes
var fps = 0;
// Largeur de la fenêtre du jeu
var width = window.innerWidth;
// Hauteur de la fenêtre du jeu
var height = window.innerHeight;

// Tableau de booléens représentant les chargements terminés ou non
var loadings = [];
// Tableau contenant des modèles 3D chargés avec leur texture
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
// Chemin sur la route (-1 = gauche, 0 = millieu, 1 = droite)
var roadPath = 0;
// Vitesse du personnage, boost compris
var speed = 0;
// Vitesse du chute
var fallSpeed = 0;
// Si on est au sol ou non
var onGround = false;
// Temps restant avant de ne plus être accroupi
var squatTime = 0;

// Position Z où se chargera le début du prochain niveau
var positionNextLevel = -800;
// Position Z où apparaîtra le prochain décor
var positionNextDecor = rand.int(64) + VIEW_DISTANCE;

// Position X de la camera relative au personnage
var viewX = 60;
// Position Y de la camera relative au personnage
var viewY = 5;
// Position Z de la camera relative au personnage
var viewZ = -60;

// Temps restant avant que le bouclier se dissipe
var shieldTime = 0;
// Si on a le bonus de boost de vitesse actif ou non
var isSwiftness = false;
// Matériel à charger pour le bouclier ('basic', 'boost' ou '' pour aucun changement)
var shieldMaterial = false;
// Opacité du flash lorsque l'on fonce dans un obstacle avec le bouclier
var flashOpacity = 0;

// Rotation des pièces en radians
var coinsRotation = 0;

// Canvas 2D
var canvas;
// Contexte du canvas 2D
var ctx;


// Liste des images (pour le canvas 2D)
var images = {
    
    interface: new Image(),
    iconShield: new Image(),
    iconLightning: new Image(),
}

images.interface.src = 'img/other/interface.png';
images.iconShield.src = 'img/other/icon_shield.png';
images.iconLightning.src = 'img/other/icon_lightning.png';


// Canvas en 2 dimensions
canvas = document.getElementById('canvas2d');
canvas.width = width
canvas.height = height
ctx = canvas.getContext('2d');

// Rendu
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor(SKY_COLOR);
renderer.domElement.setAttribute('id', 'canvas3d');
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement); // Créer le canvas

// Caméra
var camera = new THREE.PerspectiveCamera(70, width / height, 1, VIEW_DISTANCE);
camera.rotation.set(0, Math.PI, 0);

// Scène et brouillard
var scene = new THREE.Scene();
var fog = new THREE.Fog(SKY_COLOR, VIEW_DISTANCE / 2, VIEW_DISTANCE);
scene.fog = fog;


// Liste des textures
var textures = {
    
    road: new THREE.TextureLoader().load('img/textures/road.png'),
    sand: new THREE.TextureLoader().load('img/textures/sand.png'),
    stone: new THREE.TextureLoader().load('img/textures/stone.png'),
    cactus: new THREE.TextureLoader().load('img/textures/cactus.png'),
    bricks: new THREE.TextureLoader().load('img/textures/bricks.png'),
    rock: new THREE.TextureLoader().load('img/textures/rock.png'),
    fur: new THREE.TextureLoader().load('img/textures/fur.png'),
    skateboard: new THREE.TextureLoader().load('img/textures/skateboard.png'),
    skateboardShadow: new THREE.TextureLoader().load('img/textures/skateboard_shadow.png'),
    box: new THREE.TextureLoader().load('img/textures/box.png'),
};

textures.road.wrapS = textures.road.wrapT = THREE.RepeatWrapping;
textures.road.repeat.set(1, (2 * VIEW_DISTANCE + 256) / 128);

textures.sand.wrapS = textures.sand.wrapT = THREE.RepeatWrapping;
textures.sand.repeat.set(512, (2 * VIEW_DISTANCE + 256) / 16);

textures.stone.wrapS = textures.stone.wrapT = THREE.RepeatWrapping;
textures.stone.repeat.set(.002, .002);

textures.cactus.wrapS = textures.cactus.wrapT = THREE.RepeatWrapping;
textures.cactus.repeat.set(.25, .25);

textures.bricks.wrapS = textures.bricks.wrapT = THREE.RepeatWrapping;
textures.bricks.repeat.set(.00075, .00075);

textures.rock.wrapS = textures.rock.wrapT = THREE.RepeatWrapping;
textures.rock.repeat.set(.0002, .0002);

textures.skateboard.wrapS = textures.skateboard.wrapT = THREE.RepeatWrapping;
textures.skateboard.repeat.set(.0016, .0016);


// Liste des reflets
var reflexions = {
    
    test: new THREE.TextureLoader().load('img/env/test.png'),
    dull: new THREE.TextureLoader().load('img/env/dull.png'),
    iron: new THREE.TextureLoader().load('img/env/iron.png'),
    gold: new THREE.TextureLoader().load('img/env/gold.png'),
    emerald: new THREE.TextureLoader().load('img/env/emerald.png'),
    sapphire: new THREE.TextureLoader().load('img/env/sapphire.png'),
    ruby: new THREE.TextureLoader().load('img/env/ruby.png'),
    citrine: new THREE.TextureLoader().load('img/env/citrine.png'),
};

// Pour chaque élément dans 'reflexions'
$.each(reflexions, function (index) {
    reflexions[index].mapping = THREE.SphericalReflectionMapping;
});


// Liste des formes géométriques simples
var geometries = {
    
    cube: new THREE.BoxBufferGeometry(16, 16, 16),
    sphere: new THREE.SphereBufferGeometry(16, 32, 32),
    path: new THREE.PlaneBufferGeometry(64, 2 * VIEW_DISTANCE + 256),
    ground: new THREE.PlaneBufferGeometry(8192, 2 * VIEW_DISTANCE + 256),
    skateboardShadow: new THREE.PlaneBufferGeometry(4, 16),
};


// Liste des matériaux
var materials = {
    
    road:        new THREE.MeshBasicMaterial({map: textures.road}),
    sand:        new THREE.MeshBasicMaterial({map: textures.sand}),
    stone:       new THREE.MeshBasicMaterial({map: textures.stone,  envMap: reflexions.dull}),
    cactus:      new THREE.MeshBasicMaterial({map: textures.cactus, envMap: reflexions.dull}),
    bricks:      new THREE.MeshBasicMaterial({map: textures.bricks, envMap: reflexions.dull}),
    rock:        new THREE.MeshBasicMaterial({map: textures.rock,   envMap: reflexions.dull}),
    fur:         new THREE.MeshBasicMaterial({map: textures.fur,    envMap: reflexions.dull}),
    box:         new THREE.MeshBasicMaterial({map: textures.box,    envMap: reflexions.dull}),
    iron:        new THREE.MeshBasicMaterial({envMap: reflexions.iron}),
    gold:        new THREE.MeshBasicMaterial({envMap: reflexions.gold}),
    emerald:     new THREE.MeshBasicMaterial({envMap: reflexions.emerald}),
    sapphire:    new THREE.MeshBasicMaterial({envMap: reflexions.sapphire}),
    ruby:        new THREE.MeshBasicMaterial({envMap: reflexions.ruby}),
    citrine:     new THREE.MeshBasicMaterial({envMap: reflexions.citrine}),
    shieldBasic: new THREE.MeshBasicMaterial({color: '#E08090', envMap: reflexions.ruby}),
    shieldBoost: new THREE.MeshBasicMaterial({color: '#FFC080', envMap: reflexions.citrine}),
    flash:       new THREE.MeshBasicMaterial({color: '#FFFFFF', envMap: reflexions.dull}),
    skateboardPattern: new THREE.MeshBasicMaterial({map: textures.skateboard, envMap: reflexions.dull}),
    skateboardShadow:  new THREE.MeshBasicMaterial({map: textures.skateboardShadow}),
    skateboardEdge:    new THREE.MeshBasicMaterial({color: '#404040'}),
};

materials.shieldBasic.transparent =
    materials.shieldBoost.transparent =
    materials.flash.transparent = true;



// Lorsque l'on change la taille de la fenêtre
$(window).resize(function () {
    
    width = window.innerWidth;
    height = window.innerHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
});



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
// stock l'objet dans un tableau "models"
function loadModel(fileName, material, modelName) {
    
    var index = loadings.push(false) - 1;
    var loader = new THREE.OBJLoader();
    
    // Si on a pas défini de nom pour le modèle, reprend le nom du fichier
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
loadModel('skateboard_edge',    materials.skateboardEdge,    'skateboardEdge');
loadModel('skateboard_wheels',  materials.iron,              'skateboardWheels');
loadModel('spikes',             materials.iron);
loadModel('coin',               materials.gold);
loadModel('coin_star_4',        materials.emerald,           'coin5');
loadModel('coin_star_5',        materials.sapphire,          'coin10');
loadModel('coin_shield',        materials.ruby,              'coinShield');
loadModel('coin_lightning',     materials.citrine,           'coinSwiftness');
loadModel('cactus',             materials.cactus);
loadModel('stone',              materials.stone);
loadModel('tunnel',             materials.bricks);
loadModel('tunnel_mountain',    materials.rock,              'tunnelMountain');
loadModel('arrow',              materials.ruby);

models['box'] = new THREE.Mesh(geometries.cube, materials.box);
models['skateBoardShadow'] = new THREE.Mesh(geometries.skateboardShadow,
                                            materials.skateboardShadow);
models['road'] = new THREE.Mesh(geometries.path, materials.road);
models['ground'] = new THREE.Mesh(geometries.ground, materials.sand);
models.road.rotation.x = models.ground.rotation.x =
    models.skateBoardShadow.rotation.x = -Math.PI / 2;
models.ground.position.y -= .05;
models.skateBoardShadow.position.y -= .1;

models['shield'] = new THREE.Mesh(geometries.sphere, materials.shieldBasic);
models['flash'] = new THREE.Mesh(geometries.sphere, materials.flash);
models.shield.position.y = models.flash.position.y = 8;

models.shield.scale.set(.35, .7, .7);
models.flash.scale.set(.36, .71, .71);


// --- Objets ---

// Personnage jouable (avec le skateboard)
var character;
// Position du personnage jouable (avec le skateboard)
var position;
// Modèle du coyote uniquement
var coyote;
// Position du coyote uniquement
var positionCoyote;
// Sol (route et sable)
var floor;
// Tunnel
var tunnel;
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
        character = createObject(0, 0, 0, [models.coyote,
                                           models.skateboardPattern,
                                           models.skateboardEdge,
                                           models.skateboardWheels,
                                           models.shield,
                                           models.flash], -3,0,-5, 3,8,5);
        coyote = character.children[0];
        positionCoyote = coyote.position;
        position = character.position;
        
        floor = createObject(0, 0, 0, [models.road, models.ground]);
        
        tunnel = createObject(0, 0, -rand.int(3000, 6000),
                              [models.tunnel, models.tunnelMountain]);
        
        // Lancement de la boucle du jeu
        gameLoop();
    }
}


// Test si le jeu est chargé ou non,
// retourne vrai si c'est le cas, sinon faux
function isGameLoaded() {
    
    // Pour chaque élément du tableau des chargements, test qu'ils soient TOUS vrais
    for (var i = 0; i < loadings.length; i++) {
        
        if (!loadings[i]) {
            return false;
        }
    }
    
    return true;
}