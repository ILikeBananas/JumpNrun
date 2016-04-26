// Test la collision entre le personnage et
//l'objet passé en paramètre,
//return true si il y a une collision
function collision(obj, width1, height1, depth1, width2, height2, depth2) {
    
    var x1 = caracter.position.x - 8;
    var y1 = caracter.position.y - 8;
    var z1 = caracter.position.z - 8;
    var w1 = 16;
    var h1 = 16;
    var d1 = 16;
    
    var x2 = obj.position.x + width1;
    var y2 = obj.position.y + height1;
    var z2 = obj.position.z + depth1;
    var w2 = width1*(-1) + width2;
    var h2 = height1*(-1) + height2;
    var d2 = depth1*(-1) + depth2;
    
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