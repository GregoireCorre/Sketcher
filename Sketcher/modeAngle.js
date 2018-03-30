function modeAngleChoice(){
	if(anglebutton == "off"){
		// Création de deux nouveax boutons
		modepoints = document.createElement("BUTTON");
		modeedges = document.createElement("BUTTON");
		modepoints.setAttribute("id","buttonpoints");
		modeedges.setAttribute("id","buttonedges");
		modepoints.innerHTML = '<img src="anglepoints.png" width="60px" height="60px" />';
		modeedges.innerHTML = '<img src="angleedges.png" width="60px" height="60px"/>';
		modepoints.setAttribute("style","position: absolute; top:390px;left:1140px");
		modeedges.setAttribute("style","position: absolute; top:390px;left:1075px");
		document.body.appendChild(modepoints);
		document.body.appendChild(modeedges);
		// Création des nouvelles actions associées aux nouveaux boutons
		addListener(document.getElementById("buttonpoints"),"click",modeAnglePoints);
		addListener(document.getElementById("buttonedges"),"click",modeAngleEdges);
		anglebutton = "on";
	} else {
		modepoints.parentNode.removeChild(modepoints);
		modeedges.parentNode.removeChild(modeedges);
		anglebutton = "off";
	}
}

function modeAnglePoints(){
	mode = "modeAnglePoints";
	showButtons();
	modepoints.parentNode.removeChild(modepoints);
	modeedges.parentNode.removeChild(modeedges);
	anglebutton = "off";
}

function modeAngleEdges(){
	mode = "modeAngleEdges";
	showButtons();
	modepoints.parentNode.removeChild(modepoints);
	modeedges.parentNode.removeChild(modeedges);
	anglebutton = "off";
}

function seizePointAngle1(e){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	var dist;
	
	var i = 0;
	while (i<pointList.length){
		dist = Math.sqrt( ( posx - pointList[i].x )**2 + ( posy - pointList[i].y )**2 );
		if( dist < radius ) {
			//alert("Point 1 selected");
			pointangle[0] = pointList[i].label;
			pointList[i].selected = true;
			i = pointList.length + 1;
		} else {
			i++;
		}
	}
}

function seizePointAngle2(e){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	var dist;
	
	var j = 0, i = 0;
	while (i<pointList.length){
		dist = Math.sqrt( ( posx - pointList[i].x )**2 + ( posy - pointList[i].y )**2 );
		if( dist < radius ) {
			//alert("Point 2 selected");
			pointangle[1] = pointList[i].label;
			pointList[i].selected = true;
			i = pointList.length + 1;
		} else {
			i++;
		}
	}
}

function seizePointAngle3(e){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	var dist;
	
	var i = 0;
	while (i<pointList.length){
		dist = Math.sqrt( ( posx - pointList[i].x )**2 + ( posy - pointList[i].y )**2 );
		if( dist < radius ) {
			//alert("Point 3 selected");
			pointangle[2] = pointList[i].label;
			i = pointList.length + 1;
			defineAngle(pointangle[0],pointangle[1],pointangle[2]);
		} else {
			i++;
		}
	}
	if (showDim == "on"){
		showDim = "off";
	} else if (showDim == "off"){
		showDim = "on";
	}
	showDimensions();
	pointangle = [];
}

function seizeEdgeAngle1(e){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	
	var j = 0, i = 0;
	while (i<edgeList.length){
		if (closeToEdge(posx,posy,i,j)){
			edgeangle[0] = edgeList[i].label;
			edgeList[i].selected = true;
			i = edgeList.length + 1;
		} else {
			i++;
		}
	}
		
}

function seizeEdgeAngle2(e){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	
	var j = 0, i = 0;
	while (i<edgeList.length){
		if (closeToEdge(posx,posy,i,j)){
			edgeangle[1] = edgeList[i].label;
			// identification du noeud commun
			var n1 = posLabel("edge",edgeangle[0]);
			if (edgeList[n1].point1 == edgeList[i].point2){
					pt1 = edgeList[i].point1;
					pt2 = edgeList[i].point2;
					pt3 = edgeList[n1].point2;
			} else if (edgeList[n1].point2 == edgeList[i].point1){
					pt1 = edgeList[n1].point1;
					pt2 = edgeList[n1].point2;
					pt3 = edgeList[i].point2;
			} else if (edgeList[n1].point1 == edgeList[i].point1){
					pt1 = edgeList[n1].point2;
					pt2 = edgeList[n1].point1;
					pt3 = edgeList[i].point2;
			} else if (edgeList[n1].point2 == edgeList[i].point2){
					pt1 = edgeList[n1].point1;
					pt2 = edgeList[n1].point2;
					pt3 = edgeList[i].point1;
			}
			edgeList[i].selected = true;
			//edgeList[i].drawEdge();
			defineAngle(pt1,pt2,pt3);
			edgeList[n1].selected = false;
			edgeList[i].selected = false;
			i = edgeList.length + 1;
		} else {
			i++;
		}
	}
	edgeangle = [];
}

function defineAngle(pt1,pt2,pt3){
	var pt01,pt02,p0,p1,p2;
	var error = 0;
	
	var angle_str = prompt("Enter the angle value in degrees:","");
	var angle = parseFloat(angle_str);
	if(isNaN(angle)){
		alert("Sorry but that's not an acceptable value !");
		error = 1;
	} else {
		if ( error == 0){
			// nouvelle contrainte
			constraintList[constraintList.length] = new Angle(pt1,pt2,pt3,angle);
			constraintList[constraintList.length-1].label = labelconstraint;
			labelconstraint += 1;
			edgeangle[0] = edgeFromPoints(pt1,pt2);
			edgeangle[1] = edgeFromPoints(pt2,pt3);
			// ajout des contraintes dans les paramètres des edges concernés
			if(edgeangle[0] != -1){
				var e0 = posLabel("edge",edgeangle[0]);
				edgeList[e0].constraints.push(labelconstraint - 1);
			};
			if(edgeangle[1] != -1){
				var e1 = posLabel("edge",edgeangle[1]);
				edgeList[e1].constraints.push(labelconstraint - 1);
			}
			// création nouvelle dimension
			dimensionList[dimensionList.length] = new DimAngle(edgeangle[0],edgeangle[1],angle);
			
			updateSketch();
		}
	}
}

function modeGradient(){
	mode = "modeGradient";
	showButtons();
}

function gradient(e){
	var elem = identifyElement(e);
	var n, nn, m;
	var i;
	var grad, grad_str;
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
		grad_str = prompt("Enter the gradient value: ","");
		grad = parseFloat(grad_str);
		if(isNaN(grad)){
			alert("Sorry, this is not an acceptable value.")
		} else {
			// on cherche si une première pente n'a pas déjà été définie
			n = posLabel("edge",equiL[0].label);
			i = 0;
			while(i<edgeList[n].constraints.length){
				nn = edgeList[n].constraints[i];
				m = posLabelCtr(nn);
				if(constraintList[m].type == "gradient"){
					constraintList[m].gradient = grad;
					i = edgeList[n].constraints.length+1;
				} else {
					i++
				}
			};
			if( i == edgeList[n].constraints.length){
				constraintList[constraintList.length] = new Gradient(edgeList[n].point1,edgeList[n].point2,grad);
				constraintList[constraintList.length-1].label = labelconstraint;
				edgeList[n].constraints.push(labelconstraint);
				pointList[posLabel("point",edgeList[n].point1)].constraints.push(labelconstraint);
				pointList[posLabel("point",edgeList[n].point2)].constraints.push(labelconstraint);
				labelconstraint += 1;
			}
			updateSketch();
		}
		edgeList[posLabel("edge",equiL[0].label)].selected = false;
		equiL = [];
	}
}


function findAngle(p0,p1,p2) {
  var a = (p1.x-p0.x)**2 + (p1.y-p0.y)**2,
      b = (p1.x-p2.x)**2 + (p1.y-p2.y)**2,
      c = (p2.x-p0.x)**2 + (p2.y-p0.y)**2;
  return Math.acos( (a+b-c) / Math.sqrt(4*a*b) );
}
