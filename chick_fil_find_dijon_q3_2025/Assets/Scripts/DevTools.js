////////////////
// Remap
////////////////
global.remap = function (value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
};

////////////////
// Delay 'time' and invoke callback
////////////////
global.delay = function (time, callback) {
    if (callback != null) {
        var delayedEvent = script.createEvent("DelayedCallbackEvent");
        delayedEvent.bind(callback);
        delayedEvent.reset(time);
    } else
        print("ERROR: callback is NULL!");
}

////////////////
// Delay 'time' and run SINGLE tween
////////////////
global.runDelayedTween = function (time, obj, tweenName) {
    if (obj != null) {
        var delayedEvent = script.createEvent("DelayedCallbackEvent");
        delayedEvent.bind(function () {
            tweenManager.startTween(obj, tweenName);
        });
        delayedEvent.reset(time);
    }
    else
        print("ERROR: sceneObj is NULL!");
}

////////////////
// Delay 'time' and run MULTIPLE tweens
// tweenNames - array of tween names
////////////////
global.runDelayedTweens = function (time, obj, tweenNames) {
    if (obj != null) {
        var delayedEvent = script.createEvent("DelayedCallbackEvent");
        delayedEvent.bind(function () {
            global.startTweens(obj, tweenNames);
        });
        delayedEvent.reset(time);
    }
    else
        print("ERROR: sceneObj is NULL!");
}

////////////////
// Return increased index of array in loop 
////////////////
global.updateIndexInList = function (index, length, isNext) {
    if (isNext === true)
        index = index + 1 < length ? index + 1 : 0;
    else
        index = index - 1 >= 0 ? index - 1 : length - 1;

    return index;
}

////////////////
// Shuffle array and return it
////////////////
global.shuffle = function (a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

////////////////
// Sort array by bubble algorithm
////////////////
global.bubbleSort = function (arr) {
    //Outer pass
    for (var i = 0; i < arr.length; i++) {
        //Inner pass
        for (var j = 0; j < arr.length - i - 1; j++) {
            //Value comparison using ascending order
            if (arr[j + 1] < arr[j]) {
                //Swapping
                [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]]
            }
        }
    }
    return arr;
};

////////////////
// TWEENS - stop all tweens 
// obj - tween object
// tweenNames - array of names
////////////////
global.stopTweens = function (obj, tweenNames) {
    tweenNames.forEach(function (name) {
        global.tweenManager.stopTween(obj, name);
    });
}

////////////////
// TWEENS - start all tweens 
// obj - tween object
// tweenNames - array of names
////////////////
global.startTweens = function (obj, tweenNames) {
    tweenNames.forEach(function (name) {
        global.tweenManager.startTween(obj, name);
    });
}

////////////////
// Return random int value
////////////////
global.getRandomInt = function (max) {
    return Math.floor(Math.random() * max);
}

////////////////
// Return random int value from min to max
// min INCLUDE
// max EXCLUDE
////////////////
global.getRandomIntEx = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

////////////////
// Return random int value from min to max
// min INCLUDE
// max INCLUDE
////////////////
global.getRandomIntInc = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

////////////////
// Return random float value from min to max
// min INCLUDE
// max EXCLUDE
////////////////
global.getRandomFloat = function (min, max) {
    return Math.random() * (max - min) + min;
}

////////////////
// Convert degree to radian
////////////////
global.convertDegreeToRadian = function (degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

////////////////
// Convert radian to degree
////////////////
global.convertRadianToDegree = function (radians) {
    var pi = Math.PI;
    return radians * (180 / pi);
}

/////////////////
// Return value by linear interpolation
////////////////
global.lerp = function (start, end, t) {
    return start * (1 - t) + end * t;
}

global.lerpVec2 = function (startV2, endV2, t) {
    return new vec2(lerp(startV2.x, endV2.x, t), lerp(startV2.y, endV2.y, t));
}

global.lerpVec3 = function (startV3, endV3, t) {
    return new vec3(lerp(startV3.x, endV3.x, t), lerp(startV3.y, endV3.y, t), lerp(startV3.z, endV3.z, t));
}

/////////////////
//If value < min, it will return the minimum allowed number
//If value > max, it will return the maximum allowed number
//If value > min and value < max, it will return the passed number
////////////////
global.clamp = function (num, min, max) {
    return Math.min(Math.max(num, min), max);
}

/////////////////
// Return user name
////////////////
var userName = "";
global.userContextSystem.requestDisplayName(function (displayName) {
    userName = displayName;
});
global.getUserName = function () {
    return userName;
}

////////////////
// Change layer for object
////////////////
global.setObjectLayer = function (object, layer) {
    object.setRenderLayer(layer);
}

////////////////
// Haptic
////////////////
global.playHaptic = function () {
    global.hapticFeedbackSystem.hapticFeedback(global.HapticFeedbackType.Vibration);
}