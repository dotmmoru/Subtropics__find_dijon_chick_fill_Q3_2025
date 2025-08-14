


var thisObj = script.getSceneObject();
var isTapEnabled = false;

/////////////////////   FUNC   //////////////////////////
function Tap() {
    isTapEnabled = false;
    global.OnClick_Restart();
}

function Reset() {
    isTapEnabled = false;

    stopTweens(thisObj, ["show", "hide"]);
    startTweens(thisObj, ["init"]);
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

script.api.Hide = function () {
    stopTweens(thisObj, ["show"]);
    startTweens(thisObj, ["hide"]);
}

/////////////////////   EVENTS   //////////////////////////
var event_Tap = script.createEvent("TapEvent");
event_Tap.bind(function (eventData) {
    if (isTapEnabled) {
        Tap();
    }
});