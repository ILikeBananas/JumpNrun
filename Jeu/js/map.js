// Charge un niveau
function loadLevel(id) {
    
    var level = '';
    
    switch (id) {
        case 1:
            level =
                'sss';
            break;
        case 2:
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
        case 3:
            level =
                'SBS' +
                'SBS' +
                'SBS' +
                'SBS' +
                'sbs' +
                'sCs' +
                'sCs' +
                'sbs';
            break;
        case 4:
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
        case 5:
            level =
				'SbC' +
				'bbb' +
				'sss' +
				'  c' +
				'   ' +
				'   ' +
				'   ' +
				'Csb' +
				'Csb' +
				'b  ' +
				'b  ' +
				'   ' +
				'   ' +
				'   ' +
				'bcS' +
				'scs' +
				'   ' +
				'   ' +
				'c  ' +
				'c  ' +
				'css' +
				' sb';
            break;
        case 6:
            level =
                'css' +
				'c  ' +
				'   ' +
				'bsb' +
				'bsb' +
				'   ' +
				'   ' +
				'  c' +
				'  c' +
				'   ' +
				' sb' +
				'   ' +
				'   ' +
				'cbS' +
				'c  ' +
				'   ' +
				'   ' +
				'bbS' +
				'bbS' +
				'bbS' +
				' c ' +
				' c ' +
				'   ' +
				'   ' +
				'   ' +
				'   ' +
				'Cbs' +
				'Cbs' +
				'bb ' +
				'   ' +
				'   ' +
				'   ' +
				'sb ' +
				'sb ' +
				' cc';
            break;
        case 7:
            level =
				'cbS' +
				'c  ' +
				'   ' +
				'   ' +
				'   ' +
				' c ' +
				'sbc' +
				'sSc' +
				'   ' +
				'   ' +
				'   ' +
				'   ' +
				'sss' +
				'   ' +
				'   ' +
				'   ' +
				'Bb ' +
				'S s' +
				'  c' +
				'  c' +
				' c ' +
				's  ' +
				' c ' +
				'  c' +
				' c ' +
				'c  ' +
				'  s' +
				'bss' +
				'bss' +
				'   ' +
				'   ' +
				'   ' +
				'   ' +
				' sb' +
				'sss';
    }
    
    var endZ = camera.position.z - (16 * parseInt((level.length - 1) / 3)) - 928;
    
    // Pour chaque caractère composant le niveau
    for (var i = 0; i < level.length; i++) {
        
        var x = (i % 3 - 1) * 21;
        var z = endZ + parseInt(i / 3) * 16;
        
        if (level[i] == 'b') {
            boxes.push(createObject(x, 8, z, [models.box]));
            
        } else if (level[i] == 'B') {
            boxes.push(createObject(x, 8, z, [models.box]));
            boxes.push(createObject(x, 24, z, [models.box]));
            
        } else if (level[i] == 's') {
            spikes.push(createObject(x, 8, z, [models.spikes]));
            
        } else if (level[i] == 'S') {
            boxes.push(createObject(x, 8, z, [models.box]));
            spikes.push(createObject(x, 24, z, [models.spikes]));
            
        } else if (level[i] == 'c') {
            coins.push(createObject(x, 8, z, [models.coin]));
            
        } else if (level[i] == 'C') {
            boxes.push(createObject(x, 8, z, [models.box]));
            coins.push(createObject(x, 24, z, [models.coin]));
        }
    }
    
    positionEndLevel = endZ;
}
