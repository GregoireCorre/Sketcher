

function movedown(e){
	var elem0 = identifyElement(e);
	if(elem0 != undefined){
		selection[0] = elem0;
		flag = 1;
		posbuff = getMousePos(canvas, e);
	};
}

function move(e){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	var i=0;
	var k = 0;
	
	if(selection[0].type == "point"){
		//constructLine(e); //  ralentit beaucoup le calcul
		horiVertLine(e);
		var newpos = magnetPositions(posx,posy);
		posx = newpos[0];
		posy = newpos[1];
		while(i<constraintList.length){
			if(constraintList[i].type == "position"){
				if(constraintList[i].point1 == selection[0].label){
					constraintList[i].posx = posx;
					constraintList[i].posy = posy;
					i = constraintList.length + 1;
				} else {
					i++;
				}
			} else {
				i++;
			}
		};
		if(i == constraintList.length){
			constraintList[constraintList.length] = new Position(selection[0].label,posx,posy);
		}
	} else if (selection[0].type == "edge"){
		var ep = posLabel("edge",selection[0].label);
		var pl1 = edgeList[ep].point1;
		var pl2 = edgeList[ep].point2;
		for(i=0;i<constraintList.length;i++){
			if(constraintList[i].type == "position"){
				if(constraintList[i].point1 == pl1 || constraintList[i].point1 == pl2){
					constraintList[i].posx = constraintList[i].posx + posx - posbuff.x;
					constraintList[i].posy = constraintList[i].posy + posy - posbuff.y;
					k = 1;
				}
			} 
		};
		if(k == 0){
			var pp1 = posLabel("point",pl1);
			var pp2 = posLabel("point",pl2);
			posx1 = pointList[pp1].x + posx - posbuff.x;
			posy1 = pointList[pp1].y + posy - posbuff.y;
			posx2 = pointList[pp2].x + posx - posbuff.x;
			posy2 = pointList[pp2].y + posy - posbuff.y;
			constraintList[constraintList.length] = new Position(pl1,posx1,posy1);
			constraintList[constraintList.length] = new Position(pl2,posx2,posy2);
		}
		posbuff = pos;
	}
	
	updateSketch();
};

function moveUp(e){
	var i = 0;
	if(selection[0].type == "point"){
		while(i<constraintList.length){
			if(constraintList[i].type == "position"){
				if(constraintList[i].point1 == selection[0].label){
					constraintList.splice(i,1);
					i = constraintList.length + 1;
				} else {
					i++;
				}
			} else {
				i++;
			}
		};
	} else if (selection[0].type == "edge"){
		var ep = posLabel("edge",selection[0].label);
		var pl1 = edgeList[ep].point1;
		var pl2 = edgeList[ep].point2;
		var clab = [];
		for(i=0;i<constraintList.length;i++){
			if(constraintList[i].type == "position"){
				if(constraintList[i].point1 == pl1 || constraintList[i].point1 == pl2){
					clab.push(constraintList[i].label);
				}
			}
		};
		removeCtr(clab[0]);
		removeCtr(clab[1]);
	}
	for(var i=0;i<horivert.dir.length;i++){
		if(horivert.dir[i] == "h" || horivert.dir[i] == "v"){
			if(horivert.dir[i] == "h"){
				constraintList[constraintList.length] = new HoriVert("h",selection[0].label,horivert.label[i]);
			} else if (horivert.dir[i] == "v"){
				constraintList[constraintList.length] = new HoriVert("v",selection[0].label,horivert.label[i]);
			}
			constraintList[constraintList.length-1].label = labelconstraint;
			e1 = edgeFromPoints(selection[0].label,horivert.label[i]);
			le1 = posLabel("edge",e1);
			edgeList[le1].constraints.push(labelconstraint);
			labelconstraint += 1;
		};
	};
	if(selection[0].type == "point"){
		var n = posLabel("point",selection[0].label);
		pointList[n].selected = false;
		pointList[n].light = false;
	} else if (selection[0].type == "edge"){
		var ep = posLabel("edge",selection[0].label);
		edgeList[ep].selected = false;
		edgeList[ep].light = false;
	}
	initDraw();
	selection = [];
}

function modeTranslate(){
	mode = "modeTranslate";
	showButtons();
}

function translateDown(e){
	var elem0 = identifyElement(e);
	if(elem0 != undefined){
		selection[0] = elem0;
		flag = 1;
		posbuff = getMousePos(canvas, e);
	};
}

function translate(e){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	var i=0;
	var k = 0;
	var j = 0;
	
	if(selection[0].type == "point"){
		pointslab[0] = selection[0].label;
	} else if(selection[0].type == "edge"){
		pointslab[0] = edgeList[posLabel("edge",selection[0].label)].point1;
		pointslab[1] = edgeList[posLabel("edge",selection[0].label)].point2;
	} else if (selection[0].type == "arc"){
		pointslab[0] = arcList[posLabel("arc",selection[0].label)].point1;
		pointslab[1] = arcList[posLabel("arc",selection[0].label)].point2;
		pointslab[2] = arcList[posLabel("arc",selection[0].label)].center;
	}
	if(selection[0] != undefined){
		// on parcourt tous les edges pour ajouter les nouveaux points à la liste
		while(j<edgeList.length){
			kk = 0;
			// on parcourt tous les points de la liste
			for(var m=0;m<pointslab.length;m++){
				// si un des points de l'edge est dans la liste, on ajoute l'autre s'il n'est pas déjà dedans
				if(edgeList[j].point2 == pointslab[m] && !(pointslab.includes(edgeList[j].point1))){
					pointslab.push(edgeList[j].point1);
					j = 0;
					kk = 1;
				}
				if(edgeList[j].point1 == pointslab[m] && !(pointslab.includes(edgeList[j].point2))){
					pointslab.push(edgeList[j].point2);
					j = 0;
					kk = 1;
				}
			}
			if(kk==0){
				j++
			}
		}
		// on parcourt tous les arcs pour ajouter les nouveaux points à la liste
		j = 0;
		while(j<arcList.length){
			kk = 0;
			// on parcourt tous les points de la liste
			for(var m=0;m<pointslab.length;m++){
				// si un des points de l'edge est dans la liste, on ajoute l'autre s'il n'est pas déjà dedans
				if(arcList[j].point2 == pointslab[m]){
					if(!(pointslab.includes(arcList[j].center))){
						pointslab.push(arcList[j].center);
					}
					if(!(pointslab.includes(arcList[j].point1))){
						pointslab.push(arcList[j].point1);
						j = 0;
						kk = 1;
					}
				}
				if(arcList[j].point1 == pointslab[m]){
					if(!(pointslab.includes(arcList[j].center))){
						pointslab.push(arcList[j].center);
					}
					if(!(pointslab.includes(arcList[j].point2))){
						pointslab.push(arcList[j].point2);
						j = 0;
						kk = 1;
					}
				}
				
			}
			if(kk==0){
				j++
			}
		}
		
		for(var j=0;j<pointslab.length;j++){
			i = 0;
			while(i<constraintList.length){
				if(constraintList[i].type == "position" && constraintList[i].point1 == pointslab[j]){
					constraintList[i].posx = constraintList[i].posx + posx - posbuff.x;
					constraintList[i].posy = constraintList[i].posy + posy - posbuff.y;
					i = constraintList.length + 1;
				} else {
					i++;
				}
			}
			if(i == constraintList.length){
				var xx = pointList[posLabel("point",pointslab[j])].x + posx - posbuff.x;
				var yy = pointList[posLabel("point",pointslab[j])].y + posy - posbuff.y;
				constraintList[constraintList.length] = new Position(pointslab[j],xx,yy);
			}
		}
		posbuff = pos;
	}
	
	updateSketch();
};

function translateUp(e){
	var i = 0;
	var clab = [];
	var n;
	for(var j=0;j<pointslab.length;j++){
		while(i<constraintList.length){
			if(constraintList[i].type == "position" && constraintList[i].point1 == pointslab[j]){
				clab.push(constraintList[i].label);
				i = constraintList.length + 1;
			} else {
				i++;
			}
		} 
		removeCtr(clab[0]);
		removeCtr(clab[1]);
		n = posLabel("point",pointslab[j]);
		pointList[n].selected = false;
		pointList[n].light = false;
	}
	initDraw();
	selection = [];
	pointslab = [];
}
