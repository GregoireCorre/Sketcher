function modeFillet(){
	mode = "modeFillet";
	showButtons();
}

function createFillet(e){
	var elem = identifyElement(e);
	if(elem != undefined){
		if(arcparam.length <2 && elem.type == "edge"){
			arcparam.push(elem);
			edgeList[posLabel("edge",arcparam[arcparam.length-1].label)].selected = true;
		}
	} else {
		if(arcparam.length == 2){
			// identification du noeud commun
			var pl1 = edgeList[posLabel("edge",arcparam[0].label)].point1;
			var pl2 = edgeList[posLabel("edge",arcparam[0].label)].point2;
			var pl3 = edgeList[posLabel("edge",arcparam[1].label)].point1;
			var pl4 = edgeList[posLabel("edge",arcparam[1].label)].point2;
			if(pl1 == pl3){
				var ppl1 = pl2;
				var ppl2 = pl1;
				var ppl3 = pl4;
				p1 = pointList[posLabel("point",pl2)];
				p2 = pointList[posLabel("point",pl1)];
				p3 = pointList[posLabel("point",pl4)];
			} else if(pl1 == pl4){
				var ppl1 = pl2;
				var ppl2 = pl1;
				var ppl3 = pl3;
				p1 = pointList[posLabel("point",pl2)];
				p2 = pointList[posLabel("point",pl1)];
				p3 = pointList[posLabel("point",pl3)];
			} else if(pl2 == pl4){
				var ppl1 = pl1;
				var ppl2 = pl2;
				var ppl3 = pl3;
				p1 = pointList[posLabel("point",pl1)];
				p2 = pointList[posLabel("point",pl2)];
				p3 = pointList[posLabel("point",pl3)];
			} else if(pl2 == pl3){
				var ppl1 = pl1;
				var ppl2 = pl2;
				var ppl3 = pl4;
				p1 = pointList[posLabel("point",pl1)];
				p2 = pointList[posLabel("point",pl2)];
				p3 = pointList[posLabel("point",pl4)];
			}
			var pos = getMousePos(canvas, e);
			var posx = pos.x;
			var posy = pos.y;
			// calcul du centre du congé
			var a = Math.sqrt((p3.x-p1.x)**2+(p3.y-p1.y)**2);
			var b = Math.sqrt((p2.x-p1.x)**2+(p2.y-p1.y)**2);
			var c = Math.sqrt((p3.x-p2.x)**2+(p3.y-p2.y)**2);
			var l = a*b/(b+c);
			var x0 = p1.x + l*(p3.x-p1.x)/Math.sqrt((p3.x-p1.x)**2+(p3.y-p1.y)**2);
			var y0 = p1.y + l*(p3.y-p1.y)/Math.sqrt((p3.x-p1.x)**2+(p3.y-p1.y)**2);
			var vb = {x:(x0-p2.x),y:(y0-p2.y)};
			var xc = (p2.x+(posy-p2.y+posx*vb.x/vb.y)*vb.x/vb.y)/(1+vb.x**2/vb.y**2);
			var yc = posy + (posx - xc)*vb.x/vb.y;
			var pc = {x:xc,y:yc};
			// calcul des bords du congés
			if(p2.y != p1.y){
				var xc1 = (p2.x+(p1.x-p2.x)/(p1.y-p2.y)*(yc-p2.y+xc*(p1.x-p2.x)/(p1.y-p2.y)))/(1+(p1.x-p2.x)**2/(p1.y-p2.y)**2);
				var yc1 = yc + (xc-xc1)*(p1.x-p2.x)/(p1.y-p2.y);
			} else {
				var yc1 = p1.y;
				var xc1 = xc;
			}
			if(p3.y != p2.y){
				var xc2 = (p2.x+(p3.x-p2.x)/(p3.y-p2.y)*(yc-p2.y+xc*(p3.x-p2.x)/(p3.y-p2.y)))/(1+(p3.x-p2.x)**2/(p3.y-p2.y)**2);
				var yc2 = yc + (xc-xc2)*(p3.x-p2.x)/(p3.y-p2.y);
			} else {
				var yc2 = p2.y;
				var xc2 = xc;
			}
			// création des nouveaux points
			p2.x = xc1;
			p2.y = yc1;
			pointList[pointList.length] = new Point(xc2,yc2);
			pointList[pointList.length-1].label = labelpoint;
			pointList[pointList.length] = new Point(xc,yc);
			pointList[pointList.length-1].label = labelpoint+1;
			
			// modification d'un des 2 edges et des contraintes associées
			el = edgeFromPoints(ppl2,ppl3);
			ep = edgeList[posLabel("edge",el)]
			if(ep.point1 == ppl2){
				ep.point1 = labelpoint;
			} else if (ep.point2 == ppl2){
				ep.point2 = labelpoint;
			}
			for(var i=0;i<ep.constraints.length;i++){
				var cp = posLabelCtr(ep.constraints[i]);
				if(constraintList[cp].point1 == ppl2){
					constraintList[cp].point1 = labelpoint;
				} else if (constraintList[cp].point2 == ppl2){
					constraintList[cp].point2 = labelpoint;
				} 
			}
			
			// contrainte d'alignement des points
			constraintList[constraintList.length] = new Angle(ppl1,ppl2,labelpoint+1,90);
			constraintList[constraintList.length-1].label = labelconstraint;
			pointList[posLabel("point",ppl1)].constraints.push(labelconstraint);
			pointList[posLabel("point",ppl2)].constraints.push(labelconstraint);
			pointList[posLabel("point",labelpoint+1)].constraints.push(labelconstraint);
			el = edgeFromPoints(ppl1,ppl2);
			edgeList[posLabel("edge",el)].constraints.push(labelconstraint);
			labelconstraint += 1;
			constraintList[constraintList.length] = new Angle(ppl3,labelpoint,labelpoint+1,90);
			constraintList[constraintList.length-1].label = labelconstraint;
			pointList[posLabel("point",ppl3)].constraints.push(labelconstraint);
			pointList[posLabel("point",labelpoint)].constraints.push(labelconstraint);
			pointList[posLabel("point",labelpoint+1)].constraints.push(labelconstraint);
			el = edgeFromPoints(ppl3,labelpoint);
			edgeList[posLabel("edge",el)].constraints.push(labelconstraint);
			labelconstraint += 1;
			
			// création du nouvel arc
			arcList[arcList.length] = new Arc(ppl2,labelpoint,labelpoint+1);
			if(e.shiftKey){
				arcList[arcList.length-1].trigo = false;
			};
			arcList[arcList.length-1].label = labelarc;
			labelarc += 1;
			labelpoint += 2;
			
			// déselection des edges;
			edgeList[posLabel("edge",arcparam[0].label)].selected = false;
			edgeList[posLabel("edge",arcparam[1].label)].selected = false;
			arcparam = [];
		}
	}
}

function activeFillet(e){
	// identification du noeud commun
	var pl1 = edgeList[posLabel("edge",arcparam[0].label)].point1;
	var pl2 = edgeList[posLabel("edge",arcparam[0].label)].point2;
	var pl3 = edgeList[posLabel("edge",arcparam[1].label)].point1;
	var pl4 = edgeList[posLabel("edge",arcparam[1].label)].point2;
	if(pl1 == pl3){
		pl = pl1;
		p1 = pointList[posLabel("point",pl2)];
		p2 = pointList[posLabel("point",pl1)];
		p3 = pointList[posLabel("point",pl4)];
	} else if(pl1 == pl4){
		pl = pl1;
		p1 = pointList[posLabel("point",pl2)];
		p2 = pointList[posLabel("point",pl1)];
		p3 = pointList[posLabel("point",pl3)];
	} else if(pl2 == pl4){
		pl = pl2;
		p1 = pointList[posLabel("point",pl1)];
		p2 = pointList[posLabel("point",pl2)];
		p3 = pointList[posLabel("point",pl3)];
	} else if(pl2 == pl3){
		pl = pl2;
		p1 = pointList[posLabel("point",pl1)];
		p2 = pointList[posLabel("point",pl2)];
		p3 = pointList[posLabel("point",pl4)];
	}
	var pos = getMousePos(canvas, e);
	var posx = pos.x;
	var posy = pos.y;
	// calcul du centre du congé
	var a = Math.sqrt((p3.x-p1.x)**2+(p3.y-p1.y)**2);
	var b = Math.sqrt((p2.x-p1.x)**2+(p2.y-p1.y)**2);
	var c = Math.sqrt((p3.x-p2.x)**2+(p3.y-p2.y)**2);
	var l = a*b/(b+c);
	var x0 = p1.x + l*(p3.x-p1.x)/Math.sqrt((p3.x-p1.x)**2+(p3.y-p1.y)**2);
	var y0 = p1.y + l*(p3.y-p1.y)/Math.sqrt((p3.x-p1.x)**2+(p3.y-p1.y)**2);
	var vb = {x:(x0-p2.x),y:(y0-p2.y)};
	var xc = (p2.x+(posy-p2.y+posx*vb.x/vb.y)*vb.x/vb.y)/(1+vb.x**2/vb.y**2);
	var yc = posy + (posx - xc)*vb.x/vb.y;
	var pc = {x:xc,y:yc};
	// calcul des bords du congés
	if(p2.y != p1.y){
		var xc1 = (p2.x+(p1.x-p2.x)/(p1.y-p2.y)*(yc-p2.y+xc*(p1.x-p2.x)/(p1.y-p2.y)))/(1+(p1.x-p2.x)**2/(p1.y-p2.y)**2);
		var yc1 = yc + (xc-xc1)*(p1.x-p2.x)/(p1.y-p2.y);
	} else {
		var yc1 = p1.y;
		var xc1 = xc;
	}
	if(p3.y != p2.y){
		var xc2 = (p2.x+(p3.x-p2.x)/(p3.y-p2.y)*(yc-p2.y+xc*(p3.x-p2.x)/(p3.y-p2.y)))/(1+(p3.x-p2.x)**2/(p3.y-p2.y)**2);
		var yc2 = yc + (xc-xc2)*(p3.x-p2.x)/(p3.y-p2.y);
	} else {
		var yc2 = p2.y;
		var xc2 = xc;
	}
	// dessin du congés actif
	if (!e.shiftKey){
		var ang0 = Math.atan2(yc1-yc,xc1-xc);
		var ang1 = Math.atan2(yc2-yc,xc2-xc);
	} else {
		var ang1 = Math.atan2(yc1-yc,xc1-xc);
		var ang0 = Math.atan2(yc2-yc,xc2-xc);
	}
	var rad = Math.sqrt((xc-xc1)**2+(yc-yc1)**2);
	context.beginPath();
	context.setLineDash([]);
	context.lineWidth = line_width;
	context.strokeStyle = "#000000";
	context.arc(xc,yc,rad,ang0,ang1);
	context.stroke();
}