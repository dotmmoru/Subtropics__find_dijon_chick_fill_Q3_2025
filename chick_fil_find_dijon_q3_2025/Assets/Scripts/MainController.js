
//@input SceneObject signIntroObj
/** @type {SceneObject} */
var signIntroObj = script.signIntroObj;
//@input Component.Image signIntroImg
/** @type {Image} */
var signIntroImg = script.signIntroImg;
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
//@input SceneObject finalBurgerObj
/** @type {SceneObject} */
var finalBurgerObj = script.finalBurgerObj;
//@input Component.Image finalBurgerImg
/** @type {Image} */
var finalBurgerImg = script.finalBurgerImg;

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

//@ui {"widget":"separator"}
//@input Component.AudioComponent successSFX
/** @type {AudioComponent} */
var successSFX = script.successSFX;
//@input Component.AudioComponent failSFX
/** @type {AudioComponent} */
var failSFX = script.failSFX;

//@ui {"widget":"separator"}
//@input float[] shuffleAnimDuration
/** @type {number[]} */
var shuffleAnimDuration = script.shuffleAnimDuration;
//@input int[] shufflePerRound
/** @type {number[]} */
var shufflePerRound = script.shufflePerRound;


var isFront = false;
var thisObj = script.getSceneObject();
var currentState = 0;
var selectedBurger = -1;
var currentRound = 0;
var roundsAmount = 3;
var currentScore = 0;


/////////////////////   FUNC   //////////////////////////
function Start() {
    Reset();

    UpdateState(0);
}

function Reset() {
    currentState = 0;
    selectedBurger = -1;
    currentRound = 0;
    currentScore = 0;

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

    //finalBurgerObj
    stopTweens(finalBurgerObj, ["show", "hide"]);
    startTweens(finalBurgerObj, ["init"]);

    // scripts
    restartButton.api.Init();
    finalScoreScr.api.Init();
    for (var i = 0; i < progressScr.length; i++)
        progressScr[i].api.Init(i);

    for (var i = 0; i < burgersScr.length; i++) {
        burgersScr[i].api.UpdateTexture(global.sandwichIntroTex[i]);
        burgersScr[i].api.Init(i);
    }
}

function DoStateAction() {
    switch (currentState) {
        case 0: {   // state 0 - intro

            ShowIntro(0.25);
            break;
        }
        case 1: {   // state 1 - prepare to game 
            // reset progress
            for (var i = 0; i < progressScr.length; i++)
                progressScr[i].api.Init(i);

            //uiHubObj
            stopTweens(uiHubObj, ["hide"]);
            startTweens(uiHubObj, ["show"]);

            // show burgers
            for (var i = burgersScr.length - 1; i >= 0; i--) {
                burgersScr[i].api.UpdateTexture(global.sandwichGameTex[i]);
                burgersScr[i].api.Show();
            }
            UpdateState(2);
            break;
        }
        case 2: {   // state 2 - play dijon
            selectedBurger = global.getRandomInt(burgersScr.length);
            burgersScr[selectedBurger].api.PlayDijon(1.5, 2);
            break;
        }
        case 3: {   // state 3 -  listen tap after shuffle 
            break;
        }
        case 4: {   // state 4 -final
            if (currentRound == roundsAmount) {
                ShowFinal(1);
            } else {
                UpdateState(2);
            }
            break;
        }
    }
}

function HideIntro() {
    for (var i = 0; i < burgersScr.length; i++) {
        burgersScr[i].api.StopTapHint();
        burgersScr[i].api.Hide();
    }

    //signIntroObj
    stopTweens(signIntroObj, ["show"]);
    startTweens(signIntroObj, ["hide"]);

    //introPromptObj
    stopTweens(introPromptObj, ["show"]);
    startTweens(introPromptObj, ["hide"]);

    global.delay(1, () => { UpdateState(1) });
}

function GuessDijon(id) {

    // whereIsDijonObj - hide
    stopTweens(whereIsDijonObj, ["show"]);
    startTweens(whereIsDijonObj, ["hide"]);

    if (id == selectedBurger)
        Success();
    else
        Fail()
    global.delay(0.5, () => {
        currentRound++;
        UpdateState(4);
    });
}

function Success() {
    currentScore++;
    successSFX.play(1);
    progressScr[currentRound].api.UpdateTexture(global.correctAnswerTex);
}

function Fail() {
    failSFX.play(1);
    progressScr[currentRound].api.UpdateTexture(global.wrongAnswerTex);
}

function ShowIntro(delay) {
    global.delay(delay, () => {
        //signIntroObj
        signIntroImg.mainMaterial.mainPass.baseTex = global.signIntroTex;
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

function ShowFinal(delay) {
    // hide game burgers
    for (var i = 0; i < burgersScr.length; i++) {
        burgersScr[i].api.Hide();
    }

    //uiHubObj
    stopTweens(uiHubObj, ["show"]);
    startTweens(uiHubObj, ["hide"]);

    // delay show final
    global.delay(delay, () => {
        //signIntroObj
        signIntroImg.mainMaterial.mainPass.baseTex =
            global.sighFinalTex;

        stopTweens(signIntroObj, ["hide"]);
        startTweens(signIntroObj, ["show"]);

        //finalScoreScr
        finalScoreScr.api.UpdateTexture(global.scoreTex[currentScore]);
        finalScoreScr.api.Show();

        //finalBurgerObj
        finalBurgerImg.mainPass.baseTex = global.sandwichFinalTex[0];
        stopTweens(finalBurgerObj, ["hide"]);
        startTweens(finalBurgerObj, ["show"]);
    });

    // delay show restart button
    global.delay(delay + 1, () => {
        //finalScoreScr
        restartButton.api.Show();
    });
}

function HideFinal(delay, duration) {
    // delay hide final
    global.delay(delay, () => {
        //signIntroObj
        stopTweens(signIntroObj, ["show"]);
        startTweens(signIntroObj, ["hide"]);

        //finalScoreScr
        finalScoreScr.api.Hide();

        //finalBurgerObj
        stopTweens(finalBurgerObj, ["show"]);
        startTweens(finalBurgerObj, ["hide"]);

        //restartButton
        restartButton.api.Hide();
    });

    global.delay(delay + duration, () => { Start(); });
}

function UpdateState(state) {
    currentState = state;
    DoStateAction();
}

/////////////////////   API   //////////////////////////
global.TapOnBurger = function (id) {
    switch (currentState) {
        case 0: {
            HideIntro();
            break;
        }
        case 3: {
            GuessDijon(id);
            break;
        }
    }
}

global.PlayShuffle = function () {
    // play shuffle animation
    for (var i = 0; i < shufflePerRound[currentRound]; i++) {
        global.delay(i * shuffleAnimDuration[currentRound], () => {
            var b1 = global.getRandomInt(burgersScr.length);
            var b2 = global.updateIndexInList(b1, burgersScr.length, Math.random() < 0.5);

            var b1Pos = burgersScr[b1].api.GetScreenPosition();
            var b2Pos = burgersScr[b2].api.GetScreenPosition();

            burgersScr[b1].api.PlayShuffle(b2Pos, shuffleAnimDuration[currentRound]);
            burgersScr[b2].api.PlayShuffle(b1Pos, shuffleAnimDuration[currentRound]);
        });
    }

    // enalbe tap AFTER shuffle
    global.delay(shufflePerRound[currentRound] * 0.5, () => {

        // go to state 3 - listen burger tap
        UpdateState(3);

        // enable tap on buergers
        for (var i = 0; i < burgersScr.length; i++) {
            burgersScr[i].api.ShuffleDone();
        }

        // whereIsDijonObj - show
        stopTweens(whereIsDijonObj, ["hide"]);
        startTweens(whereIsDijonObj, ["show"]);
    });
}

global.OnClick_Restart = function () {
    HideFinal(0.25, 1);
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