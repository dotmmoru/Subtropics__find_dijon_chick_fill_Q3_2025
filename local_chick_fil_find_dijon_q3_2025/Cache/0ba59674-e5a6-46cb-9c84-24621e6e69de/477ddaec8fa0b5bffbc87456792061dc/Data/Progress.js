

var thisObj = script.getSceneObject();
var thisImg = thisObj.getComponent("Component.Image");

var id = -1;


/////////////////////   FUNC   //////////////////////////
function Start() {
    Reset();
}

function Reset() {

}
/////////////////////   API   //////////////////////////
script.api.Init = function (_id) {
    id = _id;
    script.api.UpdateTexture(global.progressDigitTex[id]);
}

script.api.UpdateTexture = function (tex) {
    thisImg.mainPass.baseTex = tex;
}

/////////////////////   EVENTS   //////////////////////////

/////////////////////   RUN   //////////////////////////
