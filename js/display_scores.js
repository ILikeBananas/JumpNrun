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
    for (var i = 0; i < Math.min(10, scores.length); i++) {
        
        var tr = $('#scores').children('table').append('<tr>').children('tbody').children('tr');
        tr = $($(tr)[tr.length - 1]);
        
        for (var j = 0; j < 4; j++) {
            tr.append('<td></td>');
        }
        
        $(tr.children('td')[0]).text(scores[i].name);
        $(tr.children('td')[1]).text(scores[i].score);
        $(tr.children('td')[2]).text(scores[i].distance);
        $(tr.children('td')[3]).text(scores[i].coins);
    }
}
