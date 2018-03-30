function modeMeasure(){
	mode = "modeMeasure";
	showButtons();
}

function measure(e){
	var elem = identifyElement(e);
	var n;
	var kk = 0;
	if(elem != undefined){
		equiL.push(elem);
	}
	// décompte des éléments dans equiL
	var comptedge = 0;
	var comptpoint = 0;
	for(var i = 0;i<equiL.length;i++){
		if(equiL[i].type == "edge"){
			comptedge += 1;
			n = posLabel("edge",equiL[i].label);
			edgeList[n].selected = true;
		} else if (equiL[i].type == "point"){
			comptpoint += 1;
			n = posLabel("point",equiL[i].label);
			pointList[n].selected = true;
		}
	}
	if(comptedge == 1){
		alert("Length of E"+equiL[0].label+": "+edgeList[posLabel("edge",equiL[0].label)].geolength);
		edgeList[posLabel("edge",equiL[0].label)].selected = false;
		equiL = [];
	}
	if(comptpoint == 2){
		var x1 = pointList[posLabel("point",equiL[0].label)].x;
		var x2 = pointList[posLabel("point",equiL[1].label)].x;
		var y1 = pointList[posLabel("point",equiL[0].label)].y;
		var y2 = pointList[posLabel("point",equiL[1].label)].y;
		var dist = Math.sqrt((x2-x1)**2+(y2-y1)**2);
		alert("Distance between P"+equiL[0].label+" and P"+equiL[1].label+": "+dist);
		pointList[posLabel("point",equiL[0].label)].selected = false;
		pointList[posLabel("point",equiL[1].label)].selected = false;
		equiL = [];
	}
	
}