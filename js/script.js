var now = Date.now();
var lastTime = now;
var delta = 0;
var fps = 0;
var a = '';
var width = window.innerWidth;
var height = window.innerHeight;

var canvas;
var ctx;

// Canvas en 2 dimensions
canvas = document.getElementById('canvas2d');
canvas.width = width
canvas.height = height
ctx = canvas.getContext('2d');

// Caméra
var camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);

// Scène et brouillard
var scene = new THREE.Scene();
var fog = new THREE.Fog('#4080FF', 100, 800);
scene.fog = fog;

var ambLight = new THREE.AmbientLight('#C0C0C0');
scene.add(ambLight);

/*
var light = new THREE.SpotLight('#0000FF', 1, 0, Math.PI / 2 );
light.position.set( 0, 1500, 1000 );
light.target.position.set( 0, 0, 0 );
light.castShadow = true;

scene.add(light);
*/

// Liste des textures
var textures = {
    
    road: new THREE.TextureLoader().load('img/textures/road.png'),
    sand: new THREE.TextureLoader().load('img/textures/sand.png'),
    fur: new THREE.TextureLoader().load('img/textures/fur.png'),
    box: new THREE.TextureLoader().load('img/textures/box.png'),
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
    box: new THREE.MeshBasicMaterial({map: textures.road, envMap: reflexions.dull}),
};


// Liste des formes géométriques
var geometries = {
    
    cube: new THREE.BoxBufferGeometry(32, 32, 32),
    road: new THREE.BoxBufferGeometry(64, 0, 1024),
    floor: new THREE.BoxBufferGeometry(2048, 0, 1024),
};











// Création du personnage
var wolf;
var loader = new THREE.OBJLoader();
loader.load( 'obj/wolf.obj', function (object) {
    
    object.traverse(function (child) {
        
        if (child instanceof THREE.Mesh) {
            child.material = materials.fur;
        }
    });
    
    wolf = object;
    
    wolf.position.y = -24.7;
    wolf.position.z = -80;
    wolf.receiveShadow = true;
    wolf.castShadow = true;
    scene.add(wolf);
});


// Création de la route
var road = new THREE.Mesh(geometries.road, materials.road);
road.position.y = -24;
road.position.z = -512;
road.receiveShadow = true;
scene.add(road);

// Création du sol
var floor = new THREE.Mesh(geometries.floor, materials.sand);
floor.position.y = -24.01;
floor.position.z = -512;
floor.receiveShadow = true;
scene.add(floor);

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

gameLoop();

// Boucle du jeu
function gameLoop() {
    
    requestAnimationFrame(gameLoop);
    
    now = Date.now();
    delta = (now - lastTime) / 1000;
    fps = parseInt(1 / delta * 1) / 1;
    delta = delta > .05 ? .05 : delta;
    
    camera.position.z -= 50 * delta;
    wolf.position.z -= 50 * delta;
    
    //wolf.rotation.y += 2 * delta;
    
    if (camera.position.z < road.position.z + 448) {
        road.position.z -= 64;
        floor.position.z -= 64;
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