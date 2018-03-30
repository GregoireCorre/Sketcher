function identifyElement(e){
	var dist;
	var pos = getMousePos(canvas,e);
	var posx = pos.x;
	var posy = pos.y;
	var i = 0;
	while(i<pointList.length){
		var posxx = pointList[i].x;
		var posyy = pointList[i].y;
		dist = Math.sqrt( ( posx - posxx )**2 + ( posy - posyy )**2 );
		if( dist < radius ) {
			return element = new Element("point",pointList[i].label);
			i = pointList.length + 1
		} else {
			i++;
		}
	}
	if(i != pointList.length + 1){
		i = 0;
		while (i<edgeList.length){
			if (closeToEdge(posx,posy,i)){
				return element = new Element("edge",edgeList[i].label);
				i = edgeList.length + 1
			} else {
				i++;
			}
		}
	}
	if(i != edgeList.length + 1){
		i = 0;
		while (i<arcList.length){
			if (closeToArc(posx,posy,i)){
				return element = new Element("arc",arcList[i].label);
				i = arcList.length + 1
			} else {
				i++;
			}
		}
	}
}

function lightSelection(){
	var n;
	for(var i=0;i<selection.length;i++){
		if(selection[i].type == "point"){
			var ii = selection[i].label;
			n = posLabel("point",ii);
			pointList[n].selected = true;
			pointList[n].light = true;
			pointList[n].drawPoint();
		} else if (selection[i].type == "edge"){
			var ii = selection[i].label;
			n = posLabel("edge",ii);
			edgeList[n].selected = true;
			edgeList[n].light = true;
			edgeList[n].drawEdge();
		} else if (selection[i].type == "arc"){
			var ii = selection[i].label;
			n = posLabel("arc",ii);
			arcList[n].selected = true;
			arcList[n].light = true;
			arcList[n].drawArc();
		}
	}
}

function unSelection(){
	for(var i=0;i<selection.length;i++){
		if (selection[i].type == "point"){
			n = posLabel("point",selection[i].label);
			pointList[n].selected = false;
		} else if (selection[i].type == "edge"){
			n = posLabel("edge",selection[i].label);
			edgeList[n].selected = false;
		} else if (selection[i].type == "arc"){
			n = posLabel("arc",selection[i].label);
			arcList[n].selected = false;
		}
		
	}
	selection = [];
}

function deleteSelection(){
	var listDel = [];
	for(var i=0;i<selection.length;i++){
		var jj = selection[i].label;
		if(selection[i].type == "edge"){ // suppression d'un edge
			n = posLabel("edge",jj);
			removeCtrElem("edge",jj);
			edgeList.splice(n,1);
		} else if (selection[i].type == "point"){ // suppression d'un point, des edges et arcs associés
			n = posLabel("point",jj);
			//removeCtrElem("point",jj);
			pointList.splice(n,1);
			for(var j=0;j<edgeList.length;j++){
				if(edgeList[j].point1 == jj || edgeList[j].point2 == jj){
					listDel[listDel.length] = edgeList[j].label;
				}
			}
			for(j=0;j<listDel.length;j++){
				removeCtrElem("edge",listDel[j]);
				removeElem("edge",listDel[j]);
			}
			listDel = [];
			for(var j=0;j<arcList.length;j++){
				if(arcList[j].point1 == selection[i].label || arcList[j].point2 == selection[i].label){
					listDel[listDel.length] = arcList[j].label;
				}
			}
			for(j=0;j<listDel.length;j++){
				removeCtrElem("arc",listDel[j]);
				removeElem("arc",listDel[j]);
			}
			listDel = [];
		} else if (selection[i].type == "arc"){ // suppression d'un arc
			n = posLabel("arc",jj);
			removeCtrElem("arc",jj);
			arcList.splice(n,1);
		}
	}
	selection = [];
	clearCanvas();
}

function pointIndex(jj,pt){
	var index;
	for(var i = 0;i<geoWorld[jj].pointList.length;i++){
		if(geoWorld[jj].pointList[i] == pt){
			index = i;
		}
	}
	return index;
}

function posLabel(type,lab){
	var n = - 1;
	var i = 0;
	if(type == "point"){
		while(i<pointList.length){
			if(pointList[i].label == lab){
				n = i;
				i = pointList.length;
			} else {
				i++;
			}
		}
	} else if(type == "edge"){
		while(i<edgeList.length){
			if(edgeList[i].label == lab){
				n = i;
				i = edgeList.length;
			} else {
				i++;
			}
		}
	} else if(type == "arc"){
		while(i<arcList.length){
			if(arcList[i].label == lab){
				n = i;
				i = arcList.length;
			} else {
				i++;
			}
		}
	}
	if (n == - 1){
		console.log("no position found corresponding to this label")
	}
	return n;
}

//------------------------------------------------------------//
// removeElem retire l'élément de label lab et de type type   //
// de sa liste respective.                                    //
//------------------------------------------------------------//
function removeElem(type,lab){
	var i = 0;
	if(type == "point"){
		while(i<point.length){
			if(pointList[i].label == lab){
				pointList.splice(i,1);
				i = pointList.length;
			} else {
				i++;
			}
		}
	}
	if(type == "edge"){
		while(i<edgeList.length){
			if(edgeList[i].label == lab){
				edgeList.splice(i,1);
				i = edgeList.length;
			} else {
				i++;
			}
		}
	}
	if(type == "arc"){
		while(i<arcList.length){
			if(arcList[i].label == lab){
				arcList.splice(i,1);
				i = arcList.length;
			} else {
				i++;
			}
		}
	}
}

//--------------------------------------------------------------//
// removeCtrElem retire la contraintes de label lab             //
//--------------------------------------------------------------//
function removeCtr(lab){
	var i=0;
	while(i<constraintList.length){
		if(constraintList[i].label == lab){
			constraintList.splice(i,1);
			i = constraintList.length + 1;
		} else {
			i++;
		}
	}
}

//--------------------------------------------------------------//
// removeCtrElem retire les contraintes de l'élément ayant le   //
// label lab et le type type.                                   //
//--------------------------------------------------------------//
function removeCtrElem(type,lab){
	var e0,cl0,c0;
	if(type == "edge"){
		e0 = posLabel("edge",lab);
		for(var j = 0;j<edgeList[e0].constraints.length;j++){
			cl0 = edgeList[e0].constraints[j];
			c0 = posLabelCtr(cl0);
			constraintList.splice(c0,1);
		}
	} else if (type == "arc"){
		e0 = posLabel("arc",lab);
		for(var j = 0;j<arcList[e0].constraints.length;j++){
			cl0 = arcList[e0].constraints[j];
			c0 = posLabelCtr(cl0);
			constraintList.splice(c0,1);
		}
	} else if (type == "point"){
		e0 = posLabel("point",lab);
		for(var j = 0;j<pointList[e0].constraints.length;j++){
			cl0 = pointList[e0].constraints[j];
			c0 = posLabelCtr(cl0);
			constraintList.splice(c0,1);
		}
	}
}
