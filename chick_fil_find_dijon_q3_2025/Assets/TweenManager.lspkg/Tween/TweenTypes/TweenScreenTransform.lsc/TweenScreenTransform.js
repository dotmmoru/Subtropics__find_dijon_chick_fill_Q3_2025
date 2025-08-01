// TweenScreenTransform.js
// Version: 1.0.0
// Event: Any Event
// Description: Runs a tween on a Lens Studio ScreenTransform using TweenJS
// ----- USAGE -----
// Attach this script as a component after the Tween Manager script on either the same scene object or in a lower scene object in the Objects Panel.
//
// Assign a Scene Object that has a ScreenTransform component to the "Scene Object" property on this script.
// -----------------

// @input SceneObject sceneObjectReference {"label" : "Scene Object"}
// @input string tweenName
// @input bool playAutomatically = true
// @input int loopType = 0 {"widget":"combobox", "values":[{"label":"None", "value":0}, {"label":"Loop", "value":1}, {"label":"Ping Pong", "value":2}, {"label":"Ping Pong Once", "value":3}]}
// @ui {"widget":"separator"}
// @input int type = 0 {"widget":"combobox", "values":[{"label":"Position", "value":0}, {"label":"Scale", "value":1}, {"label":"Rotation", "value":2}, {"label":"Anchors", "value":3}, {"label":"Offsets", "value":4}]}
// @input int movementType = 0 {"widget": "combobox", "values": [{"label": "From / To", "value": 0}, {"label": "To", "value": 1}, {"label":"From", "value": 2}, {"label":"Offset", "value": 3}]}

// @input int anchorsParam = 0 {"label" : "Rect Parameter", "widget":"combobox", "values":[{"label":"Bounds", "value":0}, {"label":"Size", "value":1}, {"label":"Center", "value":2}], "showIf": "type", "showIfValue": 3}
// @input int offsetsParam = 0 {"label" : "Rect Parameter", "widget":"combobox", "values":[{"label":"Bounds", "value":0}, {"label":"Size", "value":1}, {"label":"Center", "value":2}], "showIf": "type", "showIfValue": 4}
// Movement Values - From/To
// @ui {"widget":"separator"}
// @ui {"widget" : "label", "label" : "Start Value:", "showIf": "movementType", "showIfValue": 0}
// @ui {"widget" : "label", "label" : "To Value:", "showIf": "movementType", "showIfValue": 1}
// @ui {"widget" : "label", "label" : "From Value:", "showIf": "movementType", "showIfValue": 2}
// @ui {"widget" : "label", "label" : "Offset Value:", "showIf": "movementType", "showIfValue": 3}
// @input vec3 startPosition = {0, 0, 0} {"showIf": "type", "showIfValue": 0, "label": "    Position"}
// @input vec3 startScale = {1, 1, 1} {"showIf": "type", "showIfValue": 1, "label": "    Scale"}
// @input float startRotation = 0 {"showIf": "type", "showIfValue": 2, "label": "    Rotation"}

// @ui {"widget":"group_start", "label":"Rectangle Parameters", "showIf": "type", "showIfValue": 3}
// @input vec4 startAnchorsBounds = {-1, 1, -1, 1}   {"label": "Bounds",  "showIf": "anchorsParam", "showIfValue": 0}
// @input vec2 startAnchorsSize = {1, 1}   {"label": "Size",  "showIf": "anchorsParam", "showIfValue": 1}
// @input vec2 startAnchorsCenter = {0, 0}   {"label": "Center",  "showIf": "anchorsParam", "showIfValue": 2}
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Rectangle Parameters", "showIf": "type", "showIfValue": 4}
// @input vec4 startOffsetsBounds = {-1, 1, -1, 1}   {"label": "Bounds",  "showIf": "offsetsParam", "showIfValue": 0}
// @input vec2 startOffsetsSize = {1, 1}   {"label": "Size",  "showIf": "offsetsParam", "showIfValue": 1}
// @input vec2 startOffsetsCenter = {0, 0}   {"label": "Center",  "showIf": "offsetsParam", "showIfValue": 2}
// @ui {"widget":"group_end"}

// @ui {"widget":"group_start", "label":"End Value:", "showIf": "movementType", "showIfValue": 0}
// @input vec3 endPosition = {0, 0, 0} {"showIf": "type", "showIfValue": 0, "label": "Position"}
// @input vec3 endScale = {1, 1, 1} {"showIf": "type", "showIfValue": 1, "label": "Scale"}
// @input float endRotation = 0 {"showIf": "type", "showIfValue": 2, "label": "Rotation"}
// @ui {"widget":"group_start", "label":"Rectangle Parameters", "showIf": "type", "showIfValue": 3}
// @input vec4 endAnchorsBounds = {-1, 1, -1, 1}   {"label": "Bounds",  "showIf": "anchorsParam", "showIfValue": 0}
// @input vec2 endAnchorsSize = {2, 2} {"label": "Size",  "showIf": "anchorsParam", "showIfValue": 1}
// @input vec2 endAnchorsCenter = {0, 0}  {"label": "Center",  "showIf": "anchorsParam", "showIfValue": 2}
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Rectangle Parameters", "showIf": "type", "showIfValue": 4}
// @input vec4 endOffsetsBounds = {-1, 1, -1, 1}  {"label": "Bounds",  "showIf": "offsetsParam", "showIfValue": 0}
// @input vec2 endOffsetsSize = {2, 2}  {"label": "Size",  "showIf": "offsetsParam", "showIfValue": 1}
// @input vec2 endOffsetsCenter = {0, 0}   {"label": "Center",  "showIf": "offsetsParam", "showIfValue": 2}
// @ui {"widget":"group_end"}
// @ui {"widget":"group_end"}

// @ui {"widget":"separator"}
// @input bool additive {"showIf":"movementType", "showIfValue": 3}
// @ui {"widget":"label", "label":"(Use on Loop)", "showIf": "movementType", "showIfValue": 3}
// @input float time = 1.0
// @input float delay = 0.0

// @ui {"widget":"separator"}
// @input string easingFunction = "Quadratic" {"widget":"combobox", "values":[{"label":"Linear", "value":"Linear"}, {"label":"Quadratic", "value":"Quadratic"}, {"label":"Cubic", "value":"Cubic"}, {"label":"Quartic", "value":"Quartic"}, {"label":"Quintic", "value":"Quintic"}, {"label":"Sinusoidal", "value":"Sinusoidal"}, {"label":"Exponential", "value":"Exponential"}, {"label":"Circular", "value":"Circular"}, {"label":"Elastic", "value":"Elastic"}, {"label":"Back", "value":"Back"}, {"label":"Bounce", "value":"Bounce"}]}
// @input string easingType = "Out" {"widget":"combobox", "values":[{"label":"In", "value":"In"}, {"label":"Out", "value":"Out"}, {"label":"In / Out", "value":"InOut"}]}

var propertyTypes = ["Position", "Scale", "Rotation", "Anchors", "Offsets"];
var PropertyType = {};
propertyTypes.forEach(function (d, i) {
    PropertyType[d] = i;
});

var RectPropTypes = ["Bounds", "Size", "Center"];

var vecProperties = ["x", "y", "z", "w"];

var movementProperties = ["startInput", "to", "from", "offset"];

var propertyTypeName = Object.keys(PropertyType)[script.type];

function setProperty(propName, inputName) {
    switch (script.type) {
        case PropertyType.Rotation:
            script[propName] = new vec3(script[inputName + propertyTypeName], 0, 0);
            break;
        case PropertyType.Anchors:
            script[propName] = script[inputName + propertyTypeName + RectPropTypes[script.anchorsParam]];
            break;
        case PropertyType.Offsets:
            script[propName] = script[inputName + propertyTypeName + RectPropTypes[script.offsetsParam]];
            break;
        default:
            script[propName] = script[inputName + propertyTypeName];
    }
}
setProperty(movementProperties[script.movementType], "start");
if (script.movementType == 0) {
    setProperty("endInput", "end");
}

// If no scene object is specified, use object the script is attached to
if (!script.sceneObjectReference) {
    script.sceneObjectReference = script.getSceneObject();
}

// Setup the external API
script.tweenObject = script.getSceneObject();
script.tweenType = "screen_transform";
script.type = script.type;
script.movementType = script.movementType;
script.time = script.time;
script.tweenName = script.tweenName;
script.startTween = startTween;
script.resetObject = resetObject;
script.tween = null;
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
script.setTime = setTime;
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

function setTime(time) {
    script.time = time;
}

// Update the tween to its start
function updateToStart() {
    updateValue(script.start);
}

// Update the tween to its end
function updateToEnd() {
    if (script.loopType == 3) {
        updateValue(script.start);
    } else {
        updateValue(script.end);
    }
}

// Play it automatically if specified
if (script.playAutomatically) {
    // Start the tween
    startTween();
}

// Create the tween and start it
function startTween() {
    if (!global.tweenManager) {
        print("Tween Screen Transform: Tween Manager not initialized. Try moving the TweenManager script to the top of the Objects Panel or changing the event on this TweenType to \"Lens Turned On\".");
        return;
    }
    script.tween = setupTween();

    if (script.tween) {
        // Start the tween
        script.tween.start();
    }
}

// Stops active tween
function stopTween() {
    if (script.tween) {
        script.tween.stop();
        script.tween = null;
    }
}

// Create the tween with passed in parameters
function setupTween() {
    var DEG_TO_RAD = 0.0174533;
    var tween = null;
    var screenTransform = script.sceneObjectReference.getComponent("Component.ScreenTransform");
    var screenTransformParams = null;

    if (screenTransform != null) {
        // Set the appropriate parameter based on movementType and tweenType selected
        switch (script.type) {
            case 0:
                screenTransformParams = screenTransform.position;
                break;
            case 1:
                screenTransformParams = screenTransform.scale;
                break;
            case 2:
                screenTransformParams = screenTransform.rotation.toEulerAngles().z;
                break;
            case 3:
                screenTransformParams = getRectParams(screenTransform.anchors, script.anchorsParam);
                break;
            case 4:
                screenTransformParams = getRectParams(screenTransform.offsets, script.offsetsParam);
                break;
        }

        if (!script.manualStart) {
            switch (script.movementType) {
                case 0:
                    script.start = script.type == PropertyType.Rotation ? script.startInput.x * DEG_TO_RAD : script.startInput;
                    break;
                case 1:
                    script.start = screenTransformParams;
                    break;
                case 2:
                    script.start = script.type == PropertyType.Rotation ? script.from.x * DEG_TO_RAD : script.from;
                    break;
                case 3:
                    script.start = screenTransformParams;
                    break;
            }
        }

        if (!script.manualEnd) {
            switch (script.movementType) {
                case 0:
                    script.end = script.type == PropertyType.Rotation ? script.endInput.x * DEG_TO_RAD : script.endInput;
                    break;
                case 1:
                    script.end = script.type == PropertyType.Rotation ? script.to.x * DEG_TO_RAD : script.to;
                    break;
                case 2:
                    script.end = screenTransformParams;
                    break;
                case 3:
                    script.end = script.type == PropertyType.Rotation ? screenTransformParams + script.offset.x * DEG_TO_RAD : script.start.add(script.offset);
                    break;
            }
        }
        var startValue;
        var endValue;
        if (script.type == PropertyType.Rotation) {
            startValue = { x: 0 };
        } else {
            startValue = createObjectFromVec(script.start);
        }

        if (script.type == PropertyType.Rotation) {
            endValue = { x: 1 };
        } else {
            endValue = createObjectFromVec(script.end);
        }

        resetObject();
        // Create the tween
        tween = new global.TWEEN.Tween(startValue)
            .to(endValue, script.time * 1000.0)
            .delay(script.delay * 1000.0)
            .easing(global.tweenManager.getTweenEasingType(script.easingFunction, script.easingType))
            .onUpdate(updateValue)
            .onComplete((script.movementType == 3 && script.additive && script.loopType == 1) ? startTween : null);
        if (tween) {
            // Configure the type of looping based on the inputted parameters
            if (script.movementType == 3 && script.additive && script.loopType == 1) {
                global.tweenManager.setTweenLoopType(tween, 0);
            } else {
                global.tweenManager.setTweenLoopType(tween, script.loopType);
            }
            // Save reference to tween
            script.tween = tween;
            return tween;
        }
    } else {
        print("Tween Screen Transform: There is no Screen Transform component found on " + script.sceneObjectReference.name + " SceneObject");
    }
}

// Create the tween with swapped start and end parameters
function setupTweenBackwards() {
    var tween = null;

    var startValue;
    var endValue;

    if (script.type == PropertyType.Rotation) {
        startValue = { x: (script.loopType == 3) ? 0 : 1 };
    } else {
        if (script.loopType == 3) {
            startValue = createObjectFromVec(script.start);
        } else {
            startValue = createObjectFromVec(script.end);
        }
    }
    if (script.type == PropertyType.Rotation) {
        startValue = { x: (script.loopType == 3) ? 1 : 0 };
    } else {
        if (script.loopType == 3) {
            startValue = createObjectFromVec(script.end);
        } else {
            startValue = createObjectFromVec(script.start);
        }
    }

    // Change easing type
    var easingType = global.tweenManager.getSwitchedEasingType(script.easingType);
    // Create the tween
    tween = new global.TWEEN.Tween(startValue)
        .to(endValue, script.time * 1000.0)
        .delay(script.delay * 1000.0)
        .easing(global.tweenManager.getTweenEasingType(script.easingFunction, easingType))
        .onUpdate(updateValue);
    if (tween) {
        // Configure the type of looping based on the inputted parameters
        global.tweenManager.setTweenLoopType(tween, script.loopType);
        return tween;
    }
}

// Resets the object to its start

function resetObject() {
    if (script.start == null) {
        setupTween();
    }
    var startValue = {};
    if (script.type == PropertyType.Rotation) {
        startValue = { x: 0 };
    } else {
        startValue = createObjectFromVec(script.start);
    }
    // Initialize to start value
    updateValue(startValue);
}

// Here's where the values returned by the tween are used
// to drive the Component.ScreenTransform of the SceneObject

function updateValue(value) {
    if (script.sceneObjectReference == null) {
        return;
    }

    var screenTransform = script.sceneObjectReference.getComponent("Component.ScreenTransform");

    if (screenTransform != null) {
        switch (script.type) {
            case PropertyType.Position: // Position
                screenTransform.position = new vec3(value.x, value.y, value.z);
                break;
            case PropertyType.Scale: // Scale
                screenTransform.scale = new vec3(value.x, value.y, value.z);
                break;
            case PropertyType.Rotation: // Rotation
                var newAngle = lerp(script.start, script.end, value.x);
                var newQuat = quat.angleAxis(newAngle, vec3.forward());
                newQuat.normalize();
                screenTransform.rotation = newQuat;
                break;
            case PropertyType.Anchors: // Anchors
                setRectParams(screenTransform.anchors, value, script.anchorsParam);
                break;
            case PropertyType.Offsets: // Offsets
                setRectParams(screenTransform.offsets, value, script.offsetsParam);
                break;
        }
    }
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

//  helper functions
function getRectParams(rect, type) {
    switch (type) {
        case 0:
            return new vec4(rect.left, rect.right, rect.bottom, rect.top);
        case 1:
            return rect.getSize();
        case 2:
            return rect.getCenter();
    }
}

function setRectParams(rect, value, type) {
    switch (type) {
        case 0:
            rect.left = value.x;
            rect.right = value.y;
            rect.bottom = value.z;
            rect.top = value.w;
            break;
        case 1:
            rect.setSize(new vec2(value.x, value.y));
            break;
        case 2:
            rect.setCenter(new vec2(value.x, value.y));
            break;
    }
}

function createObjectFromVec(vec) {
    var value = {};
    for (var i = 0; i < vecProperties.length; i++) {
        if (vec[vecProperties[i]] != undefined) {
            value[vecProperties[i]] = vec[vecProperties[i]];
        }
    }
    return value;
}
