// -----AFFICHAGE DU SCORE DANS LE TABLEAU SUR L'INDEX -----
// Auteur : Sébastien Chappuis


var scores = {};

// Charge le fichier "scores.json"
$.ajax('scoresList')
    .done(function(file) {
        
        scores = file.scores;
          
        console.log('Fichier contenant les scores chargé avec succès,\n' +
                    'Nombre d\'éléments : ' + scores.length);
    displayScores();
    })
    .fail(function(err) {
        console.error('Erreur ' + err.status +
                      ', fichier contenant les scores introuvable.');
});


// Affiche le score
function displayScores() {
    
    // Tri les scores si ils ne serrait pas dans le bonne ordre dans le fichier JSON
    scores = scores.sort(function sortByScore(a, b) {
        return b.score - a.score;
    });
    
    // Pour chaque score
    for (var i = 0; i < Math.min(10, scores.length); i++) {
        
        // Créer une ligne et la stock dans "tr"
        var tr = $('#scores').children('table').append('<tr>').children('tbody').children('tr');
        tr = $($(tr)[tr.length - 1]);
        
        // Créer les quatre cases de la ligne (nom, score, distance, pièces)
        for (var j = 0; j < 4; j++) {
            tr.append('<td><span></span></td>');
        }
        
        // Ajoute dans chacune des cases la donnée correspondante
        var name = $(tr.children('td')[0]).children('span').text(scores[i].name);
        $(tr.children('td')[1]).children('span').text(scores[i].score);
        $(tr.children('td')[2]).children('span').text(scores[i].distance);
        $(tr.children('td')[3]).children('span').text(scores[i].coins);
        
        if (i < 3) {
            
            var medalName = i == 0 ? 'gold' : (i == 1 ? 'silver' : 'bronze');
            
            name.text(' ' + name.text());
            $('<img src="/img/index/medals/' + medalName + '.png" />').insertBefore(name);
        }
    }
}
