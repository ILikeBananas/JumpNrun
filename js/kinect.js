// ----- EXECUTE DIFFÉRENTS TESTS POUR LA KINECT -----
// Auteur :  Jonny Hofmann


// Constantes
const LIMIT_RIGHT = 200;
const LIMIT_LEFT = -100;

  var radar = {
              onuserfound: function (user) {
                  document.getElementById("clientSeen").style.backgroundColor = "green";
              },
              onuserlost: function (user) {
                  document.getElementById("clientSeen").style.backgroundColor = "red";
              },
              ondataupdate: function (zigdata) {
                  for (var userid in zigdata.users) {
                      var user = zigdata.users[userid];
                      var pos = user.position;
                      console.log(pos[0]);
                      if(pos[0] > LIMIT_RIGHT) {
                        // right
                        roadPath = 1;
                      } else if (pos[0] < LIMIT_LEFT) {
                        //left
                        roadPath = -1;
                      } else {
                        //center
                        roadPath = 0;
                      }
                  }
              }
          };
          // By adding the radar object as a listener to the zig object, the zig object will now start calling
          // the callback functions defined in the radar object.
          zig.addListener(radar);





    // <<< INSÉRER LE CODE ICI ! (execution à chaque frame)
    //   roadPath = -1 -> chemin à gauche
    //   roadPath = 0  -> chemin au centre
    //   roadPath = 1  -> chemin à droite
    //   Déplacements : moveLeft(), moveRight(),
    //   jump() pour sauter et squat() pour se baisser
    // >>>
