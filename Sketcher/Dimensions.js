
function Dimension(val){
	this.type = "";
	this.value = val;
	this.show = "off";
}

function DimLine (ishape,iedge,val){
	this.offset = 5;
	this.type = "distance";
	this.shapeNum = ishape;
	this.edgeNum = iedge;
	this.value = val;
}
DimLine.prototype = new Dimension;

function DimAngle(ishape,iedge1,iedge2,val){
	this.type = "angle";
	this.shapeNum = ishape;
	this.edgeNum1 = iedge1;
	this.edgeNum2 = iedge2;
	this.value = val;
}
DimAngle.prototype = new Dimension;

function DimEquiLength(ishape,iedge,val){
	this.type = "equilength";
	this.shapeNum = ishape;
	this.edgeNum = iedge;
	this.value = val;
}
DimEquiLength.prototype = new Dimension;

function DimParallel(ishape,iedge1,iedge2){
	this.type = "parallel";
	this.shapeNum = ishape;
	this.edgeNum1 = iedge1;
	this.edgeNum2 = iedge2;
}
DimParallel.prototype = new Dimension;

DimLine.prototype.drawDimLine = function(){
	var edge1 = shapes[this.shapeNum].edgeList[this.edgeNum];
	if(this.edgeNum != shapes[this.shapeNum].edgeList.length-1){
		var edge2 = shapes[this.shapeNum].edgeList[this.edgeNum+1];
	} else {
		var edge2 = shapes[this.shapeNum].edgeList[0];
	}
	var u1 = edge1.point2.x - edge1.point1.x;
	var u2 = edge1.point2.y - edge1.point1.y;
	var uu = Math.sqrt(u1**2 + u2**2);
	u1 = u1/uu;
	u2 = u2/uu;
	var v1 = edge2.point2.x - edge2.point1.x;
	var v2 = edge2.point2.y - edge2.point1.y;
	var vv = Math.sqrt(v1**2 + v2**2);
	v1 = v1/vv;
	v2 = v2/vv;
	var prodvect = u1*v2 - u2*v1;
	context.strokeStyle = "#696969";
	context.beginPath();
	context.setLineDash([]);
	context.lineWidth = 2;
	if (prodvect <= 0){
		var p1 = {x: edge1.point1.x-5*u2,y:edge1.point1.y+5*u1};
		var p2 = {x: edge1.point2.x-5*u2,y:edge1.point2.y+5*u1};
		context.moveTo(p1.x,p1.y);
		p1 = {x: edge1.point1.x-20*u2,y:edge1.point1.y+20*u1};
		context.lineTo(p1.x,p1.y);
		context.stroke();
		context.moveTo(p2.x,p2.y);
		p2 = {x: edge1.point2.x-20*u2,y:edge1.point2.y+20*u1};
		context.lineTo(p2.x,p2.y);
		context.stroke();
		p1 = {x: edge1.point1.x-15*u2,y:edge1.point1.y+15*u1};
		p2 = {x: edge1.point2.x-15*u2,y:edge1.point2.y+15*u1};
		drawArrow(p1.x,p1.y,p2.x,p2.y);
		context.font = "15px Arial";
		context.fillText(this.value,0.5*(p1.x+p2.x)-10*u2,0.5*(p1.y+p2.y)+10*u1);
	} else {
		var p1 = {x: edge1.point1.x+5*u2,y:edge1.point1.y-5*u1};
		var p2 = {x: edge1.point2.x+5*u2,y:edge1.point2.y-5*u1};
		context.moveTo(p1.x,p1.y);
		p1 = {x: edge1.point1.x+20*u2,y:edge1.point1.y-20*u1};
		context.lineTo(p1.x,p1.y);
		context.stroke();
		context.moveTo(p2.x,p2.y);
		p2 = {x: edge1.point2.x+20*u2,y:edge1.point2.y-20*u1};
		context.lineTo(p2.x,p2.y);
		context.stroke();
		p1 = {x: edge1.point1.x+15*u2,y:edge1.point1.y-15*u1};
		p2 = {x: edge1.point2.x+15*u2,y:edge1.point2.y-15*u1};
		drawArrow(p1.x,p1.y,p2.x,p2.y);
		context.font = "15px Arial";
		context.fillText(this.value,0.5*(p1.x+p2.x)+10*u2,0.5*(p1.y+p2.y)-10*u1);
	}	
}

DimAngle.prototype.drawDimAngle = function(){
	var rad0 = 20;
	var edge1 = shapes[this.shapeNum].edgeList[this.edgeNum1];
	var edge2 = shapes[this.shapeNum].edgeList[this.edgeNum2];
	var u1 = edge1.point1.x - edge1.point2.x;
	var u2 = edge1.point2.y - edge1.point1.y;
	var uu = Math.sqrt(u1**2 + u2**2);
	u1 = u1/uu;
	u2 = u2/uu;
	var v1 = edge2.point2.x - edge2.point1.x;
	var v2 = edge2.point2.y - edge2.point1.y;
	var vv = Math.sqrt(v1**2 + v2**2);
	v1 = v1/vv;
	v2 = v2/vv;
	// identification du noeud commun
	if ((edge1.point1.x == edge2.point2.x) && (edge1.point1.y == edge2.point2.y)){
		var p0 = {x:edge1.point1.x, y:edge1.point1.y}
	} else if ((edge1.point2.x == edge2.point1.x) && (edge1.point2.y == edge2.point1.y)){
		var p0 = {x:edge1.point2.x, y:edge1.point2.y}
	}
	// calcul du sens de définition de la Section (clockwise,counter-clockwise)
	var tot = 0;
	var u, v;
	for(var i=0;i<shapes[this.shapeNum].edgeList.length-1;i++){
		u = {x: shapes[this.shapeNum].edgeList[i].point2.x - shapes[this.shapeNum].edgeList[i].point1.x, y:shapes[this.shapeNum].edgeList[i].point2.y - shapes[this.shapeNum].edgeList[i].point1.y};
		v = {x: shapes[this.shapeNum].edgeList[i+1].point2.x - shapes[this.shapeNum].edgeList[i+1].point1.x, y:shapes[this.shapeNum].edgeList[i+1].point2.y - shapes[this.shapeNum].edgeList[i+1].point1.y};
		tot += u.x*v.y - u.y*v.x;
	}
	u = {x: shapes[this.shapeNum].edgeList[shapes[this.shapeNum].edgeList.length-1].point2.x - shapes[this.shapeNum].edgeList[shapes[this.shapeNum].edgeList.length-1].point1.x, y:shapes[this.shapeNum].edgeList[shapes[this.shapeNum].edgeList.length-1].point2.y - shapes[this.shapeNum].edgeList[shapes[this.shapeNum].edgeList.length-1].point1.y};
	v = {x: shapes[this.shapeNum].edgeList[0].point2.x - shapes[this.shapeNum].edgeList[0].point1.x, y:shapes[this.shapeNum].edgeList[0].point2.y - shapes[this.shapeNum].edgeList[0].point1.y};
	tot += u.x*v.y - u.y*v.x;
	// Calcul de l'angle entre les deux Edges
	if (tot >= 0){
		if(this.edgeNum1+1==this.edgeNum2 || this.edgeNum2==0){
			var ang0 = Math.atan2(v2,v1);
			var ang1 = -Math.atan2(u2,u1);
			
		} else {
			var ang1 = -Math.PI+Math.atan2(v2,v1);
			var ang0 = Math.PI-Math.atan2(u2,u1);
		}
	} else {
		if(this.edgeNum1+1==this.edgeNum2 || this.edgeNum2==0){
			var ang1 = Math.atan2(v2,v1);
			var ang0 = -Math.atan2(u2,u1);
		} else {
			var ang0 = -Math.PI+Math.atan2(v2,v1);
			var ang1 = Math.PI-Math.atan2(u2,u1);
		}
	}
	
	context.beginPath();
	context.strokeStyle = "#000000";
	context.lineWidth = 2;
	context.arc(p0.x,p0.y,rad0,ang0,ang1);
	context.stroke();
	if(ang1<ang0){
		ang1 += 2*Math.PI;
	}
	var angtext = 0.5*(ang0+ang1);
	var offsetx = 40*Math.cos(angtext);
	var offsety = 40*Math.sin(angtext);
	context.font = "15px Arial";
	context.fillText(this.value+"\xB0",p0.x+offsetx,p0.y+offsety);
}


DimEquiLength.prototype.drawEquiLength = function(){
	// calcul des coordonnées du milieu de l'Edges
	var pt1 = shapes[this.shapeNum].edgeList[this.edgeNum].point1;
	var pt2 = shapes[this.shapeNum].edgeList[this.edgeNum].point2;
	var u = {x:pt2.x-pt1.x,y:pt2.y-pt1.y};
	var uu = Math.sqrt(u.x**2 + u.y**2);
	u.x = u.x/uu, u.y = u.y/uu;
	var a = Math.sqrt(3)/2;
	var b = 10;
	var s = 5;
	var mid = {x:0.5*(pt1.x + pt2.x), y:0.5*(pt1.y + pt2.y)};
	context.beginPath();
	context.lineWidth = 2;
	context.strokeStyle = "#000000";
	for(var k=0;k<this.value;k++){
		context.moveTo(mid.x+k*s*u.x+b*a*u.x-b*a*u.y,mid.y+k*s*u.y+b*a*u.x+b*a*u.y);
		context.lineTo(mid.x+k*s*u.x-b*a*u.x+b*a*u.y,mid.y+k*s*u.y-b*a*u.x-b*a*u.y);
		context.stroke();
	}
}

DimParallel.prototype.drawParallel = function(){
	var num = [this.edgeNum1,this.edgeNum2];
	for(var i=0;i<2;i++){
		var pt1 = shapes[this.shapeNum].edgeList[num[i]].point1;
		var pt2 = shapes[this.shapeNum].edgeList[num[i]].point2;
		var u = {x:pt2.x-pt1.x,y:pt2.y-pt1.y};
		var uu = Math.sqrt(u.x**2 + u.y**2);
		u.x = u.x/uu, u.y = u.y/uu;
		var a = Math.sqrt(3)/2;
		var b = 5;
		var s = 5;
		var mid = {x:0.75*pt1.x + 0.25*pt2.x, y:0.75*pt1.y + 0.25*pt2.y};
		context.beginPath();
		context.lineWidth = 2;
		context.strokeStyle = "#000000";
		context.moveTo(mid.x-b*u.x-s*u.y,mid.y-b*u.y+s*u.x);
		context.lineTo(mid.x+2*b*u.x-s*u.y,mid.y+2*b*u.y+s*u.x);
		context.stroke();
		context.moveTo(mid.x-b*u.x+s*u.y,mid.y-b*u.y-s*u.x);
		context.lineTo(mid.x+2*b*u.x+s*u.y,mid.y+2*b*u.y-s*u.x);
		context.stroke();
		mid = {x:0.25*pt1.x + 0.75*pt2.x, y:0.25*pt1.y + 0.75*pt2.y};
		context.beginPath();
		context.lineWidth = 2;
		context.strokeStyle = "#000000";
		context.moveTo(mid.x-b*u.x-s*u.y,mid.y-b*u.y+s*u.x);
		context.lineTo(mid.x+2*b*u.x-s*u.y,mid.y+2*b*u.y+s*u.x);
		context.stroke();
		context.moveTo(mid.x-b*u.x+s*u.y,mid.y-b*u.y-s*u.x);
		context.lineTo(mid.x+2*b*u.x+s*u.y,mid.y+2*b*u.y-s*u.x);
		context.stroke();
	}
}

//---------------------------------------------------------------//
// showDimensions affiche les dimensions et cotes sur le canevas //
//---------------------------------------------------------------//
function showDimensions(){
	if(showDim == "off"){
		for (j=0;j<shapes.length;j++){
			for(i=0;i<shapes[j].dimensions.length;i++){
				if(shapes[j].dimensions[i].type == "distance"){
					shapes[j].dimensions[i].drawDimLine();
				} else if (shapes[j].dimensions[i].type == "angle"){
					shapes[j].dimensions[i].drawDimAngle();
				} else if (shapes[j].dimensions[i].type == "equilength"){
					shapes[j].dimensions[i].drawEquiLength();
				} else if (shapes[j].dimensions[i].type == "parallel"){
					shapes[j].dimensions[i].drawParallel();
				};
			}
		};
		showDim = "on";
	} else {
		clearCanvas();
		for (j=0;j<shapes.length;j++){
			shapes[j].drawSection();
		}
		showDim = "off";
		showParams();
	};
}

//------------------------------------------------------------//
// drawArrow dessine une flèche entre les points pos1 et pos2 //
//------------------------------------------------------------//
function drawArrow(pos1x,pos1y,pos2x,pos2y){
	var dir0x = (pos1x-pos2x)/Math.sqrt((pos1x-pos2x)**2+(pos1y-pos2y)**2);
	var dir0y = (pos1y-pos2y)/Math.sqrt((pos1x-pos2x)**2+(pos1y-pos2y)**2);
	var dir_p30 = {x: Math.sqrt(3)/2*dir0x+0.5*dir0y,y: -0.5*dir0x+Math.sqrt(3)/2*dir0y};
	var dir_m30 = {x: Math.sqrt(3)/2*dir0x-0.5*dir0y,y: 0.5*dir0x+Math.sqrt(3)/2*dir0y};
	
	context.strokeStyle = "#696969";
	context.fillStyle = "#696969";
	context.beginPath();
	context.setLineDash([]);
	context.moveTo(pos1x,pos1y);
	context.lineTo(pos2x,pos2y);
	context.lineWidth=2;
	context.stroke();
	context.moveTo(pos2x,pos2y);
	context.lineTo(pos2x+5*dir_p30.x,pos2y+5*dir_p30.y);
	context.lineTo(pos2x+5*dir_m30.x,pos2y+5*dir_m30.y);
	context.lineTo(pos2x,pos2y);
	context.stroke();
	context.fill();
	context.moveTo(pos1x,pos1y);
	context.lineTo(pos1x-5*dir_p30.x,pos1y-5*dir_p30.y);
	context.lineTo(pos1x-5*dir_m30.x,pos1y-5*dir_m30.y);
	context.lineTo(pos1x,pos1y);
	context.stroke();
	context.fill();
}

