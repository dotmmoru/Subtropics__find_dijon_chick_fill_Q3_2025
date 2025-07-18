
//@input SceneObject signIntroObj
/** @type {SceneObject} */
var signIntroObj = script.signIntroObj;
//@input SceneObject introPromptObj
/** @type {SceneObject} */
var introPromptObj = script.introPromptObj;

//@ui {"widget":"separator"}
//@input SceneObject uiHubObj
/** @type {SceneObject} */
var uiHubObj = script.uiHubObj;

//@ui {"widget":"separator"}
//@input SceneObject tableObj
/** @type {SceneObject} */
var tableObj = script.tableObj;

//@ui {"widget":"separator"}
//@input SceneObject whereIsDijonObj
/** @type {SceneObject} */
var whereIsDijonObj = script.whereIsDijonObj;

//@ui {"widget":"separator"}
//@input float delayToIntroTap
/** @type {number} */
var delayToIntroTap = script.delayToIntroTap;

//@ui {"widget":"separator"}
//@input Component.ScriptComponent restartButton
/** @type {ScriptComponent} */
var restartButton = script.restartButton;

//@ui {"widget":"separator"}
//@input Component.ScriptComponent finalScoreScr
/** @type {ScriptComponent} */
var finalScoreScr = script.finalScoreScr;

//@ui {"widget":"separator"}
//@input Component.ScriptComponent[] progressScr
/** @type {ScriptComponent[]} */
var progressScr = script.progressScr;

//@ui {"widget":"separator"}
//@input Component.ScriptComponent[] burgersScr
/** @type {ScriptComponent[]} */
var burgersScr = script.burgersScr;


var isFront = false;
var thisObj = script.getSceneObject();
var currentState = 0;
var selectedBurger = -1;
var currentRound = 0;
var roundShuffleAmount = [4, 6, 8];


/////////////////////   FUNC   //////////////////////////
function Start() {
    Reset();

    UpdateState(0);
}

function Reset() {
    currentState = 0;
    selectedBurger = -1;

    //signIntroObj
    stopTweens(signIntroObj, ["show", "hide"]);
    startTweens(signIntroObj, ["init"]);

    //introPromptObj
    stopTweens(introPromptObj, ["show", "hide"]);
    startTweens(introPromptObj, ["init"]);

    //uiHubObj
    stopTweens(uiHubObj, ["show", "hide"]);
    startTweens(uiHubObj, ["init"]);

    //tableObj
    stopTweens(tableObj, ["show", "hide"]);
    startTweens(tableObj, ["init"]);

    //whereIsDijonObj
    stopTweens(whereIsDijonObj, ["show", "hide"]);
    startTweens(whereIsDijonObj, ["init"]);

    // scripts
    restartButton.api.Init();
    finalScoreScr.api.Init();
    for (var i = 0; i < progressScr.length; i++)
        progressScr[i].api.Init(i);

    for (var i = 0; i < burgersScr.length; i++)
        burgersScr[i].api.Init(i);
}

function DoStateAction() {
    switch (currentState) {
        case 0: {
            // state 0 - intro
            ShowIntro(0.25);
            break;
        }
        case 1: {
            // state 1 - prepare to game 

            // reset progress
            for (var i = 0; i < progressScr.length; i++)
                progressScr[i].api.Init(i);

            //uiHubObj
            stopTweens(uiHubObj, ["hide"]);
            startTweens(uiHubObj, ["show"]);

            // show burgers
            for (var i = 0; i < burgersScr.length; i++)
                burgersScr[i].api.Show();

            selectedBurger = global.getRandomInt(burgersScr.length);

            burgersScr[selectedBurger].api.PlayDijon(1.5, 2);
            break;
        }
        case 2: {

            break;
        }
    }
}

function ShowIntro(delay) {
    global.delay(delay, () => {
        //signIntroObj
        stopTweens(signIntroObj, ["hide"]);
        startTweens(signIntroObj, ["show"]);

        //introPromptObj
        stopTweens(introPromptObj, ["hide"]);
        startTweens(introPromptObj, ["show"]);

        //tableObj
        stopTweens(tableObj, ["hide"]);
        startTweens(tableObj, ["show"]);

        var duration = 1.75;
        for (var i = 0; i < burgersScr.length; i++)
            burgersScr[i].api.PlayTapHint(i * duration, duration);

    });
}

function UpdateState(state) {
    currentState = state;
    DoStateAction();
}

/////////////////////   API   //////////////////////////

global.TapOnBurger = function () {
    switch (currentState) {
        case 0: {
            for (var i = 0; i < burgersScr.length; i++) {
                burgersScr[i].api.StopTapHint();
                burgersScr[i].api.Hide();
            }

            //introPromptObj
            stopTweens(introPromptObj, ["show"]);
            startTweens(introPromptObj, ["hide"]);

            global.delay(1, () => { UpdateState(1) });
            break;
        }
        case 1: {
            break;
        }
        case 2: {
            break;
        }
    }
}

global.PlayShuffle = function () {
    for (var i = 0; i < roundShuffleAmount[currentRound]; i++) {
        global.delay(i * 0.5, () => {
            var b1 = global.getRandomInt(burgersScr.length);
            var b2 = global.updateIndexInList(b1, burgersScr.length, Math.random() < 0.5);

            var b1Pos = burgersScr[b1].api.GetScreenPosition();
            var b2Pos = burgersScr[b2].api.GetScreenPosition();

            burgersScr[b1].api.PlayShuffle(b2Pos);
            burgersScr[b2].api.PlayShuffle(b1Pos);
        });
    }
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
Start();