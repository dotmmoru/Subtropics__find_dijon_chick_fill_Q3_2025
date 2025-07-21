//@input SceneObject tapHintObj
/** @type {SceneObject} */
var tapHintObj = script.tapHintObj;

//@ui {"widget":"separator"}
//@input SceneObject burgerAnimObj
/** @type {SceneObject} */
var burgerAnimObj = script.burgerAnimObj;
//@input Component.Image burgerImgObj
/** @type {Image} */
var burgerImgObj = script.burgerImgObj;

//@ui {"widget":"separator"}
//@input SceneObject dijonObj
/** @type {SceneObject} */
var dijonObj = script.dijonObj;

var thisObj = script.getSceneObject();
var thisImg = thisObj.getComponent("Component.Image");
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
    thisImg.enabled = true;
    burgerAnimObj.enabled = false;

    //thisObj
    stopTweens(thisObj, ["show", "hide"]);
    startTweens(thisObj, ["init"]);

    // tap hint
    stopTweens(tapHintObj, ["show", "hide"]);
    startTweens(tapHintObj, ["init"]);

    //dijonObj
    stopTweens(dijonObj, ["show", "hide"]);
    startTweens(dijonObj, ["init"]);
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

script.api.PlayDijon = function (delay, duration) {
    global.delay(delay, () => {
        //dijonObj
        stopTweens(dijonObj, ["hide"]);
        startTweens(dijonObj, ["show"]);
    });

    global.delay(delay + duration, () => {
        // dijonObj
        stopTweens(dijonObj, ["show"]);
        startTweens(dijonObj, ["hide"]);
    });

    global.delay(delay + duration + 1, () => {
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

script.api.UpdateTexture = function (tex) {
    thisImg.mainPass.baseTex = tex;
}

script.api.ShowOpenAnim = function () {
    thisImg.enabled = false;
    burgerAnimObj.enabled = true;
    burgerImgObj.mainMaterial.mainPass.baseTex.control.play(2, 0)
    global.delay(2, () => {
        thisImg.enabled = true;
        burgerAnimObj.enabled = false;
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