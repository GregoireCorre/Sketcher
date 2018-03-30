function modeCircle(){
	mode = "modeCircle";
	showButtons();
}

function circle(e){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	var n = -1;
	
	if(arcparam.length == 0){
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
	} else if(arcparam.length == 1){
		pointList[pointList.length] = new Point(pos.x,pos.y);
		pointList[pointList.length-1].label = labelpoint;
		arcparam[1] = labelpoint;
		labelpoint += 1;
		arcList[arcList.length] = new Arc(arcparam[1],arcparam[1],arcparam[0]);
		arcList[arcList.length-1].label = labelarc;
		labelarc += 1;
		initDraw();
	}
	
}


function activeCircle(e){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	var key = e.shiftKey;
	
	// calcul du centre
	xc = pointList[posLabel("point",arcparam[0])].x;
	yc = pointList[posLabel("point",arcparam[0])].y;
	
	// calcul du rayon
	xr = posx;
	yr = posy;
	var rad = Math.sqrt((xr-xc)**2 + (yr-yc)**2);
	
	// calcul de l'angle 
	ang0 = 0;
	ang1 = 2*Math.PI;
	
	context.beginPath();
	context.setLineDash([]);
	context.lineWidth = line_width;
	context.strokeStyle = "#000000";
	context.arc(xc,yc,rad,ang0,ang1);
	context.stroke();
	
}