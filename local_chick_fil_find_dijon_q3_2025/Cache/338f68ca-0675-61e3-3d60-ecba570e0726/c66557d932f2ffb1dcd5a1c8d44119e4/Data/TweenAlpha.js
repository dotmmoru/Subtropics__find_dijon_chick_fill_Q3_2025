// TweenAlpha.js
// Version: 1.0.0
// Event: Any Event
// Description: Runs a tween on a Lens Studio object's alpha using TweenJS
// ----- USAGE -----
// Attach this script as a component after the Tween Manager script on either the same scene object or in a lower scene object in the Objects Panel.
//
// Assign a scene object that contains a non-Default Material to "Scene Object" on this script.
// -----------------

// @input SceneObject sceneObjectReference {"label" : "Scene Object"}
// @input string tweenName
// @input bool playAutomatically = true
// @input int loopType = 0 {"widget":"combobox", "values":[{"label":"None", "value":0}, {"label":"Loop", "value":1}, {"label":"Ping Pong", "value":2}, {"label":"Ping Pong Once", "value":3}]}
// @ui {"widget":"separator"}
// @input int movementType = 0 {"widget": "combobox", "values": [{"label": "From / To", "value": 0}, {"label": "To", "value": 1}, {"label":"From", "value": 2}, {"label":"Offset", "value": 3}]}
// @input float startInput = 0.0 {"widget":"slider", "min":0.0, "max":1.0, "step":0.01, "showIf":"movementType", "showIfValue":0}
// @input float endInput = 1.0 {"widget":"slider", "min":0.0, "max":1.0, "step":0.01, "showIf":"movementType", "showIfValue":0}
// @input float from = 0.0 {"widget":"slider", "min":0.0, "max":1.0, "step":0.01, "showIf":"movementType", "showIfValue":2, "label":"Start"}
// @input float to = 0.0 {"widget":"slider", "min":0.0, "max":1.0, "step":0.01, "showIf":"movementType", "showIfValue":1, "label":"End"}
// @input float offset = 0.0 {"widget":"slider", "min":-1.0, "max":1.0, "step":0.01, "showIf":"movementType", "showIfValue":3}
// @input bool additive {"showIf":"movementType", "showIfValue": 3}
// @ui {"widget":"label", "label":"(Use on Loop)", "showIf": "movementType", "showIfValue": 3}
// @input bool recursive = false
// @input float time = 1.0
// @input float delay = 0.0

// @ui {"widget":"separator"}
// @input string easingFunction = "Quadratic" {"widget":"combobox", "values":[{"label":"Linear", "value":"Linear"}, {"label":"Quadratic", "value":"Quadratic"}, {"label":"Cubic", "value":"Cubic"}, {"label":"Quartic", "value":"Quartic"}, {"label":"Quintic", "value":"Quintic"}, {"label":"Sinusoidal", "value":"Sinusoidal"}, {"label":"Exponential", "value":"Exponential"}, {"label":"Circular", "value":"Circular"}, {"label":"Elastic", "value":"Elastic"}, {"label":"Back", "value":"Back"}, {"label":"Bounce", "value":"Bounce"}]}
// @input string easingType = "Out" {"widget":"combobox", "values":[{"label":"In", "value":"In"}, {"label":"Out", "value":"Out"}, {"label":"In / Out", "value":"InOut"}]}

// If no scene object is specified, use object the script is attached to
if (!script.sceneObjectReference) {
    script.sceneObjectReference = script.getSceneObject();
}

// Setup the external API
script.tweenObject = script.getSceneObject();
script.tweenType = "alpha";
script.tweenName = script.tweenName;
script.time = script.time;
script.startTween = startTween;
script.resetObject = resetObject;
script.movementType = script.movementType;
script.loopType = script.loopType;
script.additive = script.additive;
script.tween = null;
script.tweenObjects = null;
script.setupTween = setupTween;
script.setupTweenBackwards = setupTweenBackwards;
script.sceneObjectReference = script.sceneObjectReference;
script.updateToStart = updateToStart;
script.updateToEnd = updateToEnd;
script.loopType = script.loopType;
script.start = null;
script.end = null;
script.setStart = setStart;
script.setEnd = setEnd;
script.manualStart = false;
script.manualEnd = false;
script.playAutomatically = script.playAutomatically;
script.createEvent("OnDestroyEvent").bind(stopTween);

if (global.tweenManager && global.tweenManager.addToRegistry) {
    global.tweenManager.addToRegistry(script);
}

// Manually set start value
function setStart(start) {
    script.manualStart = true;
    script.start = start;
}

// Manually set end value
function setEnd(end) {
    script.manualEnd = true;
    script.end = end;
}

// Update the tween to its start
function updateToStart() {
    for (var i = 0; i < script.tweenObjects.length; i++) {
        var tweenObject = script.tweenObjects[i];

        updateAlphaComponent(tweenObject.component, tweenObject.startValue);
    }
}

// Update the tween to its end
function updateToEnd() {
    for (var i = 0; i < script.tweenObjects.length; i++) {
        var tweenObject = script.tweenObjects[i];

        if (script.loopType == 3) {
            updateAlphaComponent(tweenObject.component, tweenObject.startValue);
        } else {
            updateAlphaComponent(tweenObject.component, tweenObject.endValue);
        }
    }
}

// Play it automatically if specified
if (script.playAutomatically) {
    // Start the tween
    startTween();
}

// Create the tween with passed in parameters
function startTween() {
    if (!global.tweenManager) {
        print("Tween Alpha: Tween Manager not initialized. Try moving the TweenManager script to the top of the Objects Panel or changing the event on this TweenType to \"Lens Turned On\".");
        return;
    }

    var tween = setupTween();

    if (tween) {
        if (script.tween.length > 0) {
            if (script.movementType == 3 && script.loopType == 1 && script.additive) {
                script.tween[script.tween.length - 1].onComplete(startTween);
            }

            // Start the tweens
            for (var i = 0; i < script.tween.length; i++) {
                script.tween[i].start();
            }
        }
    }
}

// Stops active tween
function stopTween() {
    if (script.tween) {
        for (var i = 0; i < script.tween.length; ++i) {
            if (script.tween[i]) {
                script.tween[i].stop();
            }
        }
    }
    script.tween = [];
    script.tweenObjects = [];
}

// Create the tween with passed in parameters
function setupTween() {
    script.tweenObjects = [];

    script.tween = [];

    var componentTypes = [
        "Component.MaterialMeshVisual",
        "Component.Text"
    ];

    for (var i = 0; i < componentTypes.length; i++) {
        setupAlphaComponentTweens(componentTypes[i], script.sceneObjectReference);
    }

    if (script.tween.length == 0) {
        print("Tween Alpha: No compatible components found for SceneObject " + script.sceneObjectReference.name);
        return;
    }

    return script.tween;
}

function setupAlphaComponentTweens(componentType, sceneObject) {
    var visualComponents = sceneObject.getComponents(componentType);

    for (var i = 0; i < visualComponents.length; i++) {
        var visualComponent = visualComponents[i];
        var startValue = null;
        var endValue = null;
        var tween = null;
        var tweenObject = null;

        if (visualComponent.getMaterialsCount() == 0) {
            continue;
        }

        if (!script.manualStart) {
            switch (script.movementType) {
                case 0:
                    script.start = {
                        a: script.startInput
                    };
                    break;
                case 2:
                    script.start = {
                        a: script.from
                    };
                    break;
                case 1:
                case 3:
                    script.start = {
                        a: getVisualComponentAlpha(visualComponent)
                    };
                    break;
            }
        }

        startValue = script.start;

        if (!script.manualEnd) {
            switch (script.movementType) {
                case 0:
                    script.end = {
                        a: script.endInput
                    };
                    break;
                case 2:
                    script.end = {
                        a: getVisualComponentAlpha(visualComponent)
                    };
                    break;
                case 1:
                    script.end = {
                        a: script.to
                    };
                    break;
                case 3:
                    script.end = {
                        a: startValue.a + script.offset
                    };
                    break;
            }
        }

        endValue = script.end;

        // Create the tween
        tween = new global.TWEEN.Tween(startValue)
            .to(endValue, script.time * 1000.0)
            .delay(script.delay * 1000.0)
            .easing(global.tweenManager.getTweenEasingType(script.easingFunction, script.easingType))
            .onUpdate(updateAlphaComponent(visualComponent));

        if (tween) {
            // Configure the type of looping based on the inputted parameters
            if (script.movementType == 3 && script.additive && script.loopType == 1) {
                global.tweenManager.setTweenLoopType(tween, 0);
            } else {
                global.tweenManager.setTweenLoopType(tween, script.loopType);
            }

            tweenObject = {
                tween: tween,
                startValue: {
                    a: startValue.a
                },
                endValue: {
                    a: endValue.a
                },
                component: visualComponent
            };

            script.tweenObjects.push(tweenObject);

            script.tween.push(tween);
        } else {
            print("Tween Alpha: Tween Manager not initialized. Try moving the TweenManager script to the top of the Objects Panel or changing the event on this TweenType to \"Lens Turned On\".");
        }
    }
    if (script.recursive) {
        for (var j = 0; j < sceneObject.getChildrenCount(); j++) {
            setupAlphaComponentTweens(componentType, sceneObject.getChild(j));
        }
    }
}

// Create the tween with swapped start and end parameters
function setupTweenBackwards() {
    var tempTweenObjectsArray = [];

    var tempTweenArray = [];

    var easingType = global.tweenManager.getSwitchedEasingType(script.easingType);

    for (var i = 0; i < script.tween.length; i++) {
        var newTweenObject = null;

        var tween = script.tweenObjects[i];

        var tweenStart = (script.loopType == 3) ? tween.startValue : tween.endValue;

        var tweenEnd = (script.loopType == 3) ? tween.endValue : tween.startValue;

        var tweenEasingType = global.tweenManager.getTweenEasingType(script.easingFunction, easingType);

        var newTween = new global.TWEEN.Tween(tweenStart)
            .to(tweenEnd, script.time * 1000.0)
            .delay(script.delay * 1000.0)
            .easing(tweenEasingType)
            .onUpdate(updateAlphaComponent(tween.component));

        if (newTween) {
            // Configure the type of looping based on the inputted parameters
            global.tweenManager.setTweenLoopType(newTween, script.loopType);

            newTweenObject = {
                tween: newTween,
                startValue: {
                    a: (script.loopType == 3) ? tween.startValue.a : tween.endValue.a
                },
                endValue: {
                    a: (script.loopType == 3) ? tween.endValue.a : tween.startValue.a
                },
                component: tween.component
            };

            // Save reference to tween
            tempTweenObjectsArray.push(newTweenObject);

            tempTweenArray.push(newTween);
        } else {
            print("Tween Alpha: Tween Manager not initialized. Try moving the TweenManager script to the top of the Objects Panel or changing the event on this TweenType to \"Lens Turned On\".");
            return;
        }
    }

    return tempTweenArray;
}

function getVisualComponentAlpha(visual) {
    var color;
    if (visual.getTypeName() == "Component.Text") {
        color = visual.textFill.color;
    } else {
        color = visual.getMaterial(0).getPass(0).baseColor;
    }

    if (color && color.a != undefined) {
        return color.a;
    } else {
        print("TweenAlpha: Visual Component on Object '" + visual.getSceneObject().name + "' does not have a material supported by TweenAlpha. Setting alpha to 1.0.");
        return 1.0;
    }
}

function updateText(visualComponent, value) {
    var fillColor = visualComponent.textFill.color;

    if (fillColor && fillColor.a != undefined) {
        fillColor.a = value.a;
        visualComponent.textFill.color = fillColor;
    }

    // Outline Color
    var outlineColor = visualComponent.outlineSettings.fill.color;

    if (outlineColor && outlineColor.a != undefined) {
        outlineColor.a = value.a;
        visualComponent.outlineSettings.fill.color = outlineColor;
    }

    // Drop Shadow Color
    var dropShadowColor = visualComponent.dropshadowSettings.fill.color;
    if (dropShadowColor && dropShadowColor.a != undefined) {
        dropShadowColor.a = value.a;

        visualComponent.dropshadowSettings.fill.color = dropShadowColor;
    }

    // Background Color
    var backgroundColor = visualComponent.backgroundSettings.fill.color;
    if (backgroundColor && backgroundColor.a != undefined) {
        backgroundColor.a = value.a;

        visualComponent.backgroundSettings.fill.color = backgroundColor;
    }
}

function updateVisual(visualComponent, value) {
    var currColor = visualComponent.getMaterial(0).getPass(0).baseColor;
    if (currColor && currColor.a != undefined) {
        currColor.a = value.a;

        visualComponent.getMaterial(0).getPass(0).baseColor = currColor;
    }
}

// Resets the object to its start
function resetObject() {
    if (script.tweenObjects == null) {
        setupTween();
    }
    for (var i = 0; i < script.tweenObjects.length; i++) {
        var tweenObject = script.tweenObjects[i];
        updateAlphaComponent(tweenObject.component, tweenObject.startValue);
    }
}

function updateAlphaComponent(visualComponent, value) {
    if (value) {
        if (visualComponent.getTypeName() == "Component.Text") {
            updateText(visualComponent, value);
        } else {
            updateVisual(visualComponent, value);
        }
    } else {
        return function(value) {
            if (visualComponent.getTypeName() == "Component.Text") {
                updateText(visualComponent, value);
            } else {
                updateVisual(visualComponent, value);
            }
        };
    }
}
