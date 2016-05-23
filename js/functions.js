// ----- DIVERSES FONCTIONS POUVANT ÊTRE UTILE AU JEU -----
// Auteur : Sébastien Chappuis


// NAMESPACE "RAND"
var rand = {
	
	// Retourne un nombre entier aléatoire >= à "min" et <= à "max"
	int: function (min, max) {
		
        if (typeof min !== 'undefined' && typeof max === 'undefined') {
            max = min;
            min = 0;
        } else {
            min = typeof min !== 'undefined' ?  min : 0;
            max = typeof max !== 'undefined' ?  max : 1;
        }
		
		if (min > max) {
			var temp = min;
			min = max;
			max = temp;
		}
		
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	
	// Retourne un nombre aléatoire >= à "min" et < à "max"
	float: function (min, max) {
		
		if (typeof min !== 'undefined' && typeof max === 'undefined') {
            max = min;
            min = 0;
        } else {
            min = typeof min !== 'undefined' ?  min : 0;
            max = typeof max !== 'undefined' ?  max : 1;
        }
		
		if (min > max) {
			var temp = min;
			min = max;
			max = temp;
		}
		
		return Math.random() * (max - min) + min;
	},
	
	colorRGB: function (minR, minG, minB,
						maxR, maxG, maxB,
						separator) {
		
		minR = typeof minR !== 'undefined' ?  minR : 0;
		minG = typeof minG !== 'undefined' ?  minG : 0;
		minB = typeof minB !== 'undefined' ?  minB : 0;
		maxR = typeof maxR !== 'undefined' ?  maxR : 255;
		maxG = typeof maxG !== 'undefined' ?  maxG : 255;
		maxB = typeof maxB !== 'undefined' ?  maxB : 255;
		separator = typeof separator !== 'undefined' ?  separator : ',';
		
		return this.int(minR, maxR) + '' + separator
			 + this.int(minG, maxG) + '' + separator
			 + this.int(minB, maxB);
	},
	
	colorRGBA: function (minR, minG, minB, minA, maxR,
						 maxG, maxB, maxA, separator) {
		
		minR = typeof minR !== 'undefined' ?  minR : 0;
		minG = typeof minG !== 'undefined' ?  minG : 0;
		minB = typeof minB !== 'undefined' ?  minB : 0;
		minA = typeof minA !== 'undefined' ?  minA : 0;
		maxR = typeof maxR !== 'undefined' ?  maxR : 255;
		maxG = typeof maxG !== 'undefined' ?  maxG : 255;
		maxB = typeof maxB !== 'undefined' ?  maxB : 255;
		maxA = typeof maxA !== 'undefined' ?  maxA : 1;
		separator = typeof separator !== 'undefined' ?  separator : ',';
		
		return this.int(minR, maxR) + '' + separator
			 + this.int(minG, maxG) + '' + separator
			 + this.int(minB, maxB) + '' + separator
			 + this.float(minA, maxA);
	},
	
	letter: function (from, to, isUppercase) {
		
		from = typeof from !== 'undefined' ?  from :  1;
		to   = typeof to   !== 'undefined' ?  to   : 26;
		
		from = from <  1 ?  1 : from;
		from = from > 26 ? 26 : from;
		to   = to   <  1 ?  1 : to;
		to   = to   > 26 ? 26 : to;
		
		isUppercase = isUppercase == true ? true : false;
		return String.fromCharCode(96 - (32 * isUppercase)
								   + rand.int(from, to));
	}
};



// Supprime d'un tableau les éléments indéfinis
Array.prototype.clean = function() {
    
    // Pour chaque élément du tableau
    for (var i = 0; i < this.length; i++) {
        
        // Si la valeur est indéfini
        if (this[i] == undefined) {         
            this.splice(i, 1);
            i--;
        }
    }
    
    return this;
};
