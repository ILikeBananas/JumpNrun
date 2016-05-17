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
            break;
        case 8:
            level =
                'B B' +
                'BdB' +
                'B B';
        case 9:
            level =
                'sBc' +
                'sBc' +
                ' Bc' +
                ' Bc' +
                ' Bc' +
                ' B ' +
                ' BC' +
                ' BC' +
                '-BC' +
                ' BC' +
                ' BC' +
                ' Bb' +
                ' BB' +
                '   ' +
                '   ' +
                '   ' +
                '   ' +
                'Bss' +
                'B  ' +
                'B  ' +
                'B  ' +
                '   ' +
                '   ' +
                '   ' +
                ' C ' +
                ' C ' +
                ' b ' +
                ' b ' +
                '   ';
            break;
        case 10:
            level =
                '-Bs' +
                ' B ' +
                ' B ' +
                ' B ' +
                'cBc' +
                'cBc' +
                'cBc' +
                ' B ' +
                ' B ' +
                ' B ' +
                'sB-';
            break;
        case 11:
            level =
                '   ' +
                '   ' +
                '   ' +
                'S 1 S   S 1 S   S 1 S   S 1 S   S 1 S   S 1 S   S 1 S   ' +
                'S 1 S   S 1 S   S 1 S   S 1 S   S 1 S   S 1 S   S 1 S   ' +
                'S 1 S   S 1 S   S 1 S   S 1 S   S 1 S   S 1 S   S 1 S   ' +
                '   ' +
                '   ' +
                '   ' +
                '   ' +
                '   ' +
                'BSB' +
                'B B' +
                'B^B' +
                'B B' +
                'S S';
    }
    
    var endZ = caracter.position.z - (16 * parseInt((level.length - 1) / 3)) - 928;
    
    // Pour chaque caractère composant le niveau
    for (var i = 0; i < level.length; i++) {
        
        var x = (i % 3 - 1) * 21;
        var z = endZ + parseInt(i / 3) * 16;
        var coinName =
             rand.int(4) ? 'coin'        :
             (rand.int(2) ? 'coin5'      :
             (rand.int(2) ? 'coin10'     :
             (rand.int(2) ? 'coinShield' : 'coinSwiftness')));
        
        if (level[i] == 'b') {
            boxes.push(createObject(x, 8, z, [models.box], -8,-8,-8, 8,8,8));
            
        } else if (level[i] == 'B') {
            boxes.push(createObject(x, 8, z, [models.box], -8,-8,-8, 8,8,8));
            boxes.push(createObject(x, 24, z, [models.box], -8,-8,-8, 8,8,8));
            
        } else if (level[i] == 's') {
            spikes.push(createObject(x, 8, z, [models.spikes], -8,-8,-8, 8,-4,8));
            
        } else if (level[i] == 'S') {
            boxes.push(createObject(x, 8, z, [models.box], -8,-8,-8, 8,8,8));
            spikes.push(createObject(x, 24, z, [models.spikes], -8,-8,-8, 8,-4,8));
            
        } else if (level[i] == 'c') {
            coins.push(createObject(x, 8, z, [models[coinName]], -6,-6,-6, 6,6,6));
            coins[coins.length-1].name = coinName;
            
        } else if (level[i] == 'C') {
            boxes.push(createObject(x, 8, z, [models.box], -8,-8,-8, 8,8,8));
            coins.push(createObject(x, 24, z, [models[coinName]], -6,-6,-6, 6,6,6));
            coins[coins.length-1].name = coinName;
            
        } else if (level[i] == '1') {
            coins.push(createObject(x, 8, z, [models.coin], -6,-6,-6, 6,6,6));
            coins[coins.length-1].name = 'coin';
            
        } else if (level[i] == '^') {
            coins.push(createObject(x, 8, z, [models.coinSwiftness], -6,-6,-6, 6,6,6));
            coins[coins.length-1].name = 'coinSwiftness';
            
        } else if (level[i] == '-') {
            boxes.push(createObject(x, 24, z, [models.box, models.arrow], -8,-8,-8, 8,8,8));
            //decors.push(createObject(x, 24, z, [models.arrow]));
            spikes.push(createObject(x, 8, z, [models.spikes], -8,2,-8, 8,8,8));
            var spike = spikes[spikes.length-1];
            spike.scale.y = 1.5;
            spike.position.y -= 4;
            spike.rotation.x = Math.PI;
        }
    }
    
    positionEndLevel = endZ;
}
