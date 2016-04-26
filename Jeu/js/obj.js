// Objet permettant d'être afficher dans
// la scène contenant des éléments Mesh
function Obj(x, y, z, startW, startH, startD, endW, endH, endD, tabGeoMat) {
    
    this.x = x;
    this.y = y;
    this.z = z;
    
    this.startW = startW;
    this.startH = startH;
    this.startD = startD;
    
    this.endW = endW;
    this.endH = endH;
    this.endD = endD;
    
    this.meshes = [];
    
    for (var i = 0; i < tabGeoMat.length / 2; i++) {
        this.meshes[i] = new THREE.Mesh(tabGeoMat[i*2], tabGeoMat[i*2+1]);
        this.meshes[i].position.set(x, y, z);
        //this.meshes[i] = tempMeshes[i];
        scene.add(this.meshes[i]);
    }
}

// --- Position absolue ---

// Défini la position X, Y et Z de l'objet
Obj.prototype.setPosition = function (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    // Pour chaque mesh
    for (var i = 0; i < this.meshes.length; i++) {
        this.meshes[i].position.set(x, y, z);
    }
};

// Défini la position X de l'objet
Obj.prototype.setPositionX = function (x) {
    this.x = x;
    // Pour chaque mesh
    for (var i = 0; i < this.meshes.length; i++) {
        this.meshes[i].position.x = x;
    }
};

// Défini la position Y de l'objet
Obj.prototype.setPositionY = function (y) {
    this.y = y;
    // Pour chaque mesh
    for (var i = 0; i < this.meshes.length; i++) {
        this.meshes[i].position.x = x;
    }
};

// Défini la position Z de l'objet
Obj.prototype.setPositionZ = function (z) {
    this.z = z;
    // Pour chaque mesh
    for (var i = 0; i < this.meshes.length; i++) {
        this.meshes[i].position.z = z;
    }
};

// --- Position relative ---

// Déplace en X, Y et Z l'objet
Obj.prototype.addPosition = function (x, y, z) {
    this.x += x;
    this.y += y;
    this.z += z;
    // Pour chaque mesh
    for (var i = 0; i < this.meshes.length; i++) {
        this.meshes[i].position.x += x;
        this.meshes[i].position.y += y;
        this.meshes[i].position.z += z;
    }
};

// --- Vitesse de déplacement ---

// Défini la vitesse à l'objet (1 = 1/16 de bloc par seconde)
Obj.prototype.addSpeed = function (sX, sY, sZ) {
    this.x += sX * delta;
    this.y += sY * delta;
    this.z += sZ * delta;
    this.speedX += sX;
    this.speedY += sY;
    this.speedZ += sZ;
    // Pour chaque mesh
    for (var i = 0; i < this.meshes.length; i++) {
        this.meshes[i].position.x += sX * delta;
        this.meshes[i].position.y += sY * delta;
        this.meshes[i].position.z += sZ * delta;
    }
};

// --- Collision ---

// Test si il y a une collision avec un autre objet/tableau d'objets
Obj.prototype.collision = function (obj) {
    // En cours...
};