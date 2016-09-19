// ----- DIVERSES FONCTIONS POUVANT ÊTRE UTILE AU JEU -----
// Auteur : Sébastien Chappuis


// NAMESPACE "RAND"
var rand = {
	
	// Retourne un nombre entier aléatoire >= à "min" et <= à "max"
	int: function (min, max) {
		
        if (min != undefined && max == undefined) {
            max = min;
            min = 0;
        } else {
            min = min != undefined ?  min : 0;
            max = max != undefined ?  max : 1;
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
		
		if (min != undefined && max == undefined) {
            max = min;
            min = 0;
        } else {
            min = min != undefined ?  min : 0;
            max = max != undefined ?  max : 1;
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
		
		minR = minR != undefined ?  minR : 0;
		minG = minG != undefined ?  minG : 0;
		minB = minB != undefined ?  minB : 0;
		maxR = maxR != undefined ?  maxR : 255;
		maxG = maxG != undefined ?  maxG : 255;
		maxB = maxB != undefined ?  maxB : 255;
		separator = separator != undefined ?  separator : ',';
		
		return this.int(minR, maxR) + '' + separator
			 + this.int(minG, maxG) + '' + separator
			 + this.int(minB, maxB);
	},
	
	colorRGBA: function (minR, minG, minB, minA, maxR,
						 maxG, maxB, maxA, separator) {
		
		minR = minR != undefined ?  minR : 0;
		minG = minG != undefined ?  minG : 0;
		minB = minB != undefined ?  minB : 0;
		minA = minA != undefined ?  minA : 0;
		maxR = maxR != undefined ?  maxR : 255;
		maxG = maxG != undefined ?  maxG : 255;
		maxB = maxB != undefined ?  maxB : 255;
		maxA = maxA != undefined ?  maxA : 1;
		separator = separator != undefined ?  separator : ',';
		
		return this.int(minR, maxR) + '' + separator
			 + this.int(minG, maxG) + '' + separator
			 + this.int(minB, maxB) + '' + separator
			 + this.float(minA, maxA);
	},
	
	letter: function (from, to, isUppercase) {
		
		from = from != undefined ?  from :  1;
		to   = to   != undefined ?  to   : 26;
		
		from = from <  1 ?  1 : from;
		from = from > 26 ? 26 : from;
		to   = to   <  1 ?  1 : to;
		to   = to   > 26 ? 26 : to;
		
		isUppercase = isUppercase == true ? true : false;
		return String.fromCharCode(96 - (32 * isUppercase)
								   + rand.int(from, to));
	}
};



// Supprime du tableau tous les éléments indéfinis
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
