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
camera.position.z = 400;

scene = new THREE.Scene();

var texture = new THREE.TextureLoader().load('img/caisse.png');
var envMap = new THREE.TextureLoader().load('img/truc.png');
                envMap.mapping = THREE.SphericalReflectionMapping;

var cube = new THREE.BoxBufferGeometry(64, 64, 64);
var material = new THREE.MeshBasicMaterial({
    map: texture, envMap: envMap
});

var blocks = [];
var road = new THREE.Mesh(cube, material);

//loadMap('truc');

// Pour chaque bloc
for (var i = 0; i < blocks.length; i++) {
    
    scene.add(blocks[i]);
}

renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

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
    
    for (var i = 0; i < blocks.length; i++) {
        
        blocks[i].rotation.x += .2 * delta;
        blocks[i].rotation.y += .5 * delta;
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