// ----- INSCRIPTION DU SCORE/DISTANCE/NOMBRE DE PIÈCES -----
// Auteur : Sébastien Chappuis


var parameters = getURLParameters();

$('#score').append(parameters.score);
$('#distance').append(parameters.distance + ' mètres');
$('#coins').append(parameters.coins);


// Lorsque l'on clique sue "Valider"
$('#send').click(function() {

    // Données de l'utilisateur
    var user = {

        name:     $('#name').val(),
        score:    parameters.score    |0,
        distance: parameters.distance |0,
        coins:    parameters.coins    |0,
    }

    if (validationName(user)) {
        sendScore(user);
        document.location.href = '/';
    }
});


// Retourne un tableaux contenant les paramètres de l'URL
function getURLParameters() {

    var params = {};
    var prmarr = window.location.search.split('&');
    for (var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split('=');
        if (i == 0) {
            tmparr[0] = tmparr[0].substr(1);
        }
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}


// Vérifie que les données à envoyer sont valides, si oui,
// retourne vrai, si non, retourne false et affiche les erreurs
function validationName(user) {

    var errorElement = $('#error');
    var errorMessage = '';

    if (user.name.length == '') {
        errorMessage = 'Veuillez entrer un nom !';
    } else if (user.name.length < 3) {
        errorMessage = 'Le nom doit faire au minimum 3 caractères !';
    } else if (user.name.length > 15) {
        errorMessage = 'Le nom doit faire au maximum 15 caractères !';
    } else {
        errorMessage = '';
    }

    if (errorMessage) {
        errorElement.css('display', 'block').html(errorMessage);
        console.warn(errorMessage);
        return false;
    }

    errorElement.css('display', 'none').html('');
    return true;
}
