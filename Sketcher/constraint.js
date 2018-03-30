function Constraint(){
	this.type = "";
	this.light = false;
	this.selected = false;
	this.label = -1;
	this.param = "";
}

function Distance(pt1,pt2,dist){
	Constraint.call(this);
	this.type = "distance";
	this.point1 = pt1;
	this.point2 = pt2;
	this.distance = dist;
}
Distance.prototype = new Constraint;

function DistanceH(pt1,pt2,dist){
	Constraint.call(this);
	this.type = "distanceH";
	this.point1 = pt1;
	this.point2 = pt2;
	this.distance = dist;
}
DistanceH.prototype = new Constraint;

function DistanceV(pt1,pt2,dist){
	Constraint.call(this);
	this.type = "distanceV";
	this.point1 = pt1;
	this.point2 = pt2;
	this.distance = dist;
}
DistanceV.prototype = new Constraint;

function HoriVert(dr,pt1,pt2){
	Constraint.call(this);
	this.type = "horivert";
	this.dir = dr;
	this.point1 = pt1;
	this.point2 = pt2;
}
function EquiLength(pt1,pt2,pt3,pt4){
	Constraint.call(this);
	this.type = "equilength";
	this.point1 = pt1;
	this.point2 = pt2;
	this.point3 = pt3;
	this.point4 = pt4;
}
EquiLength.prototype = new Constraint;

function Angle(pt1,pt2,pt3,ang){
	Constraint.call(this);
	this.type = "angle";
	this.point1 = pt1;
	this.point2 = pt2;
	this.point3 = pt3;
	this.angle = ang;
}
Angle.prototype = new Constraint;

function Gradient(pt1,pt2,grad){
	Constraint.call(this);
	this.type = "gradient";
	this.point1 = pt1;
	this.point2 = pt2;
	this.gradient = grad;
}

function Parallel(pt1,pt2,pt3,pt4){
	Constraint.call(this);
	this.type = "parallel";
	this.point1 = pt1;
	this.point2 = pt2;
	this.point3 = pt3;
	this.point4 = pt4;
}

function Position(pt1,x,y){
	Constraint.call(this);
	this.type = "position";
	this.point1 = pt1;
	this.posx = x;
	this.posy = y;
}

function Align(dir,pt1,pt2){
	Constraint.call(this);
	this.dir = dir;
	this.type = "alignment";
	this.point1 = pt1;
	this.point2 = pt2;
}

function Coincidence(pt1,pt2){
	this.type = "coincidence";
	this.point1 = pt1;
	this.point2 = pt2;
}

//-----------------------------------------------------------//
// posLabelCtr rend la position dans la liste constraintList //
// de la contrainte dont le label est lab.                   //
//-----------------------------------------------------------//
function posLabelCtr(lab){
	var i = 0;
	var pos = -1;
	while(i<constraintList.length){
		if(constraintList[i].label == lab){
			pos = i;
			i = constraintList.length;
		} else {
			i++;
		}
	}
	return pos;
}
//------------------------------------------------------------//
// editConstraint édite la contrainte sélectionnée.           //
// lab est le label de cette contrainte.                      //
//------------------------------------------------------------//
function editConstraint(lab){
	var c0 = posLabelCtr(lab);
	if(constraintList[c0].type == "distance"){
		var newlstr = prompt("Enter new length","");
		var newl = parseFloat(newlstr);
		constraintList[c0].distance = newl;
	} else if(constraintList[c0].type == "angle"){
		var newastr = prompt("Enter new angle","");
		var newa = parseFloat(newastr);
		constraintList[c0].angle = newa;
	} 
	updateSketch();
}

//--------------------------------------------------------------//
// deleteConstraint supprime la constrainte sélectionnée.       //
// lab est le label de cette contrainte.                        //
//--------------------------------------------------------------//
function deleteConstraint(lab){
	var c0 = posLabelCtr(lab);
	var elems = constraintElem(c0);
	for(var i=0;i<elems[1].length;i++){
		var pe = elems[1][i]
		for(var j=0;j<edgeList[pe].constraints.length;j++){
			if(edgeList[pe].constraints[j] == lab){
				edgeList[pe].constraints.splice(j,1);
			}
		}
	}
	for(var i=0;i<elems[0].length;i++){
		var pe = elems[0][i];
		for(var j=0;j<pointList[pe].constraints.length;j++){
			if(pointList[pe].constraints[j] == lab){
				pointList[pe].constraints.splice(j,1);
			}
		}
	}
	selected_ctr = -1;
	constraintList.splice(c0,1);
	updateSketch();
}

//---------------------------------------------------------------//
// selectConstraint définie les actions lorsqu'on clique sur une //
// contrainte texte. lab est le label de cette contrainte.       //
//---------------------------------------------------------------//
function selectConstraint(lab){
	var cl0 = onTextConstraint(event)[1];
	var c0;
	if(selected_ctr==-1){
		selected_ctr = cl0;
		c0 = posLabelCtr(cl0);
		constraintList[c0].selected = true;
		constraintList[c0].light = true;
		lightCtrElem(c0);
	} else {
		if(onTextConstraint(event)[1]==selected_ctr){
			editConstraint(cl0);
		} else {
			c0 = posLabelCtr(selected_ctr);
			constraintList[c0].selected = false;
			constraintList[c0].light = false;
			selected_ctr = -1;
		}
	}
}

//-------------------------------------------------------------------//
// unSelectCtr déselectionne la contrainte sélectionnée précédemment //
//-------------------------------------------------------------------//
function unSelectCtr(){
	if(selected_ctr != -1){
		var c0 = posLabelCtr(selected_ctr);
		constraintList[c0].light = false;
		constraintList[c0].selected = false;
	}
}

//-------------------------------------------------------------------//
// lightCtrElem éclaire les éléments concernés par la contrainte i.  //
// i est la position de la contrainte dans constraintList            //
//-------------------------------------------------------------------//
function lightCtrElem(i){ 
	var elems = constraintElem(i);
	var ctrP = elems[0];
	var ctrE = elems[1];
	var ctrA = elems[2];
	for(var j =0;j<ctrP.length;j++){
		pointList[ctrP[j]].light = true;
	}
	for(var j =0;j<ctrE.length;j++){
		edgeList[ctrE[j]].light = true;
	}
	for(var j =0;j<ctrA.length;j++){
		arcList[ctrA[j]].light = true;
	}
}
//--------------------------------------------------------------------------//
// constraintElem rend la POSITION dans leur liste respective des éléments  //
// concernés par la contrainte.                                             //
// i est la position de la contrainte dans constraintList                   //
//--------------------------------------------------------------------------//
function constraintElem(i){ 
	var ctrPoints = [];
	var ctrEdges = [];
	var ctrArcs = [];
	if(constraintList[i].type == "distance" || constraintList[i].type == "distanceH" || constraintList[i].type == "distanceV"){
		var e1 = edgeFromPoints(constraintList[i].point1,constraintList[i].point2);
		var pe1 = posLabel("edge",e1);
		var pp1 = posLabel("point",constraintList[i].point1);
		var pp2 = posLabel("point",constraintList[i].point2);
		ctrPoints.push(pp1);
		ctrPoints.push(pp2);
		if(pe1 != -1) ctrEdges.push(pe1);
	} else if(constraintList[i].type == "angle" ){
		var e1 = edgeFromPoints(constraintList[i].point1,constraintList[i].point2);
		var e2 = edgeFromPoints(constraintList[i].point3,constraintList[i].point2);
		if(e1 != -1){ 
			var pe1 = posLabel("edge",e1);
			ctrEdges.push(pe1);
		}
		if(e2 != -1){
			var pe2 = posLabel("edge",e2);
			ctrEdges.push(pe2);
		}
		ctrPoints.push(constraintList[i].point1);
		ctrPoints.push(constraintList[i].point2);
		ctrPoints.push(constraintList[i].point3);
	} else if(constraintList[i].type == "gradient" ){
		var e1 = edgeFromPoints(constraintList[i].point1,constraintList[i].point2);
		if(e1 != -1){ 
			var pe1 = posLabel("edge",e1);
			ctrEdges.push(pe1);
		}
		ctrPoints.push(constraintList[i].point1);
		ctrPoints.push(constraintList[i].point2);
	} else if (constraintList[i].type == "equilength"){
		var e1 = edgeFromPoints(constraintList[i].point1,constraintList[i].point2);
		var e2 = edgeFromPoints(constraintList[i].point3,constraintList[i].point4);
		var pe1 = posLabel("edge",e1);
		var pe2 = posLabel("edge",e2);
		if(pe1 != -1) ctrEdges.push(pe1);
		if(pe2 != -1) ctrEdges.push(pe2);
		var n1 = posLabel("point",constraintList[i].point1);
		var n2 = posLabel("point",constraintList[i].point2);
		var n3 = posLabel("point",constraintList[i].point3);
		var n4 = posLabel("point",constraintList[i].point4);
		ctrPoints.push(n1);
		ctrPoints.push(n2);
		ctrPoints.push(n3);
		ctrPoints.push(n4);
	} else if (constraintList[i].type == "horivert"){
		var e1 = edgeFromPoints(constraintList[i].point1,constraintList[i].point2);
		var pe1 = posLabel("edge",e1);
		edgeList[pe1].light = true;
		ctrEdges.push(pe1);
	} else if (constraintList[i].type == "alignment" || constraintList[i].type == "coincidence"){
		ctrPoints.push(constraintList[i].point1);
		ctrPoints.push(constraintList[i].point2);
	} 
	return[ctrPoints,ctrEdges,ctrArcs];
}

//-------------------------------------------------------//
//   showConstraints affiche les contraintes en haut     //
//   à gauche sur le canevas                             //
//-------------------------------------------------------//
function showConstraints(){
	var ww = 20;
	var hh = 20;
	var e1, e2;
	for(var i=0;i<constraintList.length;i++){
		if(constraintList[i].param == false){
			var str = "off";
			if(constraintList[i].light == false){
				context.fillStyle = "#000000";
				context.font = "bold 12px Arial";
			} else {
				context.fillStyle = "#FF0000";
				context.font = "bold 12px Arial";
			}
			
			if(constraintList[i].type == "distance"){
				str = "Distance  P"+constraintList[i].point1+", P"+constraintList[i].point2+", L="+constraintList[i].distance;
			} else if(constraintList[i].type == "angle"){
				str = "Angle  P"+constraintList[i].point1+", P"+constraintList[i].point2+", P"+constraintList[i].point3+", \u03B8="+constraintList[i].angle+"\xB0";
			} else if(constraintList[i].type == "gradient"){
				e1 = edgeFromPoints(constraintList[i].point1,constraintList[i].point2);
				str = "Gradient  E"+e1+", grad="+constraintList[i].gradient+"%";
			} else if(constraintList[i].type == "equilength"){
				str = "Equilength  ";
				e1 = edgeFromPoints(constraintList[i].point1,constraintList[i].point2);
				if(e1 != -1){
					str += " E"+e1;
				} else {
					str += " P"+constraintList[i].point1+" P"+constraintList[i].point2
				}
				e2 = edgeFromPoints(constraintList[i].point3,constraintList[i].point4);
				if(e2 != -1){
					str += " E"+e2;
				} else {
					str += " P"+constraintList[i].point3+" P"+constraintList[i].point4;
				}
			} else if (constraintList[i].type == "horivert"){
				e1 = edgeFromPoints(constraintList[i].point1,constraintList[i].point2);
				if(constraintList[i].dir == "h"){
					str = "Hori  E"+e1;
				} else if(constraintList[i].dir == "v"){
					str = "Vert  E"+e1;
				}
			} else if (constraintList[i].type == "alignment"){
				str = "Align "+constraintList[i].dir+"  P"+constraintList[i].point1 +", P"+constraintList[i].point2;
			} else if (constraintList[i].type == "coincidence"){
				str = "Coincide  P"+constraintList[i].point1+", P"+constraintList[i].point2;
			}
			if(str != "off"){
				context.fillText(str,ww,hh);
				hh = hh + 20;
			}
		}
	}
}

//-------------------------------------------------//
//    edgeFromPoints renvoie le label de l'edge    //
//    correspondant aux labels des points p1 et p2 //
//-------------------------------------------------//
function edgeFromPoints(p1,p2){
	var edge1 = -1;
	for(var j =0;j<edgeList.length;j++){
		if(edgeList[j].point1 == p1 && edgeList[j].point2 == p2){
			edge1 = edgeList[j].label;
		} else if(edgeList[j].point1 == p2 && edgeList[j].point2 == p1){
			edge1 = edgeList[j].label;
		}
	}
	return edge1;
}

//-------------------------------------------------//
//    edgeFromPoints renvoie le label des edges    //
//    correspondant au label du point p1.          //
//-------------------------------------------------//
function edgesFromPoint(p1){
	var edges = [];
	for(var j =0;j<edgeList.length;j++){
		if(edgeList[j].point1 == p1 || edgeList[j].point2 == p1){
			edges.push(edgeList[j].label);
		}
	}
	return edges;
}

//-------------------------------------------------//
//    arcFromPoints renvoie le label de l'arc      //
//    correspondant aux labels des points p1 et p2 //
//-------------------------------------------------//
function arcFromPoints(p1,p2){
	var arc1 = -1;
	for(var j =0;j<arcList.length;j++){
		if(arcList[j].point1 == p1 && arcList[j].point2 == p2){
			arc1 = arcList[j].label;
		} else if(arcList[j].point1 == p2 && arcList[j].point2 == p1){
			arc1 = arcList[j].label;
		}
	}
	return arc1;
}