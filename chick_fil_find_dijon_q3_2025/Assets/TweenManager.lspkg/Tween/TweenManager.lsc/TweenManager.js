// TweenManager.js
// Version: 1.0.0
// Event: Lens Initialized
// Description: Calls TweenJS' update and adds some global helper functions
//
// ----- USAGE -----
// To start a tween by name on a given object. Optional callback script
//  global.tweenManager.startTween( tweenObject, tweenName, callback )
//
// To stop a tween by name on a given object
//  global.tweenManager.stopTween( tweenObject, tweenName )
//
// To reset object, call before starting the tween again
//  global.tweenManager.resetObject( tweenObject, tweenName )
//
// To pause a tween on a given object
//  global.tweenManager.pauseTween( tweenObject, tweenName )
//
// To resume a paused tween on a given object
//  global.tweenManager.resumeTween( tweenObject, tweenName )
//
// Get the value of a Tween Value
// global.tweenManager.getGenericTweenValue( tweenObject, tweenName )
//
// To reset tween on a given object
//  global.tweenManager.resetTween( tweenObject, tweenName )
//
// To reset all registered tweens
//  global.tweenManager.resetTweens()
//
// To start all registered tweens which has PlayAutomatically set to true
//  global.tweenManager.restartAutoTweens()
// -----------------

// @input bool printDebugLog = false

// Add play and pause functionality to Tween.js
global.TWEEN.Tween.prototype._isPaused = false;
global.TWEEN.Tween.prototype._pauseTime = null;

global.TWEEN.Tween.prototype.resume = function (tweenName) {
    if (!this._isPaused) {
        debugPrint("Tween Manager: " + tweenName + " has not been paused. Did you mean to call startTween this Tween instead?");
        return;
    }

    this._isPaused = !this._isPaused;

    this._startTime += global.TWEEN.now() - this._pauseTime;

    global.TWEEN.add(this);
};

global.TWEEN.Tween.prototype.pause = function (tweenName) {
    if (this._isPaused) {
        debugPrint("Tween Manager: Warning, " + tweenName + ", has already been paused.");
        return;
    }

    this._isPaused = !this._isPaused;

    this._pauseTime = global.TWEEN.now();

    global.TWEEN.remove(this);
};

//overwrite TWEEN.now function defined in Tween.js
global.TWEEN.now = function () {
    return getTime() * 1000;
};

// On update, update the Tween engine
function onUpdateEvent() {
    global.TWEEN.update();
}

// Bind an update event
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdateEvent);

// Resume a tween that has been paused
function resumeTween(tweenObject, _tweenName) {
    var tweenScriptComponent = findTween(tweenObject, _tweenName);
    if (tweenScriptComponent) {
        var tweenName = tweenScriptComponent.tweenName;
        if (tweenScriptComponent.playAll && tweenScriptComponent.tweenType == "chain") {
            for (var i = 0; i < tweenScriptComponent.allTweens.length; i++) {
                tweenScriptComponent.allTweens[i].resume(tweenName);
            }
        } else if (tweenScriptComponent.tween) {
            if (Array.isArray(tweenScriptComponent.tween)) {
                for (var j = 0; j < tweenScriptComponent.tween.length; j++) {
                    tweenScriptComponent.tween[j].resume(tweenName);
                }
            } else {
                tweenScriptComponent.tween.resume(tweenName);
            }
        } else {
            debugPrint("Tween Manager: Warning, trying to resume " + tweenName + ", which hasn't been initialized", true);
        }
    } else {
        debugPrint("Tween Manager: Trying to resume " + tweenName + ", which does not exist. Ensure that the Tween Type has been initialized and started.", true);
    }
}

// Pause a tween that is currently playing
function pauseTween(tweenObject, _tweenName) {
    var tweenScriptComponent = findTween(tweenObject, _tweenName);
    if (tweenScriptComponent) {
        var tweenName = tweenScriptComponent.tweenName;
        if (tweenScriptComponent.tweenType == "chain" && tweenScriptComponent.playAll) {
            for (var i = 0; i < tweenScriptComponent.allTweens.length; i++) {
                tweenScriptComponent.allTweens[i].pause(tweenName);
            }
        } else if (tweenScriptComponent.tween) {
            if (Array.isArray(tweenScriptComponent.tween)) {
                for (var j = 0; j < tweenScriptComponent.tween.length; j++) {
                    tweenScriptComponent.tween[j].pause(tweenName);
                }
            } else {
                tweenScriptComponent.tween.pause(tweenName);
            }
        } else {
            debugPrint("Tween Manager: Warning, trying to pause " + tweenName + ", which hasn't been initialized", true);
        }
    } else {
        debugPrint("Tween Manager: Trying to pause " + tweenName + ", which does not exist. Ensure that the Tween Type has been initialized and started.", true);
    }
}

function isPaused(tweenObject, tweenName) {
    var tweenScriptComponent = findTween(tweenObject, tweenName);
    if (tweenScriptComponent) {
        if (tweenScriptComponent.tween) {
            if (Array.isArray(tweenScriptComponent.tween)) {
                return tweenScriptComponent.tween[tweenScriptComponent.tween.length - 1]._isPaused;
            }

            return tweenScriptComponent.tween._isPaused;
        }

        return false;
    }

    debugPrint("TweenManager: You are trying to check if " + tweenName + " is currently paused, but a Tween of that type does not exist on " + tweenObject.name + ".", true);
}

// Return true if a tween is playing, false otherwise
function isPlaying(tweenObject, tweenName) {
    var tweenScriptComponent = findTween(tweenObject, tweenName);
    if (tweenScriptComponent) {
        if (tweenScriptComponent.tween) {
            if (Array.isArray(tweenScriptComponent.tween)) {
                return tweenScriptComponent.tween[tweenScriptComponent.tween.length - 1]._isPlaying;
            }

            return tweenScriptComponent.tween._isPlaying;
        }

        return false;
    }

    debugPrint("TweenManager: You are trying to check if " + tweenName + " is currently playing, but a Tween of that type does not exist on " + tweenObject.name + ".", true);
}

// Global function to start a tween on a specific object
function startTween(tweenObject, tweenName, completeCallback, startCallback, stopCallback) {
    var tweenScriptComponent = findTween(tweenObject, tweenName);
    if (tweenScriptComponent) {
        debugPrint("Tween Manager: Starting " + tweenName);

        // Remove tween if it already exists
        if (tweenScriptComponent.tween) {
            if (Array.isArray(tweenScriptComponent.tween)) {
                for (var i in tweenScriptComponent.tween) {
                    global.TWEEN.remove(tweenScriptComponent.tween[i]);
                }
            } else {
                global.TWEEN.remove(tweenScriptComponent.tween);
            }
        }

        // Start the tween
        tweenScriptComponent.startTween();

        // Add the callbacks
        if (tweenScriptComponent.tweenType == "chain") {
            if (completeCallback) {
                if (tweenScriptComponent.playAll) {
                    tweenScriptComponent.longestTween.onComplete(completeCallback);
                } else {
                    if (Array.isArray(tweenScriptComponent.lastTween)) {
                        tweenScriptComponent.lastTween[tweenScriptComponent.lastTween.length - 1].onComplete(completeCallback);
                    } else {
                        tweenScriptComponent.lastTween.onComplete(completeCallback);
                    }
                }
            }

            if (startCallback) {
                if (Array.isArray(tweenScriptComponent.firstTween)) {
                    tweenScriptComponent.firstTween[tweenScriptComponent.firstTween.length - 1].onStart(startCallback);
                } else {
                    tweenScriptComponent.firstTween.onStart(startCallback);
                }
            }

            if (stopCallback) {
                for (var k = 0; k < tweenScriptComponent.allTweens.length; k++) {
                    var currentTween = tweenScriptComponent.allTweens[k];
                    if (Array.isArray(currentTween)) {
                        for (var j = 0; j < currentTween.length; j++) {
                            currentTween[j].onStop(stopCallback);
                        }
                    } else {
                        currentTween.onStop(stopCallback);
                    }
                }
            }
        } else {
            if (completeCallback) {
                if (Array.isArray(tweenScriptComponent.tween)) {
                    tweenScriptComponent.tween[tweenScriptComponent.tween.length - 1].onComplete(completeCallback);
                } else {
                    tweenScriptComponent.tween.onComplete(completeCallback);
                }
            }

            if (startCallback) {
                if (Array.isArray(tweenScriptComponent.tween)) {
                    tweenScriptComponent.tween[tweenScriptComponent.tween.length - 1].onStart(startCallback);
                } else {
                    tweenScriptComponent.tween.onStart(startCallback);
                }
            }

            if (stopCallback) {
                if (Array.isArray(tweenScriptComponent.tween)) {
                    tweenScriptComponent.tween[tweenScriptComponent.tween.length - 1].onStop(stopCallback);
                } else {
                    tweenScriptComponent.tween.onStop(stopCallback);
                }
            }
        }
    }
}

// Global function to stop a tween on a specific object
function stopTween(tweenObject, tweenName) {
    var tweenScriptComponent = findTween(tweenObject, tweenName);
    if (tweenScriptComponent) {
        debugPrint("Tween Manager: Stopping " + tweenName);
        if (tweenScriptComponent.tweenType == "chain") {
            if (tweenScriptComponent.playAll && tweenScriptComponent.allTweens) {
                for (var i = 0; i < tweenScriptComponent.allTweens.length; i++) {
                    tweenScriptComponent.allTweens[i].stop();
                }
                return;
            } else if (tweenScriptComponent.tween) {
                if (Array.isArray(tweenScriptComponent.tween)) {
                    for (var j = 0; j < tweenScriptComponent.tween.length; j++) {
                        tweenScriptComponent.tween[j].stop();
                    }
                } else {
                    tweenScriptComponent.tween.stop();
                }
            } else {
                debugPrint("Tween Manager: Warning, trying to stop " + tweenName + ", which hasn't been started");
            }

            return;
        }

        if (tweenScriptComponent.tween) {
            if (Array.isArray(tweenScriptComponent.tween)) {
                for (var k = 0; k < tweenScriptComponent.tween.length; k++) {
                    tweenScriptComponent.tween[k].stop();
                }
            } else {
                tweenScriptComponent.tween.stop();
            }
        } else {
            debugPrint("Tween Manager: Warning, trying to stop " + tweenName + ", which hasn't been started");
        }
    }
}

// Manually set the start value of a tween
function setStartValue(tweenObject, tweenName, startValue) {
    var tweenScriptComponent = findTween(tweenObject, tweenName);

    if (tweenScriptComponent) {
        if (tweenScriptComponent.setStart) {
            tweenScriptComponent.setStart(startValue);
        } else {
            debugPrint("Tween Manager: You cannot manually set the start value of " + tweenName);
        }
    }
}

// Manually set the end value of a tween
function setEndValue(tweenObject, tweenName, endValue) {
    var tweenScriptComponent = findTween(tweenObject, tweenName);

    if (tweenScriptComponent) {
        if (tweenScriptComponent.setEnd) {
            tweenScriptComponent.setEnd(endValue);
        } else {
            debugPrint("Tween Manager: You cannot manually set the end value of " + tweenName);
        }
    }
}

function setTime(tweenObject, tweenName, timeValue) {
    var tweenScriptComponent = findTween(tweenObject, tweenName);

    if (tweenScriptComponent) {
        if (tweenScriptComponent.setTime) {
            tweenScriptComponent.setTime(timeValue);
        } else {
            debugPrint("Tween Manager: You cannot manually set the end value of " + tweenName);
        }
    }
}

// Global function to reset and object to its starting values
function resetObject(tweenObject, tweenName) {
    var tweenScriptComponent = findTween(tweenObject, tweenName);
    if (tweenScriptComponent) {
        debugPrint("Tween Manager: Resetting Object " + tweenName);
        tweenScriptComponent.resetObject();
    }
}

// Global function to reset and start tween again
function resetTween(tweenObject, tweenName) {
    var tweenScriptComponent = findTween(tweenObject, tweenName);
    resetTweenComponent(tweenScriptComponent);
}

function resetTweenComponent(tweenScriptComponent) {
    if (tweenScriptComponent) {
        debugPrint("Tween Manager: Resetting tween " + tweenScriptComponent.tweenName);

        if (tweenScriptComponent.tweenType == "chain") {
            tweenScriptComponent.backwards = false;
            debugPrint("Tween Manager: Chain Tween reset is not fully supported");
        }

        if (tweenScriptComponent.movementType && tweenScriptComponent.movementType > 0) {
            debugPrint("Tween Manager: Reset for this tween movement type is not fully supported");
        }

        // Remove tween if it already exists
        if (tweenScriptComponent.tween) {
            if (Array.isArray(tweenScriptComponent.tween)) {
                for (var i in tweenScriptComponent.tween) {
                    global.TWEEN.remove(tweenScriptComponent.tween[i]);
                }
            } else {
                global.TWEEN.remove(tweenScriptComponent.tween);
            }
        }
        tweenScriptComponent.resetObject();
    }
}

// Global function to reset all tweens
function resetTweens() {
    for (var i = 0; i < script.registry.length; i++) {
        var tweenScriptComponent = script.registry[i];
        resetTweenComponent(tweenScriptComponent);
    }
}

// Global function to restart all playAutomatically tweens
function restartAutoTweens() {
    for (var i = 0; i < script.registry.length; i++) {
        var tweenScriptComponent = script.registry[i];

        if (tweenScriptComponent && tweenScriptComponent.playAutomatically) {
            debugPrint("Restarting tween " + tweenScriptComponent.tweenName);

            // Start the tween
            tweenScriptComponent.startTween();
        }
    }
}

script.registry = [];

function addToRegistry(tweenScriptComponent) {
    if (tweenScriptComponent) {
        debugPrint("Adding tween " + tweenScriptComponent.tweenName + " to Tween Manager registry");
        script.registry[script.registry.length++] = tweenScriptComponent;
        return true;
    }
    return false;
}

function cleanRegistry() {
    script.registry = [];
}

// Create the easing type string that will be used by the tween
function getTweenEasingType(easingFunction, easingType) {
    if (easingFunction == "Linear") {
        return global.TWEEN.Easing.Linear.None;
    }

    return global.TWEEN.Easing[easingFunction][easingType];
}

// Configures the loop type for the tween
function setTweenLoopType(tween, loopType) {
    switch (loopType) {
        case 0: // None
            break;
        case 1: // Loop
            tween.repeat(Infinity);
            break;
        case 2: // Ping Pong
            tween.yoyo(true);
            tween.repeat(Infinity);
            break;
        case 3: // Ping Pong Once
            tween.yoyo(true);
            tween.repeat(1);
            break;
    }
}

// Finds tween on an object by name
function findTween(tweenObject, tweenName) {
    var scriptComponents = tweenObject.getComponents("Component.ScriptComponent");

    for (var i = 0; i < scriptComponents.length; i++) {
        var scriptComponent = scriptComponents[i];
        if (scriptComponent) {
            if (scriptComponent.tweenName) {
                if (tweenName == scriptComponent.tweenName) {
                    return scriptComponent;
                }
            }
        } else {
            debugPrint("Tween Manager: Tween type hasn't initialized. Ensure that " + tweenName + " is on \"Lens Turn On\" and that Tween Manager is at the top of the Objects Panel.", true);
            return;
        }
    }

    debugPrint("Tween Manager: Tween, " + tweenName + ", is not found. Ensure that " + tweenName + " is on \"Lens Turn On\" and that Tween Manager is at the top of the Objects Panel.", true);
}

// Finds tween on an object and its children by name
function findTweenRecursive(tweenObject, tweenName) {
    var scriptComponents = tweenObject.getComponents("Component.ScriptComponent");
    for (var i = 0; i < scriptComponents.length; i++) {
        var scriptComponent = scriptComponents[i];
        if (scriptComponent) {
            if (scriptComponent.tweenName) {
                if (tweenName == scriptComponent.tweenName) {
                    return scriptComponent;
                }
            }
        } else {
            debugPrint("Tween Manager: Tween type hasn't initialized. Ensure that " + tweenName + " is on \"Lens Turn On\" and that Tween Manager is at the top of the Objects Panel.", true);
            return;
        }
    }

    for (var j = 0; j < tweenObject.getChildrenCount(); j++) {
        var result = findTweenRecursive(tweenObject.getChild(j), tweenName);
        if (result) {
            return result;
        }
    }
}

// Finds a generic tween on an object by name
function getGenericTweenValue(tweenObject, tweenName) {
    var scriptComponents = tweenObject.getComponents("Component.ScriptComponent");

    for (var i = 0; i < scriptComponents.length; i++) {
        var scriptComponent = scriptComponents[i];

        if (scriptComponent) {
            if (tweenName == scriptComponent.tweenName) {
                if (scriptComponent.tweenType == "value") {
                    if (scriptComponent.tween) {
                        if (!scriptComponent.tween._isPlaying) {
                            debugPrint("Tween Manager: Tween Value, " + tweenName + ", is not currently playing. Ensure that it has been started by either calling its startTween() function or by setting it to Play Automatically.", true);
                        }
                    } else {
                        debugPrint("Tween Manager: Tween Value, " + tweenName + ", has not been set up. Ensure that this Tween Value is ordered before every other script that uses it in the Objects Panel and Inspector. Try initializing it in the Initialized event and scripting in the Lens Turn On event.", true);
                    }

                    return scriptComponent.value;
                }
            }
        } else {
            debugPrint("Tween Manager: Tween Value, " + tweenName + ", hasn't initialized. Needs to initialize prior to scripting playback. Likely an order of operations issue. Try initializing tween type in the Initialized event and scripting it in the Lens Turn On event. Or, try moving the Tween Manager to the top of the Objects hierarchy.", true);
            return;
        }
    }

    debugPrint("Tween Manager: Tween Value, " + tweenName + ", is not found. Ensure that " + tweenName + " is enabled and the Tween Name passed into this function exactly matches the specified Tween Name for this Tween Value in the Inspector.", true);
}

// Returns the opposite easing type to the one passed in as a parameter; for use with ping pong
function getSwitchedEasingType(initialType) {
    switch (initialType) {
        case "In":
            return "Out";
        case "Out":
            return "In";
        default:
            return "InOut";
    }
}

function debugPrint(msg, force) {
    if (script.printDebugLog || force) {
        print(msg);
    }
}

// Register global helper functions
global.tweenManager = {};
global.tweenManager.getTweenEasingType = getTweenEasingType;
global.tweenManager.setTweenLoopType = setTweenLoopType;
global.tweenManager.startTween = startTween;
global.tweenManager.stopTween = stopTween;
global.tweenManager.pauseTween = pauseTween;
global.tweenManager.resumeTween = resumeTween;
global.tweenManager.resetObject = resetObject;
global.tweenManager.findTween = findTween;
global.tweenManager.findTweenRecursive = findTweenRecursive;
global.tweenManager.getGenericTweenValue = getGenericTweenValue;
global.tweenManager.getSwitchedEasingType = getSwitchedEasingType;
global.tweenManager.setStartValue = setStartValue;
global.tweenManager.setEndValue = setEndValue;
global.tweenManager.setTime = setTime;
global.tweenManager.isPlaying = isPlaying;
global.tweenManager.isPaused = isPaused;
global.tweenManager.addToRegistry = addToRegistry;
global.tweenManager.cleanRegistry = cleanRegistry;
global.tweenManager.resetTween = resetTween;
global.tweenManager.resetTweens = resetTweens;
global.tweenManager.restartAutoTweens = restartAutoTweens;
