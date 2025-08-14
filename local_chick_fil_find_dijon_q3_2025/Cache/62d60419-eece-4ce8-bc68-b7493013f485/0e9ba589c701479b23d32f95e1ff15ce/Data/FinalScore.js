//@input SceneObject shareYourScoreObj
/** @type {SceneObject} */
var shareYourScoreObj = script.shareYourScoreObj;
//@input Component.Image thisImg
/** @type {Image} */
var thisImg = script.thisImg;

var thisObj = script.getSceneObject();

var id = -1;


/////////////////////   FUNC   //////////////////////////
function Start() {
    Reset();
}

function Reset() {
    // thisObj
    stopTweens(thisObj, ["show", "hide"]);
    startTweens(thisObj, ["init"]);

    //shareYourScoreObj
    stopTweens(shareYourScoreObj, ["show", "hide"]);
    startTweens(shareYourScoreObj, ["init"]);

    script.api.UpdateTexture(global.scoreTex[0]);
}

function ShowPrompt() {
    global.delay(1, () => {
        stopTweens(shareYourScoreObj, ["hide"]);
        startTweens(shareYourScoreObj, ["show"]);
    });
}

function HidePrompt() {
    global.delay(0.5, () => {
        stopTweens(shareYourScoreObj, ["show"]);
        startTweens(shareYourScoreObj, ["hide"]);
    });
}

/////////////////////   API   //////////////////////////
script.api.Init = function () {
    Start();
}

script.api.Show = function () {
    stopTweens(thisObj, ["hide"]);
    startTweens(thisObj, ["show"]);

    ShowPrompt();
}

script.api.Hide = function () {
    stopTweens(thisObj, ["show"]);
    startTweens(thisObj, ["hide"]);

    HidePrompt();
}

script.api.UpdateTexture = function (tex) {
    thisImg.mainMaterial.mainPass.baseTex = tex;
}

/////////////////////   EVENTS   //////////////////////////

/////////////////////   RUN   //////////////////////////
