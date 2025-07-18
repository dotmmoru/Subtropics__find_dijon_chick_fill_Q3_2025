


var thisObj = script.getSceneObject();
var isTapEnabled = false;

/////////////////////   FUNC   //////////////////////////
function Tap() {
    isTapEnabled = false;
}

function Reset() {
    isTapEnabled = false;

    stopTweens(thisObj, ["show", "hide"]);
    startTweens(thisObj, ["init"]);
}

function Hide() {
    stopTweens(thisObj, ["show"]);
    startTweens(thisObj, ["hide"]);
}

/////////////////////   API   //////////////////////////
script.api.Init = function () {
    Reset();
}

script.api.Show = function () {
    isTapEnabled = true;

    stopTweens(thisObj, ["hide"]);
    startTweens(thisObj, ["show"]);
}

/////////////////////   EVENTS   //////////////////////////
var event_Tap = script.createEvent("TapEvent");
event_Tap.bind(function (eventData) {
    if (isTapEnabled) {
        Tap();
    }
});