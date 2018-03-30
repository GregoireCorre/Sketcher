function modeEquiLength(){
	mode = "modeEquiLength"
	showButtons();
}

function equiLength(e){
	var elem = identifyElement(e);
	var n;
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
	if(comptedge == 2){
		n = [posLabel("edge",equiL[0].label),posLabel("edge",equiL[1].label)];
		var p1 = edgeList[n[0]].point1;
		var p2 = edgeList[n[0]].point2;
		var p3 = edgeList[n[1]].point1;
		var p4 = edgeList[n[1]].point2;
		// création de la nouvelle contrainte
		constraintList[constraintList.length] = new EquiLength(p1,p2,p3,p4);
		constraintList[constraintList.length-1].label = labelconstraint;
		// ajout de la contrainte dans les paramètres des Edges
		edgeList[n[0]].constraints.push(labelconstraint);
		edgeList[n[1]].constraints.push(labelconstraint); 
		// ajout de la contrainte dans les paramètres des Points
		pointList[posLabel("point",p1)].constraints.push(labelconstraint);
		pointList[posLabel("point",p2)].constraints.push(labelconstraint);
		pointList[posLabel("point",p3)].constraints.push(labelconstraint);
		pointList[posLabel("point",p4)].constraints.push(labelconstraint);
		labelconstraint += 1;
		edgeList[n[0]].selected = false;
		edgeList[n[1]].selected = false;
		// mise à jour de la section
		updateSketch() 
		i = edgeList.length + 1
		equiL = [];
	} else if(comptedge == 1 && comptpoint == 2){
		var pl = [];
		for(var i =0;i<equiL.length;i++){
			if(equiL[i].type == "edge"){
				n = posLabel("edge",equiL[i].label);
			} else if(equiL[i].type == "point"){
				pl.push(equiL[i].label);
			}
		}
		var p1 = edgeList[n].point1;
		var p2 = edgeList[n].point2;
		// création de la nouvelle contrainte
		constraintList[constraintList.length] = new EquiLength(p1,p2,pl[0],pl[1]);
		constraintList[constraintList.length-1].label = labelconstraint;
		// ajout de la contrainte dans les paramètres des Edges
		edgeList[n].constraints.push(labelconstraint);
		// ajout de la contrainte dans les paramètres des Points
		pointList[posLabel("point",p1)].constraints.push(labelconstraint);
		pointList[posLabel("point",p2)].constraints.push(labelconstraint);
		pointList[posLabel("point",pl[0])].constraints.push(labelconstraint);
		pointList[posLabel("point",pl[1])].constraints.push(labelconstraint);
		labelconstraint += 1;
		edgeList[n].selected = false;
		pointList[posLabel("point",pl[0])].selected = false;
		pointList[posLabel("point",pl[1])].selected = false;
		// mise à jour de la section
		updateSketch() 
		i = edgeList.length + 1
		equiL = [];
	} else if(comptpoint == 4){
		var pl = [];
		for(var i =0;i<equiL.length;i++){
			if(equiL[i].type == "point"){
				pl.push(equiL[i].label);
			}
		}
		// création de la nouvelle contrainte
		constraintList[constraintList.length] = new EquiLength(pl[0],pl[1],pl[2],pl[3]);
		constraintList[constraintList.length-1].label = labelconstraint;
		// ajout de la contrainte dans les paramètres des Points
		pointList[posLabel("point",pl[0])].constraints.push(labelconstraint);
		pointList[posLabel("point",pl[1])].constraints.push(labelconstraint);
		pointList[posLabel("point",pl[2])].constraints.push(labelconstraint);
		pointList[posLabel("point",pl[3])].constraints.push(labelconstraint);
		labelconstraint += 1;
		pointList[posLabel("point",pl[0])].selected = false;
		pointList[posLabel("point",pl[1])].selected = false;
		pointList[posLabel("point",pl[2])].selected = false;
		pointList[posLabel("point",pl[3])].selected = false;
		// mise à jour de la section
		updateSketch() 
		i = edgeList.length + 1
		equiL = [];
	}
}