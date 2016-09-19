// Menu commands with Kinect
// Autor : Jonny Hofmann (I_Like_Bananas)


// SwipeDetector
var swipeDetector = zig.controls.SwipeDetector();
console.log("wow");
swipeDetector.addEventListener('swipeleft', function() {
	document.location.href = "/game?tuto";
  console.log("left");
});
swipeDetector.addEventListener('swiperight', function() {
	document.location.href = "/game";
  console.log("right");
});
zig.singleUserSession.addListener(swipeDetector);
