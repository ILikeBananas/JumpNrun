var now = Date.now();
var lastTime = now;
var delta = 0;
var fps = 0;
var width = window.innerWidth;
var height = window.innerHeight;

var gameLoaded = false;

var canvas;
var ctx;

// Canvas en 2 dimensions
canvas = document.getElementById('canvas2d');
canvas.width = width
canvas.height = height
ctx = canvas.getContext('2d');

// Caméra
var camera = new THREE.PerspectiveCamera(70, width / height, 1, 800);
camera.position.y = 48;
camera.rotation.x = -Math.PI / 8;

// Scène et brouillard
var scene = new THREE.Scene();
var fog = new THREE.Fog('#4080FF', 100, 800);
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
    fur: new THREE.TextureLoader().load('img/textures/fur.png'),
    box: new THREE.TextureLoader().load('img/textures/box.png'),
    iron: new THREE.TextureLoader().load('img/textures/iron.png'),
    test: new THREE.TextureLoader().load('img/textures/test.png'),
};
textures.road.wrapS = textures.road.wrapT = THREE.RepeatWrapping;
textures.road.repeat.set(1, 16);

textures.sand.wrapS = textures.sand.wrapT = THREE.RepeatWrapping;
textures.sand.repeat.set(128, 64);


// Liste des reflets
var reflexions = {
    
    dull: new THREE.TextureLoader().load('img/env/dull.png'),
    bright: new THREE.TextureLoader().load('img/env/bright.png'),
    test: new THREE.TextureLoader().load('img/env/test.png'),
};

reflexions.dull.mapping = THREE.SphericalReflectionMapping;
reflexions.bright.mapping = THREE.SphericalReflectionMapping;
reflexions.test.mapping = THREE.SphericalReflectionMapping;


// Liste des matériaux
var materials = {
    
    road: new THREE.MeshBasicMaterial({map: textures.road}),
    sand: new THREE.MeshBasicMaterial({map: textures.sand}),
    fur: new THREE.MeshBasicMaterial({map: textures.fur, envMap: reflexions.dull}),
    box: new THREE.MeshBasicMaterial({map: textures.box, envMap: reflexions.dull}),
    iron: new THREE.MeshBasicMaterial({map: textures.iron, envMap: reflexions.bright}),
};


// Liste des formes géométriques
var geometries = {
    
    cube: new THREE.BoxBufferGeometry(16, 16, 16),
    road: new THREE.BoxBufferGeometry(64, 0, 1024),
    floor: new THREE.BoxBufferGeometry(2048, 0, 1024),
};



// Création de la route
var road = new THREE.Mesh(geometries.road, materials.road);
road.position.z = -512;
road.receiveShadow = true;
scene.add(road);

// Création du sol
var floor = new THREE.Mesh(geometries.floor, materials.sand);
floor.position.y = -0.01;
floor.position.z = -512;
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

// Rendu
var renderer = new THREE.WebGLRenderer({alpha: true});
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

// Position Z de la fin du dernier niveau chargé
var positionEndLevel = 0;

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
    delta = delta > .05 ? .05 : delta;
    
    camera.position.z -= 64 * delta;
    
    if (camera.position.z < road.position.z + 448) {
        road.position.z -= 64;
        floor.position.z -= 64;
    }
    
    if (camera.position.z < positionEndLevel + 800) {
        loadLevel(rand.int());
    }
    
    for (var i = 0; i < boxes.length; i++) {
        if (boxes[i].position.z >= camera.position.z) {
            scene.remove(boxes[i]);
            boxes[i].remove();
        }
    }
    
    for (var i = 0; i < spikes.length; i++) {
        if (spikes[i].position.z >= camera.position.z) {
            scene.remove(spikes[i]);
            spikes[i].remove();
        }
    }
    
    renderer.render(scene, camera);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font="30px Arial";
    ctx.fillStyle = fps < 50 ? 'red' : fps < 60 ? 'orange' : 'yellow';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(fps + ' fps', width - 20, 20, 400);
    
    lastTime = now;
}