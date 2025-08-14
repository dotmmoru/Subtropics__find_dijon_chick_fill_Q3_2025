// TweenChain.js
// Version: 1.0.0
// Event: Any Event
// Description: Chains multiple tween scripts attached to single object together
// ----- USAGE -----
// Attach all of the Tween Types to be chained together on a single scene object.
//
// Ensure that all of the Tween Types on this scene object are assigned unique Tween Names.
//
// Assign this scene object to the "Scene Object" variable of this Tween Chain in the Inspector.
//
// Under the "Tween Names" section, input the names of the Tweens that you would like to run
//
// Tweens will be run in the order that they are named under "Tween Names"
// -----------------

// @input string tweenName
// @input bool playAutomatically = true
// @input int loopType = 0 {"widget":"combobox", "values":[{"label":"None", "value":0}, {"label":"Loop", "value":1}, {"label":"Ping Pong", "value":2}, {"label":"Ping Pong Once", "value":3}]}
// @ui {"widget":"separator"}
// @input SceneObject sceneObjectReference {"label" : "Scene Object"}
// @input bool playAll = false {"label": "All At Once"}
// @input bool recursive
// @input string[] tweenNames

if (!script.sceneObjectReference) {
    script.sceneObjectReference = script.getSceneObject();
}

// Setup the external API.
script.tweenObject = script.getSceneObject();
script.tweenType = "chain";
script.tweenName = script.tweenName;
script.startTween = startTween;
script.resetObject = resetObject;
script.tween = null;
script.currentTweenName = null;
script.firstTween = null;
script.lastTween = null;
script.allTweens = null;
script.longestTween = null;
script.backwards = false;
script.setupTween = setupTween;
script.chainTweensInOrder = chainTweensInOrder;
script.chainTweensBackwards = chainTweensBackwards;
script.sceneObjectReference = script.sceneObjectReference;
script.updateToStart = updateToStart;
script.updateToEnd = updateToEnd;
script.chainTweensPingPongOnce = chainTweensPingPongOnce;
script.loopType = script.loopType;
script.playAll = script.playAll;
script.playAutomatically = script.playAutomatically;
script.createEvent("OnDestroyEvent").bind(stopTween);

if (global.tweenManager && global.tweenManager.addToRegistry) {
    global.tweenManager.addToRegistry(script);
}

// Update the tween to its start
function updateToStart() {
    // Reset components to their start states
    for (var i = script.tweenNames.length - 1; i >= 0; i--) {
        var scriptComponent = (script.recursive) ? global.tweenManager.findTweenRecursive(script.sceneObjectReference, script.tweenNames[i]) : global.tweenManager.findTween(script.sceneObjectReference, script.tweenNames[i]);

        if (scriptComponent) {
            if (scriptComponent.updateToStart) {
                scriptComponent.updateToStart();
            }
        }
    }
}

// Update the tween to its end
function updateToEnd() {
    for (var i = 0; i < script.tweenNames.length; i++) {
        var scriptComponent = (script.recursive) ? global.tweenManager.findTweenRecursive(script.sceneObjectReference, script.tweenNames[i]) : global.tweenManager.findTween(script.sceneObjectReference, script.tweenNames[i]);

        if (scriptComponent) {
            if (scriptComponent.updateToEnd) {
                scriptComponent.updateToEnd();
            }
        } else {
            return;
        }
    }
}

// Play it automatically if specified
if (script.playAutomatically) {
    // Start the tween
    startTween();
}

// Dynamically create chain of callback functions for each tween
function startTween() {
    if (!global.tweenManager) {
        print("Tween Chain: Tween Manager not initialized. Try moving the TweenManager script to the top of the Objects Panel or changing the event on this TweenType to \"Lens Turned On\".");
        return;
    }

    setupTween();

    // Setup callback functions based on loop type
    if (script.lastTween) {
        switch (script.loopType) {
            case 1:
                setupLoop();
                break;
            case 2:
                setupPingPong(script.playAll, script);
                break;
            case 3:
                setupPingPongOnce(script.playAll, script);
                break;
        }
    }

    // Start the first tween if it exists
    if (script.firstTween) {
        if (script.playAll) {
            for (var i = 0; i < script.allTweens.length; i++) {
                script.allTweens[i].start();
            }
        } else {
            if (Array.isArray(script.firstTween)) {
                for (var j = 0; j < script.firstTween.length; j++) {
                    script.firstTween[j].start();
                }
            } else {
                script.firstTween.start();
            }
        }
    }
}

// Stops active tweens
function stopTween() {
    if (script.firstTween && script.firstTween.stop) {
        script.firstTween.stop();
        script.firstTween = null;
    }
    if (script.lastTween && script.lastTween.stop) {
        script.lastTween.stop();
        script.lastTween = null;
    }
    if (script.allTweens && script.allTweens.length > 0) {
        for (var i = 0; i < script.allTweens.length; ++i) {
            if (script.allTweens[i]) {
                script.allTweens[i].stop();
            }
        }
        script.allTweens = [];
    }
    if (script.longestTween && script.longestTween.stop) {
        script.longestTween.stop();
        script.longestTween = null;
    }
}

// Chain the tweens in order that they are defined in tweenNames.
function setupTween() {
    var result = chainTweensInOrder(script.playAll, script);

    if (!result) {
        return;
    }

    updateToStart();

    script.firstTween = result.firstTween;
    script.lastTween = result.lastTween;
    script.allTweens = result.allTweens;
    script.longestTween = result.longestTween;
}

// Chain tweens in order that they are specified in the inspector
function chainTweensInOrder(playAll, originalScript) {
    return chainTweens("forwards", playAll, originalScript);
}

// Chain tweens in backwards order that they are defined in the Inspector
function chainTweensBackwards(playAll, originalScript) {
    return chainTweens("backwards", playAll, originalScript);
}

// Main body for chaining tweens either forwards or backwards
function chainTweens(order, playAll, originalScript) {
    var tween = null;
    var allTweens = [];
    var firstTween = null;
    var lastTween = null;
    var resultTween = null;
    var longestTween = null;
    var firstTweenFound = false;
    var orderCondition = (order == "forwards");
    var tweenNames = script.tweenNames.slice();
    if (!orderCondition) {
        tweenNames.reverse();
    }
    // Tweens are created in order specified by the parameter
    for (var i = 0; i < tweenNames.length; i++) {
        var scriptComponent = (script.recursive) ? global.tweenManager.findTweenRecursive(script.sceneObjectReference, tweenNames[i]) : global.tweenManager.findTween(script.sceneObjectReference, tweenNames[i]);

        var result = null;
        var newTween = null;

        if (scriptComponent) {
            // Found Tween
            if ((scriptComponent.sceneObjectReference == script.sceneObjectReference) && (scriptComponent.tweenName == script.tweenName)) {
                print("Tween Chain: You are trying to invoke an instance of a TweenChain within itself. This is not allowed. Ensure that the Tween names declared under " + script.tweenName + " are correct.");
                return;
            } else {
                if (scriptComponent.tweenType == "chain") {
                    if (scriptComponent.loopType == 3 && !playAll) {
                        result = scriptComponent.chainTweensPingPongOnce(originalScript);
                    } else if (orderCondition) {
                        result = scriptComponent.chainTweensInOrder(playAll, originalScript);
                    } else {
                        result = scriptComponent.chainTweensBackwards(playAll, originalScript);
                    }

                    allTweens = allTweens.concat(result.allTweens);

                    longestTween = (longestTween) ? ((result.longestTween._duration >= longestTween._duration) ? result.longestTween : longestTween) : result.longestTween;

                    if (tween) {
                        if (!playAll) {
                            // Chain the start of this TweenChain to the most recently created Tween
                            tween._chainedTweens = tween._chainedTweens.concat(result.firstTween);
                        }
                    }

                    // Update first, last, and current tweens on this TweenChain
                    if (Array.isArray(result.lastTween)) {
                        tween = result.lastTween[result.lastTween.length - 1];
                    } else {
                        tween = result.lastTween;
                    }

                    if (!firstTweenFound) {
                        firstTween = result.firstTween;
                        firstTweenFound = true;
                    }
                    lastTween = result.lastTween;
                } else {
                    newTween = orderCondition ? scriptComponent.setupTween() : scriptComponent.setupTweenBackwards();
                    if (newTween) {
                        allTweens = allTweens.concat(newTween);

                        if (tween) {
                            if (!playAll) {
                                // Chain this Tween to the most recently created Tween
                                tween._chainedTweens = tween._chainedTweens.concat(newTween);
                            }
                        }

                        if (order == "forwards" && !playAll) {
                            scriptComponent.updateToEnd();
                        }

                        // Update first, last, and current tweens on this TweenChain
                        if (Array.isArray(newTween)) {
                            tween = newTween[newTween.length - 1];
                            newTween[0].onStart(updateCurrentTween(newTween, originalScript));
                        } else {
                            tween = newTween;
                            newTween.onStart(updateCurrentTween(newTween, originalScript));
                        }

                        longestTween = (longestTween) ? ((tween._duration >= longestTween._duration) ? tween : longestTween) : tween;

                        if (!firstTweenFound) {
                            firstTween = newTween;
                            firstTweenFound = true;
                        }

                        lastTween = newTween;
                    }
                }
            }
        } else {
            print("Tween Chain: " + tweenNames[i] + ", specified under " + script.tweenName + ", is not found. Ensure that the Scene Object contains a TweenType or TweenChain script called " + tweenNames[i]);
            return;
        }
    }

    resultTween = {
        firstTween: firstTween,
        lastTween: lastTween,
        allTweens: allTweens,
        longestTween: longestTween
    };

    return resultTween;
}

// Update the current tween when it plays
function updateCurrentTween(nextTween, originalScript) {
    return function() {
        originalScript.tween = nextTween;
    };
}

// Chain tweens once forwards and once backwards
function chainTweensPingPongOnce(originalScript) {
    // Clear recorded Tweens
    var firstTween = null;
    var lastTween = null;
    var resultTween = null;

    // Get forwards and backwards chained tweens
    var forwardsResult = chainTweensInOrder(false, originalScript);
    updateToStart();
    var backwardsResult = chainTweensBackwards(false, originalScript);

    // Chain forwards and backwards tweens together
    if (Array.isArray(forwardsResult.lastTween)) {
        forwardsResult.lastTween[forwardsResult.lastTween.length - 1]._chainedTweens = forwardsResult.lastTween[forwardsResult.lastTween.length - 1]._chainedTweens.concat(backwardsResult.firstTween);
    } else {
        forwardsResult.lastTween._chainedTweens = forwardsResult.lastTween._chainedTweens.concat(backwardsResult.firstTween);
    }

    firstTween = forwardsResult.firstTween;
    lastTween = backwardsResult.lastTween;

    // Return chained forwards and backwards tweens
    resultTween = {
        firstTween: firstTween,
        lastTween: lastTween,
        longestTween: backwardsResult.longestTween
    };

    return resultTween;
}

// Reset all Tweens to the start of the TweenChain
function resetObject() {
    for (var i = script.tweenNames.length - 1; i >= 0; i--) {
        var scriptComponent = (script.recursive) ? global.tweenManager.findTweenRecursive(script.sceneObjectReference, script.tweenNames[i]) : global.tweenManager.findTween(script.sceneObjectReference, script.tweenNames[i]);

        if (scriptComponent) {
            if (scriptComponent.resetObject) {
                scriptComponent.resetObject();
            }
        }
    }
}

// Sets up callback functions for looping
function setupLoop() {
    var repeatLoop = function() {
        resetObject();

        setupTween();

        if (script.playAll) {
            script.longestTween._onCompleteCallback = repeatLoop;
            for (var i = 0; i < script.allTweens.length; i++) {
                script.allTweens[i].start();
            }
        } else {
            if (Array.isArray(script.lastTween)) {
                script.lastTween[script.lastTween.length - 1]._onCompleteCallback = repeatLoop;
            } else {
                script.lastTween._onCompleteCallback = repeatLoop;
            }

            if (Array.isArray(script.firstTween)) {
                for (var j = 0; j < script.firstTween.length; j++) {
                    script.firstTween[j].start();
                }
            } else {
                script.firstTween.start();
            }
        }
    };

    if (script.playAll) {
        script.longestTween._onCompleteCallback = repeatLoop;
    } else {
        if (Array.isArray(script.lastTween)) {
            script.lastTween[script.lastTween.length - 1]._onCompleteCallback = repeatLoop;
        } else {
            script.lastTween._onCompleteCallback = repeatLoop;
        }
    }
}

// Sets up callback functions for ping pong
function setupPingPong(playAll, originalScript) {
    var repeatPingPong = function() {
        script.backwards = !script.backwards;
        if (script.backwards) {
            var result = chainTweensBackwards(playAll, originalScript);
            script.firstTween = result.firstTween;
            script.lastTween = result.lastTween;
            script.allTweens = result.allTweens;
            script.longestTween = result.longestTween;
        } else {
            setupTween();
        }

        if (playAll) {
            script.longestTween._onCompleteCallback = repeatPingPong;
            for (var i = 0; i < script.allTweens.length; i++) {
                script.allTweens[i].start();
            }
        } else {
            if (Array.isArray(script.lastTween)) {
                script.lastTween[script.lastTween.length - 1]._onCompleteCallback = repeatPingPong;
            } else {
                script.lastTween._onCompleteCallback = repeatPingPong;
            }

            if (Array.isArray(script.firstTween)) {
                for (var j = 0; j < script.firstTween.length; j++) {
                    script.firstTween[j].start();
                }
            } else {
                script.firstTween.start();
            }
        }
    };

    if (script.playAll) {
        script.longestTween._onCompleteCallback = repeatPingPong;
    } else {
        if (Array.isArray(script.lastTween)) {
            script.lastTween[script.lastTween.length - 1]._onCompleteCallback = repeatPingPong;
        } else {
            script.lastTween._onCompleteCallback = repeatPingPong;
        }
    }
}

// Sets up callback functions for ping pong once
function setupPingPongOnce(playAll, originalScript) {
    var repeatPingPongOnce = function() {
        script.backwards = !script.backwards;
        if (script.backwards) {
            var result = chainTweensBackwards(playAll, originalScript);
            script.firstTween = result.firstTween;
            script.lastTween = result.lastTween;
            script.allTweens = result.allTweens;
            script.longestTween = result.longestTween;
        }

        if (playAll) {
            for (var i = 0; i < script.allTweens.length; i++) {
                script.allTweens[i].start();
            }
        } else {
            if (Array.isArray(script.firstTween)) {
                for (var j = 0; j < script.firstTween.length; j++) {
                    script.firstTween[j].start();
                }
            } else {
                script.firstTween.start();
            }
        }
    };

    if (script.playAll) {
        script.longestTween._onCompleteCallback = repeatPingPongOnce;
    } else {
        if (Array.isArray(script.lastTween)) {
            script.lastTween[script.lastTween.length - 1]._onCompleteCallback = repeatPingPongOnce;
        } else {
            script.lastTween._onCompleteCallback = repeatPingPongOnce;
        }
    }
}
