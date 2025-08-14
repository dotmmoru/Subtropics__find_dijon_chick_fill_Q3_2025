// -----JS CODE-----
//@input SceneObject[] contentFront
//@input SceneObject[] contentBack

// BACK CAMERA EVENT
var backCamEvent = script.createEvent("CameraBackEvent");
backCamEvent.bind(function (eventData) { 
	InitFront(false);
	InitBack(true);
});

// FRONT CAMERA EVENT
var frontCamEvent = script.createEvent("CameraFrontEvent");
frontCamEvent.bind(function (eventData) {
	InitFront(true);
	InitBack(false);
});


// ACTIVATE AND RESET OBJECT ON SCENE
function InitFront(value) {

	for (var j = 0; j < script.contentFront.length; j++) {		
		script.contentFront[j].enabled = value;
	}

}

// ACTIVATE AND RESET OBJECT ON SCENE
function InitBack(value) {

	for (var j = 0; j < script.contentBack.length; j++) {
		script.contentBack[j].enabled = value;
	}
}