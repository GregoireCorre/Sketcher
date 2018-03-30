function modeTangent(){
	mode = "modeTangent";
}

function seizeParamTangent(e){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	
	var j = 0, i = 0;
	var elem = identifyElement(event);
	if(elem.type == "edge"){
		tangentparam[0] == elem.label;
		var n = posLabel("edge",elem.label);
		edgeList[n].selected = true;
	} else if (elem.type == "arc"){
		tangentparam[1] == elem.label;
		var n = posLabel("arc",elem.label);
		arcList[n].selected = true;
	}
	if(tangentparam.length == 2){
		constraint
	}
}
