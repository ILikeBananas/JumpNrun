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

// Début du masque en X
THREE.Group.prototype.startX = 0;
// Début du masque en Y
THREE.Group.prototype.startY = 0;
// Début du masque en Z
THREE.Group.prototype.startZ = 0;
// Fin du masque en X
THREE.Group.prototype.endX = 0;
// Fin du masque en Y
THREE.Group.prototype.endY = 0;
// Fin du masque en Z
THREE.Group.prototype.endZ = 0;


// Modifie le masque de collision d'un objet
function changeMask(obj, startX, startY, startZ, endX, endY, endZ) {
    
    obj.startX = startX;
    obj.startY = startY;
    obj.startZ = startZ;    
    obj.endX = endX;
    obj.endY = endY;
    obj.endZ = endZ;
}


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


// Test si il y a une collision entre deux objets
// return vrai si il y a une collision, sinon faux
function collision(obj1, obj2) {
    
    var x1 = obj1.position.x + obj1.startX;
    var y1 = obj1.position.y + obj1.startY;
    var z1 = obj1.position.z + obj1.startZ;
    var w1 = obj1.endX - obj1.startX;
    var h1 = obj1.endY - obj1.startY;
    var d1 = obj1.endZ - obj1.startZ;
    
    var x2 = obj2.position.x + obj2.startW;
    var y2 = obj2.position.y + obj2.startH;
    var z2 = obj2.position.z + obj2.startD;
    var w2 = obj2.endW - obj2.startW;
    var h2 = obj2.endH - obj2.startH;
    var d2 = obj2.endD - obj2.startD;
    
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