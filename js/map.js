// ----- CHARGEMENT D'UN NIVEAU ALÉATOIRE -----
// Auteur : Sébastien Chappuis


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
                ' g ' +
                ' c ' +
                ' g ' +
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
                'SBS' +
                'sbs' +
                'sGs' +
                'sCs' +
                'sGs' +
                'sbs';
            break;
        case 4:
            level =
                'BbB' +
                '   ' +
                '   ' +
                '   ' +
                'g g' +
                ' g ' +
                'c c' +
                ' g ' +
                'g g';
            break;
        case 5:
            level =
				'SbC' +
				'bbb' +
				'sss' +
				'   ' +
				'   ' +
				'   ' +
				'   ' +
				'Csb' +
				'Gsb' +
				'b  ' +
				'b  ' +
				'   ' +
				'   ' +
				'   ' +
				'bgS' +
				'sgs' +
				'   ' +
				'   ' +
				'g  ' +
				'g  ' +
				'gss' +
				' sb';
            break;
        case 6:
            level =
				'CsG' +
				'bsb' +
				'bsb' +
				'   ' +
				'   ' +
				'   ' +
				'  g' +
				'SSc' +
				'  g' +
				'   ' +
				'   ' +
				'   ' +
				'g  ' +
				'cSS' +
				'g  ' +
				'   ' +
				'   ' +
				'   ' +
				'SbS' +
				'SGS' +
				'SbS' +
				'   ' +
				' c ' +
				'   ' +
				'   ' +
				'   ' +
				'   ' +
				'Cbs' +
				'Gbs' +
				'bb ' +
				'   ' +
				'   ' +
				'   ' +
				'sbg' +
				'sbc' +
				'  g';
            break;
        case 7:
            level =
				'gbS' +
				'c  ' +
				'   ' +
				'   ' +
				'   ' +
				'   ' +
				'sbg' +
				'sSg' +
				'   ' +
				'   ' +
				'   ' +
				'   ' +
				'Bb ' +
				'S s' +
				'   ' +
				'  g' +
				'  g' +
				' g ' +
				's  ' +
				' g ' +
				'  g' +
				' g ' +
				'g  ' +
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
                'sBg' +
                ' Bg' +
                ' Bg' +
                ' Bg' +
                ' B ' +
                ' BC' +
                ' BG' +
                '-BG' +
                ' BG' +
                ' BG' +
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
                ' G ' +
                ' b ' +
                ' b ';
            break;
        case 10:
            level =
                '-Bs' +
                ' B ' +
                ' B ' +
                ' B ' +
                'gBg' +
                'cBc' +
                'gBg' +
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
                'S g S   S g S   S g S   S g S   S g S   S g S   S g S   ' +
                'S g S   S g S   S g S   S g S   S g S   S g S   S g S   ' +
                'S g S   S g S   S g S   S g S   S g S   S g S   S g S   ' +
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
            break;
    }
    
    // Longueur du niveau
    var levelLength = 16 * parseInt((level.length - 1) / 3);
    
    // Position Z de la fin du niveau actuel
    var endZ = positionNextLevel - levelLength;
    
    // Position Z du début du prochain niveau
    positionNextLevel -= levelLength + 144;    
    
    // Pour chaque caractère composant le niveau
    for (var i = 0; i < level.length; i++) {
        
        var x = (i % 3 - 1) * 21;
        var z = endZ + parseInt(i / 3) * 16;
        var coinName =
             rand.int(4) ? 'coin5'      :
            (rand.int(3) ? 'coin10'     :
            (rand.int(3) ? 'coinShield' : 'coinSwiftness'));
        
        switch (level[i]) {
            case 1:
                
            case 'b': // Caisse (box)
                boxes.push(createObject(x, 8, z, [models.box], 16));
                break;
                
            case 'B': // Deux caisses empilées
                boxes.push(createObject(x, 8, z, [models.box], 16));
                boxes.push(createObject(x, 24, z, [models.box], 16));
                break;
                
            case 's': // Pique (spike)
                spikes.push(createObject(x, 8, z, [models.spikes], -8,-8,-8, 8,-4,8));
                break;
                
            case 'S': // Pique sur une caisse
                boxes.push(createObject(x, 8, z, [models.box], 16));
                spikes.push(createObject(x, 24, z, [models.spikes], -8,-8,-8, 8,-4,8));
                break;
                
            case 'c': // Pièce de valeur aléatoire (coin)
                coins.push(createObject(x, 8, z, [models[coinName]], 12));
                coins[coins.length-1].name = coinName;
                break;
                
            case 'C': // Pièce de valeur aléatoire sur une caisse
                boxes.push(createObject(x, 8, z, [models.box], 16));
                coins.push(createObject(x, 24, z, [models[coinName]], 12));
                coins[coins.length-1].name = coinName;
                break;
                
            case 'g': // Pièce en or (gold)
                coins.push(createObject(x, 8, z, [models.coin], 12));
                coins[coins.length-1].name = 'coin';
                break;
                
            case 'G': // Pièce en or sur une caisse
                boxes.push(createObject(x, 8, z, [models.box], 16));
                coins.push(createObject(x, 24, z, [models.coin], 12));
                coins[coins.length-1].name = 'coin';
                break;
                
            case '^': // Pièce donnant un boost
                coins.push(createObject(x, 8, z, [models.coinSwiftness], 12));
                coins[coins.length-1].name = 'coinSwiftness';
                break;
                
            case '-': // Caisse, pique et flèche sous laquel il faut passer
                boxes.push(createObject(x, 24, z, [models.box, models.arrow], 16));
                spikes.push(createObject(x, 8, z, [models.spikes], -8,2,-8, 8,8,8));
                var spike = spikes[spikes.length-1];
                spike.scale.y = 1.5;
                spike.position.y -= 4;
                spike.rotation.x = Math.PI;
                break;
        }
    }
}




function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}