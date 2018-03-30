function labelChoice(){
	if(labelbutton == "off"){
		// Création de deux nouveax boutons
		labelpoints = document.createElement("BUTTON");
		labeledges = document.createElement("BUTTON");
		labelarcs = document.createElement("BUTTON");
		labelpoints.setAttribute("id","buttonlabelpoints");
		labeledges.setAttribute("id","buttonlabeledges");
		labelarcs.setAttribute("id","buttonlabelarcs");
		labelpoints.innerHTML = '<img src="labelpoints.png" width="60px" height="60px" />';
		labeledges.innerHTML = '<img src="labeledges.png" width="60px" height="60px"/>';
		labelarcs.innerHTML = '<img src="labelarcs.png" width="60px" height="60px"/>';
		labelpoints.setAttribute("style","position:absolute; top:520px; left:65px");
		labeledges.setAttribute("style","position:absolute; top:520px; left:130px");
		labelarcs.setAttribute("style","position:absolute; top:520px; left:195px");
		document.body.appendChild(labelpoints);
		document.body.appendChild(labeledges);
		document.body.appendChild(labelarcs);
		// Création des nouvelles actions associées aux nouveaux boutons
		addListener(document.getElementById("buttonlabelpoints"),"click",labelPoints);
		addListener(document.getElementById("buttonlabeledges"),"click",labelEdges);
		addListener(document.getElementById("buttonlabelarcs"),"click",labelArcs);
		labelbutton = "on";
	} else {
		labelpoints.parentNode.removeChild(labelpoints);
		labeledges.parentNode.removeChild(labeledges);
		labelarcs.parentNode.removeChild(labelarcs);
		labelbutton = "off";
	}
}

function labelPoints(){
	if (labpoints == false){
		labpoints = true;
		showLabels();
	} else if (labpoints == true){
		labpoints = false;
		clearCanvas();
		drawCanvas();
	}
}

function labelEdges(){
	if (labedges == false){
		labedges = true;
		showLabels();
	} else if (labedges == true){
		labedges = false;
		clearCanvas();
		drawCanvas();
	}
}

function labelArcs(){
	if (labarcs == false){
		labarcs = true;
		showLabels();
	} else if (labarcs == true){
		labarcs = false;
		clearCanvas();
		drawCanvas();
	}
}

function showLabels(){
	var pl, pp;
	var el, ep;
	var x1, y1, xc, yc;
	var pl1, pl2, p1, p2, plc, pc;
	var rad;
	if(labpoints == true){
		context.fillStyle = "#00008B";
		context.font = "15px Arial";
		for(var i=0;i<pointList.length;i++){
			pl = pointList[i].label;
			pp = posLabel("point",pl);
			context.fillText(pl,pointList[pp].x+10,pointList[pp].y+10);
		}
	}
	if(labedges == true){
		context.fillStyle = "#006400";
		context.font = "15px Arial";
		for(var i=0;i<edgeList.length;i++){
			el = edgeList[i].label;
			ep = posLabel("edge",el);
			pl1 = edgeList[ep].point1;
			p1 = posLabel("point",pl1);
			pl2 = edgeList[ep].point2;
			p2 = posLabel("point",pl2);
			x1 = 0.5*(pointList[p1].x + pointList[p2].x);
			y1 = 0.5*(pointList[p1].y + pointList[p2].y);
			context.fillText(el,x1+10,y1+10);
		}
	}
	if(labarcs == true){
		context.fillStyle = "#FF4500";
		context.font = "15px Arial";
		for(var i=0;i<arcList.length;i++){
			al = arcList[i].label;
			ap = posLabel("arc",al);
			pl1 = arcList[ap].point1;
			p1 = posLabel("point",pl1);
			pl2 = arcList[ap].point2;
			p2 = posLabel("point",pl2);
			plc = arcList[ap].center;
			pc = posLabel("point",plc);
			if (arcList[i].trigo == true){
				ang0 = Math.atan2(pointList[p1].y-pointList[pc].y,pointList[p1].x-pointList[pc].x);
				ang1 = Math.atan2(pointList[p2].y-pointList[pc].y,pointList[p2].x-pointList[pc].x);
			} else if (arcList[i].trigo == false){
				ang1 = Math.atan2(pointList[p1].y-pointList[pc].y,pointList[p1].x-pointList[pc].x);
				ang0 = Math.atan2(pointList[p2].y-pointList[pc].y,pointList[p2].x-pointList[pc].x);
			}
			if(ang0 <= ang1){
				ang = 0.5*(ang1 + ang0);
			} else if (ang0 >= ang1){
				ang = 0.5*(ang1+2*Math.PI + ang0);
			}
			rad = Math.sqrt((pointList[p1].x-pointList[pc].x)**2+(pointList[p1].y-pointList[pc].y)**2);
			x1 = pointList[pc].x + rad*Math.cos(ang);
			y1 = pointList[pc].y + rad*Math.sin(ang);
			context.fillText(al,x1+15,y1+15);
		}
	}
}

function Logo(img,x,y,h,w){
	this.image = img;
	this.posx = x;
	this.posy = y;
	this.height = h;
	this.width = w;
}

function showLogos(){
	for(var i=0;i<logos.length;i++){
		context.drawImage(logos[i].image,logos[i].posx,logos[i].posy,logos[i].height,logos[i].width);
	};
	logos = [];
}

