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
function createObject(x, y, z, tabMeshes, startX, startY, startZ, endX, endY, endZ) {
    
    var object = new THREE.Mesh();
    object.position.set(x, y, z);
    
    // Pour chaque Mesh passé en paramètre
    for (var i = 0; i < tabMeshes.length; i++) {
        var mesh = tabMeshes[i];
        mesh.castShadow = mesh.receiveShadow = true;
        object.add(mesh.clone());
    }
    
    object.castShadow = object.receiveShadow = true;
    
    typeof startX !== 'undefined' ? object.startX = startX : false;
    typeof startY !== 'undefined' ? object.startY = startY : false;
    typeof startZ !== 'undefined' ? object.startZ = startZ : false;     
    typeof endX !== 'undefined' ? object.endX = endX : false;
    typeof endY !== 'undefined' ? object.endY = endY : false;
    typeof endZ !== 'undefined' ? object.endZ = endZ : false; 
    
    scene.add(object);
    return object;
}


// Test si il y a une collision entre deux objets
// return vrai si il y a une collision, sinon faux
function collision(obj1, obj2, startX, startY, startZ, endX, endY, endZ) {
    
    var x1 = obj1.position.x + obj1.startX;
    var y1 = obj1.position.y + obj1.startY;
    var z1 = obj1.position.z + obj1.startZ;
    var w1 = obj1.endX - obj1.startX;
    var h1 = obj1.endY - obj1.startY;
    var d1 = obj1.endZ - obj1.startZ;
    
    startX = typeof startX !== 'undefined' ? startX : obj2.startX;
    startY = typeof startY !== 'undefined' ? startY : obj2.startY;
    startZ = typeof startZ !== 'undefined' ? startZ : obj2.startZ;    
    endX = typeof endX !== 'undefined' ? endX : obj2.endX;
    endY = typeof endY !== 'undefined' ? endY : obj2.endY;
    endZ = typeof endZ !== 'undefined' ? endZ : obj2.endZ;
    
    var x2 = obj2.position.x + startX;
    var y2 = obj2.position.y + startY;
    var z2 = obj2.position.z + startZ;
    var w2 = endX - startX;
    var h2 = endY - startY;
    var d2 = endZ - startZ;
    
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
