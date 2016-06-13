// ----- EXECUTE DIFFÉRENTS TESTS POUR LA KINECT -----
// Auteur :  Jonny Hofmann


// Constantes
const LIMIT_RIGHT = 200;
const LIMIT_LEFT = -100;

// Left Center Right detecion
var radar = {
  ondataupdate: function (zigdata) {
    if (zigdata.users.length != 0){
      for (var userid in zigdata.users) {
        var user = zigdata.users[userid];
        var pos = user.position;
        if(pos[0] > LIMIT_RIGHT) {
          console.log("right");
          goToPath(1);
        } else if (pos[0] < LIMIT_LEFT) {
          console.log("left");
          goToPath(-1);
        } else {
          console.log("center");
          goToPath(0);
        }
      }
    } else {
      console.log("erreur trouvé");
    }
  }
};

zig.addListener(radar);

// Jump and crouch detection
var engager = zig.EngageUsersWithSkeleton(1);
engager.addEventListener('userengaged', function(user) {
  console.log('User engaged: ' + user.id);

  user.addEventListener('userupdate', function(user) {
    var headHight = user.skeleton[zig.Joint.Head].position[1];

    if(headHight > 800){
      jump();
      console.log("jump");
    } else if (headHight < 0){
      squat();
      console.log("squat");
    }
  });
});
engager.addEventListener('userdisengaged', function(user) {
  console.log('User disengaged: ' + user.id);
});
zig.addListener(engager);
