var camera, scene, renderer;
var mesh;

var now = Date.now();
var lastTime = now;
var delta = 0;
var fps = 0;

var width = window.innerWidth;
var height = window.innerHeight;

var canvas;
var ctx;

init2D();
init3D();
gameLoop();

//Initialisation du canvas 2D (interface)
function init2D() {
    
    canvas = document.getElementById('canvas2d');
    canvas.width = width
    canvas.height = height
    ctx = canvas.getContext('2d');
}

// Initialisation du canvas utilisant THREE
function init3D() {
    
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 400;
    
    scene = new THREE.Scene();
    
    var texture = new THREE.TextureLoader().load('img/test.png');
    
    var geometry = new THREE.BoxBufferGeometry(200, 200, 200);
    var material = new THREE.MeshBasicMaterial({map: texture});
    
    mesh[0] = new THREE.Mesh(geometry, material);
    mesh[1] = new THREE.Mesh(geometry, material);
    scene.add(mesh[0]);
    
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    window.addEventListener('resize', onWindowResize, false);

}

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

// Boucle du jeu
function gameLoop() {
    
    requestAnimationFrame(gameLoop);
    
    now = Date.now();
    delta = (now - lastTime) / 1000;
    fps = parseInt(1 / delta * 1) / 1;
    delta = delta > .05 ? .05 : delta;
    
    mesh.rotation.x += .2 * delta;
    mesh.rotation.y += .5 * delta;
    
    renderer.render(scene, camera);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font="30px Arial";
    ctx.fillStyle = fps < 50 ? 'red' : fps < 60 ? 'orange' : 'yellow';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(fps + ' fps', width - 20, 20, 400);
    
    lastTime = now;
}