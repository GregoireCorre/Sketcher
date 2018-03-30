function Element (elemType,lab){
	this.type = elemType;
	this.label = lab;
}

function Point (posx,posy) {
	Element.call(this);
	this.type = "point";
	this.x = posx;
	this.y = posy;
	this.light = false;
	this.selected = false;
	this.constraints = [];
	this.drawPoint = function(){
		drawDot(this.x,this.y,this.light,this.selected);
	};
}

function Edge (p1,p2) {
	Element.call(this);
	this.type = "edge";
	this.point1 = p1; // label du point 1
	this.point2 = p2; // label du point 2
	this.geolength = 0;
	this.light = false;
	this.selected = false;
	this.constraints = [];
	this.dimensions = [];
	this.parameters = [];
	this.drawEdge = function(){
		var n1 = posLabel("point",this.point1);
		var n2 = posLabel("point",this.point2);
		var x1 = pointList[n1].x;
		var y1 = pointList[n1].y;
		var x2 = pointList[n2].x;
		var y2 = pointList[n2].y;
		drawLine(x1,y1,x2,y2,this.light,this.selected);
		this.updateLength();
	};
	this.updateLength = function(){
		var n1 = posLabel("point",this.point1);
		var n2 = posLabel("point",this.point2);
		var x1 = pointList[n1].x;
		var y1 = pointList[n1].y;
		var x2 = pointList[n2].x;
		var y2 = pointList[n2].y;
		this.geolength = Math.sqrt((x1-x2)**2 + (y1-y2)**2);
	};
}

function Arc(pt1,pt2,ctr){
	Element.call(this);
	this.type = "arc";
	this.point1 = pt1; // label du point1
	this.point2 = pt2; // label du point2
	this.center = ctr; // label du centre
	this.trigo = true; // true pour le sens trigo
	this.light = false;
	this.selected = false;
	this.constraints = [];
	this.drawArc = function(){
		var n1 = posLabel("point",this.point1);
		var n2 = posLabel("point",this.point2);
		var nc = posLabel("point",this.center);
		var p1 = pointList[n1];
		var p2 = pointList[n2];
		var c = pointList[nc];
		drawCircleArc(p1,p2,c,this.trigo,this.light,this.selected);
	};
}

function Path(){
	this.type = "path";
	this.pointList = []; // liste des labels des points du path
	this.edgeList = []; // liste des labels des edges du path
	this.arcList = []; // liste des labels des arcs du path
	this.nbelem = 0;
	this.constraints = [];
	this.closure = false;
	this.drawPath = function(){
		for(var i=0;i<this.pointList.length;i++){
			this.pointList[i].drawPoint();
		}
		for(var j=0;j<this.edgeList.length;j++){
			this.edgeList[j].drawEdge();
		}
		for(var k=0;k<this.arcList.length;k++){
			this.arcList[k].drawArc();
		}
	}
}

function Section (ptlist,elemlist) {
	Element.call(this);
	this.type = "section";
	this.points = ptlist;
	this.elems = elemlist;
	this.constraints = [];
	this.parameters = [];
	this.light = false;
	this.selected = false;
	this.hole = false;
	this.drawSection = function(){
		drawPolygon(this.pointList);
		for (var i=0;i<this.pointList.length;i++){
			this.pointList[i].drawPoint();
		};
		for (var i=0;i<this.edgeList.length;i++){
			this.edgeList[i].drawEdge();
		};
		
	};
}



// drawPoint dessine un point. Cette fonction ne crée pas d'objet point.
function drawDot(posx,posy,light,selected){
	context.beginPath();
	if(selected == true){
		context.fillStyle = "#FF8C00";
		context.arc(posx, posy, 3, 0, 2*Math.PI);
	} else if (light == true){
		context.fillStyle = "#FF0000";
		context.arc(posx, posy, 4, 0, 2*Math.PI);
	} else {
		context.fillStyle = "#000000";
		context.arc(posx, posy, 3, 0, 2*Math.PI);
	};
    context.fill();
}

function drawPolygon(lpoints,color){
	context.fillStyle = color;
	context.beginPath();
	context.moveTo(pointList[posLabel("point",lpoints[0])].x,pointList[posLabel("point",lpoints[0])].y);
	for (var i=1;i<lpoints.length;i++){
		context.lineTo(pointList[posLabel("point",lpoints[i])].x,pointList[posLabel("point",lpoints[i])].y);
	}
	context.closePath();
	context.fill()
}

function drawShape(points,elems,color){
	context.fillStyle = color;
	var pp1, pp2;
	var al, ii, n1, n2, ctr;
	var n = posLabel("point",points[0]);
	var xx = pointList[n].x;
	var yy = pointList[n].y;
	context.moveTo(xx,yy);
	for(var i=0;i<points.length;i++){
		ii = i+1;
		if(i == points.length -1) ii = 0;
		n1 = posLabel("point",points[i]);
		n2 = posLabel("point",points[ii]);
		xx = pointList[n2].x;
		yy = pointList[n2].y;
		//context.moveTo(xx,yy);
		if(elems[i] == "edge"){ // on dessine les lignes droites
			//xx = pointList[n2].x;
			//yy = pointList[n2].y;
			context.lineTo(xx,yy);
		} else if (elems[i] == "arc"){ // on dessine les arcs
			if(i == points.length-1) ii = 0;
			n1 = posLabel("point",points[i]);
			n2 = posLabel("point",points[ii]);
			al = arcFromPoints(n1,n2);
			ctr = arcList[posLabel("arc",al)].center;
			//point1 = pointList[posLabel("point",arcList[posLabel("arc",al)].point1)];
			//point2 = pointList[posLabel("point",arcList[posLabel("arc",al)].point2)];
			point1 = pointList[n1];
			point2 = pointList[n2];
			pp1 = arcList[posLabel("arc",al)].point1;
			pp2 = arcList[posLabel("arc",al)].point2;
			center = pointList[ctr];
			trigo = arcList[posLabel("arc",al)].trigo;
			// calcul du rayon
			var rad = Math.sqrt((point1.x - center.x)**2 + (point1.y - center.y)**2);
			// calcul des angles
			if(point1 == point2){
				var ang0 = 0;
				var ang1 = 2*Math.PI;
				context.arc(center.x,center.y,rad,ang0,ang1);
			} else {
				var ang0 = Math.atan2(point1.y-center.y,point1.x-center.x);
				var ang1 = Math.atan2(point2.y-center.y,point2.x-center.x);
				if ( (trigo == true && n1 == pp1) || (trigo == false && n1 == pp2) ){
					var bool = false;
				} else if ((trigo == false && n2 == pp2 ) || (trigo == true && n2 == pp1 ) ){
					var bool = true;
				}
				context.arc(center.x,center.y,rad,ang0,ang1,bool);
			}
			
		}
	}
	context.closePath()

}


// drawLine dessine une ligne. Cette fonction ne crée pas d'objet ligne.
function drawLine(pos1x,pos1y,pos2x,pos2y,light,selected){
	if(selected == true){
		context.strokeStyle = "#FF8C00";
	} else if (light == true){
		context.strokeStyle = "#FF0000";
	} else {
		context.strokeStyle = "#000000";
	};
	context.beginPath();
	context.setLineDash([]);
	context.moveTo(pos1x,pos1y);
	context.lineTo(pos2x,pos2y);
	context.lineWidth=line_width;
	context.stroke();
}

function drawDotLine(pos1x,pos1y,pos2x,pos2y){
	context.beginPath();
	context.strokeStyle = "#0000FF";
	context.setLineDash([5, 5]);
	context.moveTo(pos1x,pos1y);
	context.lineTo(pos2x,pos2y);
	context.lineWidth=line_width/2;
	context.stroke();
}

function drawCircleArc(point1,point2,center,trigo,light,selected){
	// calcul du rayon
	var rad = Math.sqrt((point1.x - center.x)**2 + (point1.y - center.y)**2);
	// calcul des angles
	if(point1 == point2){
		ang0 = 0;
		ang1 = 2*Math.PI;
	} else {
		if (trigo == true){
			var ang0 = Math.atan2(point1.y-center.y,point1.x-center.x);
			var ang1 = Math.atan2(point2.y-center.y,point2.x-center.x);
		} else if (trigo == false){
			var ang1 = Math.atan2(point1.y-center.y,point1.x-center.x);
			var ang0 = Math.atan2(point2.y-center.y,point2.x-center.x);
		}
	}
	if(selected == true){
		context.strokeStyle = "#FF8C00";
	} else if (light == true){
		context.strokeStyle = "#FF0000";
	} else {
		context.strokeStyle = "#000000";
	};
	context.beginPath();
	context.setLineDash([]);
	context.arc(center.x,center.y,rad,ang0,ang1);
	context.stroke();
}

// updateCanvas permet de visualiser la ligne joignant le dernier point au curseur.
function activeLine(e) {
	if ( mode == "modeMultiLine0" || mode == "modeMultiLine1" ){
		var points = pointList;
	} else if ( mode == "modeArc" ){
		var n = posLabel("point",arcparam[0])
		var  points = [pointList[n]];
	}
	if (points.length > 0){
		var pos = getMousePos(canvas, e);
		var posx = pos.x;
		var posy = pos.y;
		var n = posLabel("point",lastpoint);
		context.strokeStyle = "#000000";
		context.beginPath();
		context.setLineDash([]);
		context.moveTo(pointList[n].x,pointList[n].y);
		var newpos = magnetPositions(posx,posy);
		var posxx = newpos[0];
		var posyy = newpos[1];
		context.lineTo(posxx,posyy);
		context.lineWidth=line_width;
		context.stroke();
		drawDot(posxx,posyy);
	}
}

// clearCanvas efface le canevas et redessine les points et lignes déjà définis.
function clearCanvas(){
	context.clearRect(0,0,canvas.width,canvas.height);
}
function drawCanvas(){
	showSections();
	if(pointList.length > 0){
		var points = pointList;
		for(var i=0;i<points.length;i++){
			points[i].drawPoint();
		}
	}
	if(edgeList.length > 0){
		for(var i =0;i<edgeList.length;i++){
			edgeList[i].drawEdge();
		}
	}
	if(arcList.length > 0){
		for(var i=0;i<arcList.length;i++){
			arcList[i].drawArc();
		}
	}
	showParams();
	showConstraints();
	showLabels();
	showLogos();
	//if(section_list.length>0) showSections();
}

// getMousePos donne la position enregistrée par l'event evt.
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function initPath(){
	path.edgeList = [];
	path.pointList = [];
	path.arcList = [];
	extension = false;
	extparam = [];
	arcparam = [];
	constraints = [];
	constrline.path1 = "";
	constrline.path2 = "";
	constrline.dir = "off";
	horivert = "";
}

function initDraw(){
	extparam = [];
	arcparam = [];
	constrline.path1 = "";
	constrline.path2 = "";
	constrline.dir = "off";
	horivert.dir = "off";
	horivert.label = -1;
}

function saveSection(section){
	var section1 = new Section("section1");
	for (var i=0;i<section.points.length-1;i++){
		section1.edgeList[i] = new Edge(section.points[i],section.points[i+1]);
	}
	section1.pointList = section.points;
	section1.drawSection();
	section1.constraints = constraints;
	shapes[shapes.length]=section1;
}