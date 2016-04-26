// Charge un niveau
function loadLevel(id) {
    
    var level = '';
    
    switch (id) {
        case 0:
            level =
                'sss';
            break;
        case 1:
            level =
                'sSS' +
                '   ' +
                '   ' +
                '   ' +
                ' c ' +
                ' c ' +
                ' c ' +
                '   ' +
                '   ' +
                '   ' +
                'SSs';
            break;
        case 2:
            level =
                'SBS' +
                'SBS' +
                'SBS' +
                'sbs' +
                'sCs' +
                'sbs';
            break;
        case 3:
            level =
                'BbB' +
                '   ' +
                '   ' +
                '   ' +
                'c c' +
                ' c ' +
                'c c' +
                ' c ' +
                'c c';
            break;
    }
    
    var endZ = camera.position.z - (16 * parseInt((level.length - 1) / 3)) - 928;
    
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
            
        } else if (level[i] == 'S') {
            boxes.push(modelBox.clone());
            spikes.push(modelSpike.clone());
            var box = boxes[boxes.length-1];
            var spike = spikes[spikes.length-1];
            box.position.set(x, 8, z);
            spike.position.set(x, 24, z);
            scene.add(box);
            scene.add(spike);
            
        } else if (level[i] == 'c') {
            coins.push(modelCoin.clone());
            var coin = coins[coins.length-1];
            coin.position.set(x, 8, z);
            scene.add(coin);
            
        } else if (level[i] == 'C') {
            boxes.push(modelBox.clone());
            coins.push(modelCoin.clone());
            var box = boxes[boxes.length-1];
            var coin = coins[coins.length-1];
            box.position.set(x, 8, z);
            coin.position.set(x, 24, z);
            scene.add(box);
            scene.add(coin);
        }
    }
    
    positionEndLevel = endZ;
}
