/*
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
    
    this.mesh 
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
    // Pour chaque mesh
    for (var i = 0; i < this.meshes.length; i++) {
        this.meshes[i].position.x += sX * delta;
        this.meshes[i].position.y += sY * delta;
        this.meshes[i].position.z += sZ * delta;
    }
};

// --- Collision ---

// Test si il y a une collision avec un autre objet
Obj.prototype.collision = function (obj) {
    
    var x1 = this.x + this.startW;
    var y1 = this.y + this.startH;
    var z1 = this.z + this.startD;
    var w1 = this.endW - this.startW;
    var h1 = this.endH - this.startH;
    var d1 = this.endD - this.startD;
    
    var x2 = obj.x + obj.startW;
    var y2 = obj.y + obj.startH;
    var z2 = obj.z + obj.startD;
    var w2 = obj.endW - obj.startW;
    var h2 = obj.endH - obj.startH;
    var d2 = obj.endD - obj.startD;
    
    // Test la collision
    if (x1 < x2 + w2 &&
        x1 > x2 - w1 &&
        y1 < y2 + h2 &&
        y1 > y2 - h1 &&
        z1 < z2 + d2 &&
        z1 > z2 - d1) {
        return true;
    }
    return false;
}
*/


// Début du masque en X
THREE.Mesh.prototype.startX = 0;
// Début du masque en Y
THREE.Mesh.prototype.startY = 0;
// Début du masque en Z
THREE.Mesh.prototype.startZ = 0;
// Fin du masque en X
THREE.Mesh.prototype.endX = 0;
// Fin du masque en Y
THREE.Mesh.prototype.endY = 0;
// Fin du masque en Z
THREE.Mesh.prototype.endZ = 0;


// Créer un objet et l'ajoute à la scène,
// return l'objet créé
function createObject(x, y, z, tabMeshes) {
    
    var object = new THREE.Mesh();
    object.position.set(x, y, z);
    
    // Pour chaque Mesh passé en paramètre
    for (var i = 0; i < tabMeshes.length; i++) {
        object.add(tabMeshes[i].clone());
    }
    
    scene.add(object);
    return object;
}


// Test si il y a une collision avec un autre objet,
// return vrai si il y a une collision, sinon faux
THREE.Mesh.prototype.collision = function (obj) {
    
    var x1 = this.position.x + this.startX;
    var y1 = this.position.y + this.startY;
    var z1 = this.position.z + this.startZ;
    var w1 = this.endX - this.startX;
    var h1 = this.endY - this.startY;
    var d1 = this.endZ - this.startZ;
    
    var x2 = obj.position.x + obj.startW;
    var y2 = obj.position.y + obj.startH;
    var z2 = obj.position.z + obj.startD;
    var w2 = obj.endW - obj.startW;
    var h2 = obj.endH - obj.startH;
    var d2 = obj.endD - obj.startD;
    
    // Test la collision
    if (x1 < x2 + w2 &&
        x1 > x2 - w1 &&
        y1 < y2 + h2 &&
        y1 > y2 - h1 &&
        z1 < z2 + d2 &&
        z1 > z2 - d1) {
        return true;
    }
    return false;
}