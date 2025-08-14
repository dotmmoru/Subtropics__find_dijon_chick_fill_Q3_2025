


var thisObj = script.getSceneObject();
var isTapEnabled = false;

/////////////////////   FUNC   //////////////////////////
function Tap() {

}

/////////////////////   API   //////////////////////////
global.ResetButton = function () {
    isTapEnabled = false;
}

global.ShowButton = function () {
    isTapEnabled = true;
}

/////////////////////   EVENTS   //////////////////////////
var event_Tap = script.createEvent("TapEvent");
event_Tap.bind(function (eventData) {
    if (isTapEnabled) {
        Tap();
    }
});