function modeLength(){
	mode = "modeLength";
	showButtons();
}

function seizeLength(e){
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
		n = posLabel("edge",equiL[0].label);
		var length_str = prompt("Length of the edge:", "");
		var lengthEdge = parseFloat(length_str);
		if (isNaN(lengthEdge) || lengthEdge <= 0){
			alert("Come on... Try again.");
		} else {
			// on cherche d'abord si une longueur n'a pas déjà été affectée à cet Edge
			for(var k=0;k<edgeList[n].constraints.length;k++){
				var ind = edgeList[n].constraints[k];
				if(constraintList[ind].type == "distance"){
					constraintList[ind].distance = lengthEdge;
					kk = 1;
				} 
			}
			// Sinon, on attribue une nouvelle contrainte "distance" à cet Edge
			if(kk == 0){
				constraintList[constraintList.length] = new Distance(edgeList[n].point1,edgeList[n].point2,lengthEdge); // création nouvelle contrainte
				constraintList[constraintList.length-1].label = labelconstraint;
				edgeList[n].constraints.push(labelconstraint); // ajout de la contrainte dans les paramètres de l'edge
				pointList[posLabel("point",edgeList[n].point1)].constraints.push(labelconstraint);
				pointList[posLabel("point",edgeList[n].point2)].constraints.push(labelconstraint);
				labelconstraint += 1;
			}
			updateSketch(); // mise à jour de la section
		}
		edgeList[posLabel("edge",equiL[0].label)].selected = false;
		equiL = [];
	} else if(comptpoint == 2){
		n0 = posLabel("point",equiL[0].label);
		n1 = posLabel("point",equiL[1].label);
		var length_str = prompt("Distance between 2 points:", "");
		var lengthEdge = parseFloat(length_str);
		if (isNaN(lengthEdge) || lengthEdge <= 0){
			alert("Come on... Try again.");
		} else {
			// on cherche d'abord si une longueur n'a pas déjà été affectée entre ces 2 points
			for(var k=0;k<pointList[n].constraints.length;k++){
				var ind = pointList[n].constraints[k];
				if(constraintList[ind].type == "distance"){
					var test1 = (constraintList[ind].point1 ==equiL[0].label && constraintList[ind].point2 ==equiL[1].label );
					var test2 = (constraintList[ind].point2 ==equiL[0].label && constraintList[ind].point1 ==equiL[1].label );
					if(test1 || test2 ){
						constraintList[ind].distance = lengthEdge;
						kk = 1;
					}
				}
			}
			// Sinon, on attribue une nouvelle contrainte "distance" entre ces 2 points
			if(kk == 0){
				constraintList[constraintList.length] = new Distance(equiL[0].label,equiL[1].label,lengthEdge); // création nouvelle contrainte
				constraintList[constraintList.length-1].label = labelconstraint;
				pointList[posLabel("point",equiL[0].label)].constraints.push(labelconstraint);
				pointList[posLabel("point",equiL[1].label)].constraints.push(labelconstraint);
				labelconstraint += 1;
			}
			updateSketch(); // mise à jour de la section
		}
		pointList[posLabel("point",equiL[0].label)].selected = false;
		pointList[posLabel("point",equiL[1].label)].selected = false;
		equiL = [];
	} /*else if(comptpoint == 1 && comptedge == 1){
		if(equiL[0].type == "edge"){
			var pp = posLabel("point",equiL[1].label);
			var ep = posLabel("edge",equiL[0].label);
		} else {
			var pp = posLabel("point",equiL[0].label);
			var ep = posLabel("edge",equiL[1].label);
		}
		var length_str = prompt("Distance between point and edge:", "");
		var lengthEdge = parseFloat(length_str);
		if (isNaN(lengthEdge) || lengthEdge <= 0){
			alert("Come on... Try again.");
		} else {
			// on cherche d'abord si une longueur n'a pas déjà été affectée entre ces 2 points
			for(var k=0;k<pointList[n].constraints.length;k++){
				var ind = pointList[n].constraints[k];
				if(constraintList[ind].type == "distance"){
					var test1 = (constraintList[ind].point1 ==equiL[0].label && constraintList[ind].point2 ==equiL[1].label &&);
					var test2 = (constraintList[ind].point2 ==equiL[0].label && constraintList[ind].point1 ==equiL[1].label &&);
					if(test1 || test2 ){
						constraintList[ind].distance = lengthEdge;
						kk = 1;
					}
				}
			}
			// Sinon, on attribue une nouvelle contrainte "distance" entre ces 2 points
			if(kk == 0){
				constraintList[constraintList.length] = new Distance(equiL[0].label,equiL[1].label,lengthEdge); // création nouvelle contrainte
				constraintList[constraintList.length-1].label = labelconstraint;
				pointList[posLabel("point",equiL[0].label)].constraints.push(labelconstraint);
				pointList[posLabel("point",equiL[1].label)].constraints.push(labelconstraint);
				labelconstraint += 1;
			}
			updateSketch(); // mise à jour de la section
		}
	}*/
}

function yieldLength(i,j){
	alert("Length of the edge number "+ j +" of shape "+ i +":\n"+shapes[j].edgeList[i].geolength);
}
