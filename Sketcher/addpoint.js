function modeAddPoint(){
	mode = "modeAddPoint";
	showButtons();
}

function addPoint(e){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	var cp;
	var elem = identifyElement(e);
	if(elem.type == "edge"){
		var ep = posLabel("edge",elem.label);
		var p1 = pointList[posLabel("point",edgeList[ep].point1)];
		var p2 = pointList[posLabel("point",edgeList[ep].point2)];
		var mid = {x:0.5*(p1.x+p2.x),y:0.5*(p1.y+p2.y)};
		pointList[pointList.length] = new Point(mid.x,mid.y);
		pointList[pointList.length-1].label = labelpoint;
		// changement des labels des points des contraintes
		pointList[pointList.length-1].constraints = p2.constraints;
		for(var i=0;i<p2.constraints.length;i++){
			cp = posLabelCtr(p2.constraints[i]);
			 
			if(constraintList[cp].type == "horivert"){
				bool1 = constraintList[cp].point1 == edgeList[ep].point2;
				bool2 = constraintList[cp].point2 == edgeList[ep].point1;
				bool3 = constraintList[cp].point1 == edgeList[ep].point1;
				bool4 = constraintList[cp].point2 == edgeList[ep].point2;
				if((bool1 && bool2) ||(bool3 && bool4)){
					constraintList[cp].point2 = labelpoint;
				}
			}
		}
		pointList[posLabel("point",edgeList[ep].point2)].constraints = [];
		// changement des labels pour les 2 nouveaux edges
		edgeList[edgeList.length] = new Edge(labelpoint,edgeList[ep].point2);
		edgeList[edgeList.length-1].label = labeledge;
		edgeList[ep].point2 = labelpoint;
		labeledge += 1;
		labelpoint += 1;
	} else {
		pointList[pointList.length] = new Point(posx,posy);
		pointList[pointList.length-1].label = labelpoint;
		labelpoint += 1;
	}
}

function modeCoincidence(){
	mode = "modeCoincidence";
	showButtons();
}

function coincidencePoints(e){
	var ep;
	var elem = identifyElement(event);
	if(elem.type == "point"){
		pointmerge.push(elem.label);
		var n = posLabel("point",elem.label);
		pointList[n].selected = true;
	}
	if(pointmerge.length == 2){
		constraintList[constraintList.length] = new Coincidence(pointmerge[0],pointmerge[1]);
		updateSketch();
		n = posLabel("point",pointmerge[0]);
		pointList[n].selected = false;
		n = posLabel("point",pointmerge[1]);
		pointList[n].selected = false;
		pointmerge = [];
	}
}