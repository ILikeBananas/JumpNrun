// ----- Detection de la kinect -----
// Auteur :  Jonny Hofmann

// Constantes
var LIMIT_RIGHT   = 0;
var LIMIT_LEFT    = 0;
var LIMIT_JUMP    = 0;
var LIMIT_CROUCH  = 0;

// Detection horizontale
var radar = {
  ondataupdate: function (zigdata) {
    if (zigdata.users.length != 0){
      for (var userid in zigdata.users) {
        var user = zigdata.users[userid];
        var pos = user.position;
        if(pos[0] > LIMIT_RIGHT) {
          //console.log("right");
          goToPath(1);
        } else if (pos[0] < LIMIT_LEFT) {
          //console.log("left");
          goToPath(-1);
        } else {
          //console.log("center");
          goToPath(0);
        }
      }
    } else {
      console.log("erreur trouvé");
    }
  }
};

zig.addListener(radar);

// Détection complet du corps
var engager = zig.EngageUsersWithSkeleton(1);
engager.addEventListener('userengaged', function(user) {
  console.log('User engaged: ' + user.id);

  // Calibrage
  LIMIT_LEFT = user.position[0] - 200;
  LIMIT_RIGHT = user.position[0] + 200;
  LIMIT_JUMP = user.skeleton[zig.Joint.Head].position[1] + 100;
  LIMIT_CROUCH = user.skeleton[zig.Joint.Head].position[1] - 300;

  console.log("limit left : " + LIMIT_LEFT);
  console.log("limit right : " + LIMIT_RIGHT);
  console.log("limit jump : " + LIMIT_JUMP);
  console.log("limit crouch : " + LIMIT_CROUCH);

  user.addEventListener('userupdate', function(user) {
    var headHight = user.skeleton[zig.Joint.Head].position[1];
    //console.log(headHight);
    if(headHight > LIMIT_JUMP){
      jump();
      //console.log("jump");
    } else if (headHight < LIMIT_CROUCH){
      squat(0.5);
      //console.log("squat");
    }
  });
});
// Informe que le joueur est plus reconnu complétement
engager.addEventListener('userdisengaged', function(user) {
  console.log('User disengaged: ' + user.id);
});
zig.addListener(engager);
