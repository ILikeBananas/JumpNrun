// -----AFFICHAGE DU SCORE DANS LE TABLEAU SUR L'INDEX -----
// Auteur : Sébastien Chappuis


var scores = {};

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



function displayScores() {
    for (var i = 0; i < Math.min(10, scores.length); i++) {
        $('#scores').children('table').append('<tr><td>' + scores[i].name +
                                              '</td><td>' + scores[i].score +
                                              '</td><td>' + scores[i].distance +
                                              '</td><td>' + scores[i].coins +
                                              '</td></tr>')
    }
}