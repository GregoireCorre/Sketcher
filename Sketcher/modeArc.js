function modeArc(e){
	mode = "modeArc";
	showButtons();
}

function drawArc1(e){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	var n = -1;
	
	n = hangPoint(posx,posy);
	if(n == -1){
		drawDot(posx,posy);
		pointList[pointList.length] = new Point(posx,posy);
		pointList[pointList.length-1].label = labelpoint;
		arcparam[0] = labelpoint;
		lastpoint = labelpoint;
		labelpoint += 1;
	} else {
		arcparam[0] = n;
	}
	
}

function drawArc2(e){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	var n =-1;
	
	n = hangPoint(posx,posy)
	if(n == -1){
		drawDot(posx,posy);
		pointList[pointList.length] = new Point(posx,posy);
		pointList[pointList.length-1].label = labelpoint;
		arcparam[1] = labelpoint;
		labelpoint += 1;
	} else {
		arcparam[1] = n;
	}
	
}

function drawArc3(e){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	var n = 0;
	var ctr;
	
	n = hangPoint(posx,posy)
	if(n==-1){
		
	}
	// calcul du centre
	var n1 = posLabel("point",arcparam[0]);
	var n2 = posLabel("point",arcparam[1]);
	var xb = pointList[n1].x;
	var yb = pointList[n1].y;
	var xa = pointList[n2].x;
	var ya = pointList[n2].y;
	
	if(map[87] && !map[83]){
		ctr = new Point(xb,(ya**2-yb**2+(xa-xb)**2)/(2*(ya-yb)));
	} else if(map[88]){
		ctr = new Point(xa,(yb**2-ya**2+(xb-xa)**2)/(2*(yb-ya)));
	} else if(map[81]){
		ctr = new Point((xa**2-xb**2+(ya-yb)**2)/(2*(xa-xb)),yb);
	} else if(map[83] && !map[87]){
		ctr = new Point((xb**2-xa**2+(yb-ya)**2)/(2*(xb-xa)),ya);
	} else if(map[87] && map[83]){
		ctr = new Point(xb,posy);
		var pp = posLabel("point",arcparam[1]);
		pointList[pp].x = xb + Math.abs(posy-yb);
		pointList[pp].y = posy;
	} else {
		if(xb != xa){
			var m = (yb-ya)/(xb-xa);
			var p = (xb*ya-yb*xa)/(xb-xa);
			var d = Math.abs((m*posx-posy+p))/Math.sqrt(1+m**2);
		} else {
			var d = Math.abs(posx - xa);
		}
		var l = Math.sqrt((xb-xa)**2 + (yb-ya)**2);
		var mid = {x:(xa+xb)/2, y:(yb+ya)/2};
		if(((posx-xa)*(yb-ya)-(posy-ya)*(xb-xa))<0){
			ctr = new Point(mid.x - d*(yb-ya)/l,mid.y + d*(xb-xa)/l);
		} else {
			ctr = new Point(mid.x + d*(yb-ya)/l,mid.y - d*(xb-xa)/l);
		}
	}
	
	pointList[pointList.length] = new Point(ctr.x,ctr.y);
	pointList[pointList.length-1].label = labelpoint;
	arcparam[2] = labelpoint;
	labelpoint += 1;
	arcList[arcList.length] = new Arc(arcparam[0],arcparam[1],arcparam[2]);
	if(e.shiftKey){
		arcList[arcList.length-1].trigo = false;
	}
	arcList[arcList.length-1].label = labelarc;
	labelarc += 1;
	//mode = "select";
	//savePath();
	//initPath();
	initDraw();
	
}

function activeArc(e){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	var key = e.shiftKey;
	// calcul du rayon
	var n1 = posLabel("point",arcparam[0]);
	var n2 = posLabel("point",arcparam[1]);
	var xb = pointList[n1].x;
	var yb = pointList[n1].y;
	var xa = pointList[n2].x;
	var ya = pointList[n2].y;
	if(xb != xa){
		var m = (yb-ya)/(xb-xa);
		var p = (xb*ya-yb*xa)/(xb-xa);
		var d = Math.abs((m*posx-posy+p))/Math.sqrt(1+m**2);
	} else {
		var d = Math.abs(posx-xa);
	}
	var l = Math.sqrt((xb-xa)**2 + (yb-ya)**2);
	var rad = Math.sqrt(d**2 + (l/2)**2);
	
	// calcul du centre
	var mid = {x:(xa+xb)/2, y:(yb+ya)/2};
	if(((posx-xa)*(yb-ya)-(posy-ya)*(xb-xa))<0){
		var xc = mid.x - d*(yb-ya)/l;
		var yc = mid.y + d*(xb-xa)/l;
	} else {
		var xc = mid.x + d*(yb-ya)/l;
		var yc = mid.y - d*(xb-xa)/l;
	}
	if(map[87] && !map[83]){
		var xc = xb;
		var yc = (ya**2-yb**2+(xa-xb)**2)/(2*(ya-yb));
		rad = Math.abs(-((xa-xb)**2+(ya-yb)**2)/(2*(ya-yb)));
		drawDotLine(xb-70,yb,xb+70,yb);
	} else if(map[88] && !map[81]){
		var xc = xa;
		var yc = (yb**2-ya**2+(xb-xa)**2)/(2*(yb-ya));
		rad = Math.abs(-((xb-xa)**2+(yb-ya)**2)/(2*(yb-ya)));
		drawDotLine(xa-70,ya,xa+70,ya);
	} else if(map[81] && !map[88]){
		var xc = (xa**2-xb**2+(ya-yb)**2)/(2*(xa-xb));
		var yc = yb
		rad = Math.abs(-((yb-ya)**2+(xb-xa)**2)/(2*(xb-xa)));
		drawDotLine(xb,yb-70,xb,yb+70);
	} else if(map[83] && !map[87]){
		var xc = (xb**2-xa**2+(yb-ya)**2)/(2*(xb-xa));
		var yc = ya
		rad = Math.abs(-((ya-yb)**2+(xa-xb)**2)/(2*(xa-xb)));
		drawDotLine(xa,ya-70,xa,ya+70);
	} else if(map[87] && map[83]){
		var xc = xb;
		var yc = posy;
		rad = Math.abs(posy - yb);
		xa = xb + rad;
		ya = posy;
		pointList[n2].x = xb + rad;
		pointList[n2].y = posy;
		drawDotLine(xa,ya-70,xa,ya+70);
		drawDotLine(xb-70,yb,xb+70,yb);
	} else if(map[88] && map[81]){
		var xc = posx;
		var yc = yb;
		rad = Math.abs(posx - xb);
		xa = posx;
		ya = yb + rad;
		pointList[n2].x = posx;
		pointList[n2].y = yb + rad;
		drawDotLine(xb,yb-70,xb,yb+70);
		drawDotLine(xa-70,ya,xa+70,ya);
	}  else {
		if(((posx-xa)*(yb-ya)-(posy-ya)*(xb-xa))<0){
			var xc = mid.x - d*(yb-ya)/l;
			var yc = mid.y + d*(xb-xa)/l;
		} else {
			var xc = mid.x + d*(yb-ya)/l;
			var yc = mid.y - d*(xb-xa)/l;
		}
	}
	
	// calcul de l'angle 
	if (key == false){
		ang0 = Math.atan2(pointList[n1].y-yc,pointList[n1].x-xc);
		ang1 = Math.atan2(pointList[n2].y-yc,pointList[n2].x-xc);
	} else if (key == true){
		ang1 = Math.atan2(pointList[n1].y-yc,pointList[n1].x-xc);
		ang0 = Math.atan2(pointList[n2].y-yc,pointList[n2].x-xc);
	}
	
	context.beginPath();
	context.setLineDash([]);
	context.lineWidth = line_width;
	context.strokeStyle = "#000000";
	context.arc(xc,yc,rad,ang0,ang1);
	context.stroke();
	
}


function inArc(pos,arc){
	var res = false;
	var posx = pos.x, posy = pos.y;
	var n1 = posLabel("point",arc.point1);
	var n2 = posLabel("point",arc.point2);
	var nc = posLabel("point",arc.center);
	var angpt = Math.atan2(posy-pointList[nc].y,posx-pointList[nc].x);
	var radarc = Math.sqrt((pointList[n1].x-pointList[nc].x)**2 + (pointList[n1].y-pointList[nc].y)**2);
	var radpt = Math.sqrt((posx-pointList[nc].x)**2 + (posy-pointList[nc].y)**2);
	if(radpt<radarc){
		if(arc.point1 == arc.point2){
			return true;
		}
		if (arc.trigo == true){
			ang0 = Math.atan2(pointList[n1].y-pointList[nc].y,pointList[n1].x-pointList[nc].x);
			ang1 = Math.atan2(pointList[n2].y-pointList[nc].y,pointList[n2].x-pointList[nc].x);
		} else if (arc.trigo == false){
			ang1 = Math.atan2(pointList[n1].y-pointList[nc].y,pointList[n1].x-pointList[nc].x);
			ang0 = Math.atan2(pointList[n2].y-pointList[nc].y,pointList[n2].x-pointList[nc].x);
		}
		if(ang0 <= ang1){
			if((angpt >= ang0 && angpt <= ang1)){
				res = true;
			} else {
				res = false;
			}
		} else if (ang0 >= ang1){
			if((angpt >= ang0 && angpt <= ang1+2*Math.PI) || (angpt >= ang0-2*Math.PI && angpt <= ang1)){
				res = true;
			} else {
				res = false;
			}
		}
		
		if(ang1 < ang0) ang1 += 2*Math.PI;
		if((ang1-ang0)>Math.PI ){ //s&& arc.trigo == true) || ((ang1-ang0)<Math.PI && arc.trigo == false)){
			var p1 = pointList[posLabel("point",n1)];
			var p2 = pointList[posLabel("point",n2)];
			var p3 = pointList[posLabel("point",nc)];
			var tot = 0;
			tot += findAngle(p1,pos,p2);
			tot += findAngle(p2,pos,p3);
			tot += findAngle(p3,pos,p1);
			tot = tot*180/Math.PI;
			if(tot <361 && tot > 359){
				res = true;
			}
		}
	}
	return res;
}

function surfArc(arc){
	var n1 = posLabel("point",arc.point1);
	var n2 = posLabel("point",arc.point2);
	var nc = posLabel("point",arc.center);
	var tot = 0;
	var radarc = Math.sqrt((pointList[n1].x-pointList[nc].x)**2 + (pointList[n1].y-pointList[nc].y)**2);
	if (arc.trigo == true){
		ang0 = Math.atan2(pointList[n1].y-pointList[nc].y,pointList[n1].x-pointList[nc].x);
		ang1 = Math.atan2(pointList[n2].y-pointList[nc].y,pointList[n2].x-pointList[nc].x);
	} else if (arc.trigo == false){
		ang1 = Math.atan2(pointList[n1].y-pointList[nc].y,pointList[n1].x-pointList[nc].x);
		ang0 = Math.atan2(pointList[n2].y-pointList[nc].y,pointList[n2].x-pointList[nc].x);
	}
	if(ang0 >= ang1){
		ang1 += 2*Math.PI;
	}
	tot += radarc**2/2*(ang1-ang0);
	tot += surfTriangle(pointList[n1],pointList[nc],pointList[n2]);
	return tot;
}