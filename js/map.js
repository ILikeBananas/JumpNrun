// Charge un niveau
function loadLevel(id) {
    
    var level = '';
    
    switch (id) {
        case 0:
            level =
                'bbb' +
                '   ' +
                '   ' +
                'sss';
            break;
        case 1:
            level =
                'BBB' +
                'sss';
        case 1:
            level =
                'BBB' +
                'sss';
    }
    
    var endZ = camera.position.z - (16 * parseInt((level.length - 1) / 3)) - 896;
    
    // Pour chaque caractère composant le niveau
    for (var i = 0; i < level.length; i++) {
        
        var x = (i % 3 - 1) * 21;
        var z = endZ + parseInt(i / 3) * 16;
        
        if (level[i] == 'b') {
            boxes.push(modelBox.clone());
            var box = boxes[boxes.length-1];
            box.position.set(x, 8, z);
            scene.add(box);
            
        } else if (level[i] == 'B') {
            boxes.push(modelBox.clone());
            boxes.push(modelBox.clone());
            var box1 = boxes[boxes.length-2];
            var box2 = boxes[boxes.length-1];
            box1.position.set(x, 8, z);
            box2.position.set(x, 24, z);
            scene.add(box1);
            scene.add(box2);
            
        } else if (level[i] == 's') {
            spikes.push(modelSpike.clone());
            var spike = spikes[spikes.length-1];
            spike.position.set(x, 8, z);
            scene.add(spike);
        }
    }
    
    positionEndLevel = endZ;
}
