//@input SceneObject tapHintObj
/** @type {SceneObject} */
var tapHintObj = script.tapHintObj;

//@ui {"widget":"separator"}
//@input Component.Image burgerAnimImg
/** @type {Image} */
var burgerAnimImg = script.burgerAnimImg;

//@ui {"widget":"separator"}
//@input SceneObject burgerNameObj
/** @type {SceneObject} */
var burgerNameObj = script.burgerNameObj;

var thisObj = script.getSceneObject();
var thisScreenT = thisObj.getComponent("Component.ScreenTransform");

var id = -1;
var isTapEnabled = false;
var isBounceEnabled = false;


/////////////////////   FUNC   //////////////////////////
function Start() {
    Reset();
}

function Reset() {
    isTapEnabled = false;
    burgerNameObj.enabled = true;
    burgerAnimImg.mainPass.baseTex = global.staticBurgerTex;

    //thisObj
    stopTweens(thisObj, ["show", "hide"]);
    startTweens(thisObj, ["init"]);

    // tap hint
    stopTweens(tapHintObj, ["show", "hide"]);
    startTweens(tapHintObj, ["init"]);
}

function Tap() {
    isTapEnabled = false;
    global.TapOnBurger(id);
    if (isBounceEnabled)
        global.tweenManager.startTween(thisObj, "bounce");
}

/////////////////////   API   //////////////////////////
script.api.Init = function (_id) {
    id = _id;
    isTapEnabled = false;
    isBounceEnabled = false;

    Start();
}

script.api.GetScreenPosition = function () {
    return thisScreenT.anchors.getCenter();
}

script.api.Show = function () {
    burgerNameObj.enabled = false;
    stopTweens(thisObj, ["hide"]);
    startTweens(thisObj, ["show"]);
}

script.api.Hide = function () {
    stopTweens(thisObj, ["show"]);
    startTweens(thisObj, ["hide"]);
}

script.api.PlayTapHint = function (delay, duration) {
    isTapEnabled = true;
    tapHintObj.enabled = true;

    global.delay(delay, () => {
        // tap hint
        stopTweens(tapHintObj, ["hide"]);
        startTweens(tapHintObj, ["show"]);
    });

    global.delay(delay + duration, () => {
        // tap hint
        stopTweens(tapHintObj, ["show"]);
        startTweens(tapHintObj, ["hide"]);
    });
}

script.api.StopTapHint = function () {
    tapHintObj.enabled = false;
}

script.api.PlayDijon = function (delay) {
    global.delay(delay, () => {
        burgerAnimImg.mainPass.baseTex = global.addDijonAnim;
        burgerAnimImg.mainMaterial.mainPass.baseTex.control.play(1, 0)
    });

    global.delay(delay + global.addDijonAnimDuration + 1, () => {
        // play shuffle animation
        global.PlayShuffle();
    });
}

script.api.PlayShuffle = function (newPos, diration) {
    global.tweenManager.setTime(thisObj, "shuffle", diration);
    global.tweenManager.setEndValue(thisObj, "shuffle", newPos);
    global.tweenManager.startTween(thisObj, "shuffle");
}

script.api.ShuffleDone = function () {
    isTapEnabled = true;
    isBounceEnabled = true;
}

script.api.ShowOpenAnim = function () {
    burgerAnimImg.mainPass.baseTex = global.openBurgerAnim;
    burgerAnimImg.mainMaterial.mainPass.baseTex.control.play(2, 0)
    global.delay(global.openBurgerAnimDuration, () => {
        burgerAnimImg.mainPass.baseTex = global.staticBurgerTex;
    });

}
/////////////////////   EVENTS   //////////////////////////
var event_Tap = script.createEvent("TapEvent");
event_Tap.bind(function (eventData) {
    if (isTapEnabled) {
        Tap();
    }
});

/////////////////////   RUN   //////////////////////////