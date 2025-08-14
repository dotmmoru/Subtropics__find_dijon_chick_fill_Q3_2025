




var isFront = false;
var thisObj = script.getSceneObject();


/////////////////////   FUNC   //////////////////////////
function Start() {
    Reset();
}

function Reset() {
    stopTweens(obj, ["show_alpha", "hide_alpha"]);
    startTweens(obj, ["init_alpha", "init_scale"]);
}


/////////////////////   API   //////////////////////////
script.api.SomeAPI = function (value) {

}

/////////////////////   EVENTS   //////////////////////////
var event_Tap = script.createEvent("TapEvent");
event_Tap.bind(function (eventData) {

});

var event_Front = script.createEvent("CameraFrontEvent");
event_Front.bind(function (eventData) {
    isFront = true;
    //Start();
});

var event_Back = script.createEvent("CameraBackEvent");
event_Back.bind(function (eventData) {
    isFront = false;
    //Start();
});


/////////////////////   RUN   //////////////////////////
//Start();