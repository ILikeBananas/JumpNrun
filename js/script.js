var camera, scene, renderer;

var now = Date.now();
var lastTime = now;
var delta = 0;
var fps = 0;
var a = '';
var width = window.innerWidth;
var height = window.innerHeight;

var canvas;
var ctx;

canvas = document.getElementById('canvas2d');
canvas.width = width
canvas.height = height
ctx = canvas.getContext('2d');

camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);

scene = new THREE.Scene();
var fog = new THREE.Fog('#4080C0', 100, 800);
scene.fog = fog

var light = new THREE.AmbientLight('#FFFFFF');
scene.add(light);


// Liste des textures
var textures = {
    
    road: new THREE.TextureLoader().load('img/textures/road.png'),
    box: new THREE.TextureLoader().load('img/textures/box.png'),
    test: new THREE.TextureLoader().load('img/textures/test.png'),
};
textures.road.wrapS = textures.road.wrapT = THREE.RepeatWrapping;
textures.road.repeat.set(1, 16);


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
    
    road: new THREE.MeshBasicMaterial({map: textures.road, envMap: reflexions.dull}),
    box: new THREE.MeshBasicMaterial({map: textures.road, envMap: reflexions.dull}),
};

var geometry = new THREE.BoxBufferGeometry(64, 0, 1024);

var wolf;

var loader = new THREE.OBJLoader();
loader.load( 'obj/wolf.obj', function (object) {
    
    object.traverse(function (child) {
        
        if (child instanceof THREE.Mesh) {
            child.material.map = textures.test;
            child.material.envMap = reflexions.dull;
        }
    });
    
    wolf = object;
    
    wolf.position.y = -24.7;
    wolf.position.z = -80;
    scene.add(wolf);
});

var road = new THREE.Mesh(geometry, materials.road);
road.position.y = -24;
road.position.z = -512;
scene.add(road);

renderer = new THREE.WebGLRenderer();
renderer.domElement.setAttribute('id', 'canvas3d');
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
renderer.setClearColor('#4080FF'); // Couleur de fond
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
    
    road.position.z += 50 * delta;
    wolf.rotation.y += 2 * delta;
    
    if (road.position.z > -496) {
        road.position.z -= 16;
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