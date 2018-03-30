function modeMultiLine(){
	mode = "modeMultiLine0"
	showButtons();
}

function draw(e) {
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	var dist;
	var posxx, posyy
	var points =pointList;
	var n = -1;
	if (mode == "modeMultiLine0") {
		n = hangPoint(posx,posy);
		if ( n == -1 ){
			drawDot(posx,posy);
			pointList[pointList.length] = new Point(posx,posy);
			pointList[pointList.length-1].label = labelpoint;
			lastpoint = labelpoint;
			labelpoint += 1;
		};
		mode = "modeMultiLine1";
	} else {
		// si on clique sur le dernier point, on crée un Path
		n1 = posLabel("point",lastpoint);
		dist = Math.sqrt( ( posx - pointList[n1].x )**2 + ( posy - pointList[n1].y )**2 );
		if( dist < radius ) {
			mode = "modeMultiLine0";
			//savePath();
			initDraw();
			n = 1;
		} else {
			// sinon on vérifie que l'on accroche pas un point
			n = hangPoint(posx,posy);
		
			if (n == -1){
				posxx = posx;
				posyy = posy;
				// on récupère les points utilisé pour la construction des lignes en pointillés
				var np1 = posLabel("point",constrline.point1);
				var np2 = posLabel("point",constrline.point2);
				
				// Lignes horizontales / verticales
				if (horivert.dir[0] == "h"){
					posyy = points[n1].y;
				} 
				if (horivert.dir[0] == "v"){
					posxx = points[n1].x;
				} 
				// Lignes en pointillés
				if (constrline.dir == "h"){
					posyy = pointList[np1].y;
				} 
				if (constrline.dir == "v"){
					posxx = pointList[np1].x;
				} 
				if (constrline.dir == "vh"){
					posxx = pointList[np1].x;
					posyy = pointList[np2].y;
				} 
				if (constrline.dir == "hv"){
					posxx = pointList[np2].x;
					posyy = pointList[np1].y;
				}
				drawDot(posxx,posyy);
				pointList[pointList.length] = new Point(posxx,posyy);
				pointList[pointList.length-1].label = labelpoint;
				var n = posLabel("point",lastpoint);
				drawLine(pointList[n].x,pointList[n].y,posxx,posyy,false,false);
				edgeList[edgeList.length] = new Edge(lastpoint,pointList[pointList.length-1].label);
				edgeList[edgeList.length-1].label = labeledge;
				labeledge += 1;
				// création d'une nouvelle contrainte horivert
				if(horivert.dir[0] == "h" || horivert.dir[0] == "v"){
					if(horivert.dir[0] == "h"){
						constraintList[constraintList.length] = new HoriVert("h",lastpoint,pointList[pointList.length-1].label);
					} else if (horivert.dir[0] == "v"){
						constraintList[constraintList.length] = new HoriVert("v",lastpoint,pointList[pointList.length-1].label);
					}
					constraintList[constraintList.length-1].label = labelconstraint;
					e1 = edgeFromPoints(lastpoint,pointList[pointList.length-1].label);
					le1 = posLabel("edge",e1);
					edgeList[le1].constraints.push(labelconstraint);
					pointList[pointList.length-1].constraints.push(labelconstraint);
					pointList[n].constraints.push(labelconstraint);
					labelconstraint += 1;
				}
				lastpoint = labelpoint;
				labelpoint += 1;
				// création d'une nouvelle contrainte d'alignement
				if(constrline.dir == "h"){
					constraintList[constraintList.length] = new Align("h",pointList[pointList.length-1].label,constrline.point1);
					constraintList[constraintList.length-1].label = labelconstraint;
					pointList[pointList.length-1].constraints.push(labelconstraint);
					var n = posLabel("point",constrline.point1);
					pointList[n].constraints.push(labelconstraint);
					labelconstraint += 1;
				} else if(constrline.dir == "v"){
					constraintList[constraintList.length] = new Align("v",pointList[pointList.length-1].label,constrline.point1);
					constraintList[constraintList.length-1].label = labelconstraint;
					pointList[pointList.length-1].constraints.push(labelconstraint);
					var n = posLabel("point",constrline.point1);
					pointList[n].constraints.push(labelconstraint);
					labelconstraint += 1;
				} else if (constrline.dir == "vh"){
					constraintList[constraintList.length] = new Align("v",pointList[pointList.length-1].label,constrline.point1);
					constraintList[constraintList.length-1].label = labelconstraint;
					pointList[pointList.length-1].constraints.push(labelconstraint);
					var n = posLabel("point",constrline.point1);
					pointList[n].constraints.push(labelconstraint);
					labelconstraint += 1;
					constraintList[constraintList.length] = new Align("h",pointList[pointList.length-1].label,constrline.point2);
					constraintList[constraintList.length-1].label = labelconstraint;
					pointList[pointList.length-1].constraints.push(labelconstraint);
					var n = posLabel("point",constrline.point2);
					pointList[n].constraints.push(labelconstraint);
					labelconstraint += 1;
				} else if (constrline.dir == "hv"){
					constraintList[constraintList.length] = new Align("h",pointList[pointList.length-1].label,constrline.point1);
					constraintList[constraintList.length-1].label = labelconstraint;
					pointList[pointList.length-1].constraints.push(labelconstraint);
					var n = posLabel("point",constrline.point1);
					pointList[n].constraints.push(labelconstraint);
					labelconstraint += 1;
					constraintList[constraintList.length] = new Align("v",pointList[pointList.length-1].label,constrline.point2);
					constraintList[constraintList.length-1].label = labelconstraint;
					pointList[pointList.length-1].constraints.push(labelconstraint);
					var n = posLabel("point",constrline.point2);
					pointList[n].constraints.push(labelconstraint);
					labelconstraint += 1;
				}
			}
		}
	}
}

function horiVertLine(e){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	var width = 10;
	var pts = [];
	var edges = [];	
	horivert.dir = [];
	horivert.label = [];
	if(mode == "modeMultiLine1"){
		pts[0] = lastpoint ; 
	} else if (mode == "select"){
		edges = edgesFromPoint(selection[0].label);
		for(var i = 0;i<edges.length;i++){
			e = posLabel("edge",edges[i]);
			if(edgeList[e].point1 == selection[0].label){
				if(!typeCtrElem("edge","horivert",edgeList[e].label)){
					pts.push(edgeList[e].point2);
				};
			} else if(edgeList[e].point2 == selection[0].label){
				if(!typeCtrElem("edge","horivert",edgeList[e].label)){
						pts.push(edgeList[e].point1);
				}
			}
		}
	}
	for(var i=0;i<pts.length;i++){
		n = posLabel("point",pts[i]);
		if (Math.abs(posy-pointList[n].y) < width){
			horivert.dir.push("h");
			horivert.label.push(pts[i]);
		} else if (Math.abs(posx-pointList[n].x) < width){ 
			horivert.dir.push("v");
			horivert.label.push(pts[i]);
		}
	}
}

function constructLine(e){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	var width = 5
	var nn = 0
	for (var i=0;i<pointList.length-1;i++){
		var pt = pointList[i];
		if (Math.abs(posy-pt.y) < width && horivert.dir != "h"){
			if (posx < pt.x ){
				drawDotLine(posx-20,pt.y,pt.x+20,pt.y,);
			} else {
				drawDotLine(pt.x-20,pt.y,posx+20,pt.y);
			};
			if ( constrline.dir == "off" ){
				constrline.dir = "h";
				constrline.point1 = i;
				nn += 1;
			} else if ( constrline.dir == "v"){
				constrline.dir = "vh";
				constrline.point2 = i;
				nn += 1;
			} else if ( constrline.dir == "h" || constrline.dir == "vh"){
				nn += 1;
			} 
		};
		if (Math.abs(posx-pt.x) < width && horivert.dir != "v"){
			if (posy < pt.y){
				drawDotLine(pt.x,posy-20,pt.x,pt.y+20);
			} else {
				drawDotLine(pt.x,pt.y-20,pt.x,posy+20);
			};
			if ( constrline.dir == "off" ){
				constrline.dir = "v";
				constrline.point1 = i;
				nn += 1;
			} else if ( constrline.dir == "h" ){
				constrline.dir = "hv";
				constrline.point2 = i;
				nn += 1;
			} else if ( constrline.dir == "v" || constrline.dir == "hv"){
				nn += 1;
			}
		};
	};
	
	if (nn == 0){
		constrline.dir = "off";
	}
}

function hangPoint(posx,posy){
	var i = 0, n = -1;
	var points = pointList;
	while (i<points.length){
		dist = Math.sqrt( ( posx - points[i].x )**2 + ( posy - points[i].y )**2 );
		if( dist < radius ) {
			posxx = points[i].x;
			posyy = points[i].y;
			drawDot(posxx,posyy);
			if (mode == "modeMultiLine1"){
				var n1 = posLabel("point",lastpoint);
				drawLine(pointList[n1].x,pointList[n1].y,posxx,posyy,false);
				edgeList[edgeList.length] = new Edge(lastpoint,pointList[i].label);
				edgeList[edgeList.length-1].label = labeledge;
				labeledge += 1;
			};
			lastpoint = pointList[i].label;
			n = pointList[i].label;
			i = points.length+1;
		} else {
			i++;
		}
	};
	return n;
}

//----------------------------------------------------------------------------------//
// magnetPositions modifie la position du point courant dans le cas de lignes       //
// horizontales/verticalesou d'alignement avec d'autre points.                      //
//----------------------------------------------------------------------------------//
function magnetPositions(posx,posy){
	var posxx = posx;
	var posyy = posy;
	var newlogo;
	if (horivert.dir[0] == "h"){
		var n = posLabel("point",horivert.label[0]);
		posyy = pointList[n].y
		newlogo = new Logo(imghori,posxx,posyy-20,20,20);
		logos.push(newlogo);
	};
	if (horivert.dir[0] == "v"){
		var n = posLabel("point",horivert.label[0]);
		posxx = pointList[n].x;
		newlogo = new Logo(imgvert,posxx-20,posyy,20,20);
		logos.push(newlogo);
	};
	if (horivert.dir[1] == "h"){
		var n = posLabel("point",horivert.label[1]);
		posyy = pointList[n].y
		newlogo = new Logo(imghori,posxx,posyy-20,20,20);
		logos.push(newlogo);
	};
	if (horivert.dir[1] == "v"){
		var n = posLabel("point",horivert.label[1]);
		posxx = pointList[n].x;
		newlogo = new Logo(imgvert,posxx-20,posyy,20,20);
		logos.push(newlogo);
	};
	if (constrline.dir =="h"){
		posyy = pointList[constrline.point1].y; 
	} ;
	if (constrline.dir =="v"){
		posxx = pointList[constrline.point1].x;
	} 
	if (constrline.dir == "vh"){
		posxx = pointList[constrline.point1].x;
		posyy = pointList[constrline.point2].y;
	} 
	if (constrline.dir == "hv"){
		posxx = pointList[constrline.point2].x;
		posyy = pointList[constrline.point1].y;
	};
	return [posxx,posyy];
}

//-----------------------------------------------------------------------------//
// typeCtrElem renvoie true si une contrainte de type typec est déjà présente  //
// dans la liste de contraintes de l'élément de type typel et de label label   //
//-----------------------------------------------------------------------------//
function typeCtrElem(typel,typec,label){
	res = false;
	if(typel == "edge"){
		e = posLabel("edge",label);
		for(var i=0;i<edgeList[e].constraints.length;i++){
			cl0 = edgeList[e].constraints[i];
			c0 = posLabelCtr(cl0);
			if(constraintList[c0].type == typec){
				res = true;
			}
		}
	}
	return res;
}