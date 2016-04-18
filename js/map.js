// Charge une carte
function loadMap(url) {
    
	// Chargement de l'image
	var imgLoad = new Image();
	imgLoad.src = 'maps/' + url + '.png';
    
    // Losque l'image est chargée
    imgLoad.onload = function () {
        
        var img = this;
        
        var w = img.width;
        var h = img.height;
        
        var tCanvas = document.createElement('canvas');
        var tCtx = tCanvas.getContext('2d');
        
        tCtx.width  = w;
        tCtx.height = h;
        
        tCtx.drawImage(img, 0, 0);
        
        var blockIndex = 0;
        
        for (var y = 0; y < h; y++) {
            
            for (var x = 0; x < w; x++) {
                
                var pixel = tCtx.getImageData(x, y, 1, 1).data;
                
                if (pixel[0] == 255 && pixel[1] == 255 && pixel[2] == 255) {
                    
                    blocks[blockIndex] = new THREE.Mesh(cube, material);
                    blocks[blockIndex].position.x = x * 64;
                    blocks[blockIndex].position.y = y * 64;
                    blockIndex++;
                }
            }
        }
    };
}
