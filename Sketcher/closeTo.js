//----------------------------------------------------------------//
//            détection de la proximité d'un Point                //
//----------------------------------------------------------------//
function closePoint(e){
	var dist;
	var pos = getMousePos(canvas,e);
	var posx = pos.x;
	var posy = pos.y;
	var points = pointList;
	// section courante
	for(var i=0;i<pointList.length;i++){
		dist = Math.sqrt( ( posx - pointList[i].x )**2 + ( posy - pointList[i].y )**2 );
		if (pointList[i].light == false && pointList[i].selected == false){
			if( dist < radius ) {
				context.fillStyle = "#FF0000";
				context.beginPath();
				//context.arc(pointList[i].x, pointList[i].y, 5, 0, 2*Math.PI);
				context.fill();
				pointList[i].light = true;
				for(var j=0;j<pointList[i].constraints.length;j++){
					c0 = posLabelCtr(pointList[i].constraints[j]);
					if(constraintList[c0].selected == false){
						constraintList[c0].light = true;
					};
				};
			} ;
		} else if (pointList[i].light == true && pointList[i].selected == false){
			if( dist > radius ) {
				context.fillStyle = "#000000";
				context.beginPath();
				//context.arc(pointList[i].x, pointList[i].y, 5, 0, 2*Math.PI);
				context.fill();
				pointList[i].light = false;
				for(var j=0;j<pointList[i].constraints.length;j++){
					c0 = posLabelCtr(pointList[i].constraints[j]);
					if(constraintList[c0].selected == false){
						constraintList[c0].light = false;
					};
				};
			}
		}
	}
}
//----------------------------------------------------------------//
//            détection de la proximité d'un Edge                 //
//----------------------------------------------------------------//
function closeLine(e){
	var dist;
	var pos = getMousePos(canvas,e);
	var posx = pos.x;
	var posy = pos.y;
	var delta = 0.05;
	var c0;
	
	for(var i=0;i<edgeList.length;i++){
		
		if (edgeList[i].light == false && edgeList[i].selected == false){
			if ( closeToEdge(posx,posy,i) ){
				edgeList[i].light = true;
				//edgeList[i].drawEdge();
				for(var j=0;j<edgeList[i].constraints.length;j++){
					c0 = posLabelCtr(edgeList[i].constraints[j]);
					if(constraintList[c0].selected == false){
						constraintList[c0].light = true;
					};
				};
				for(var j=0;j<edgeList[i].parameters.length;j++){
					p0 = posLabelParam(edgeList[i].parameters[j]);
					if(parameterList[p0].selected == false){
						parameterList[p0].light = true;
					}
				}
				//clearCanvas();
			}
		} else if (edgeList[i].light == true && edgeList[i].selected == false){
			if ( !closeToEdge(posx,posy,i) ){
				edgeList[i].light = false;
				//edgeList[i].drawEdge();
				for(var j=0;j<edgeList[i].constraints.length;j++){
					c0 = posLabelCtr(edgeList[i].constraints[j]);
					if(constraintList[c0].selected == false){
						constraintList[c0].light = false;
					};
				};
				for(var j=0;j<edgeList[i].parameters.length;j++){
					p0 = posLabelParam(edgeList[i].parameters[j]);
					if(parameterList[p0].selected == false){
						parameterList[p0].light = false;
					};
				}
				//clearCanvas();
			}
		}
	}
}

function closeToEdge(posx,posy,i){
	var delta = 0.05;
	var n1 = posLabel("point",edgeList[i].point1);
	var n2 = posLabel("point",edgeList[i].point2);
	var x1 = pointList[n1].x;
	var y1 = pointList[n1].y;
	var x2 = pointList[n2].x;
	var y2 = pointList[n2].y;
	
	if (x1 != x2){
		var a = (y2-y1)/(x2-x1);
		var b = ( y1 * x2 - y2 * x1 ) / ( x2 - x1 );
		dist = Math.abs(posy - a*posx - b)/Math.sqrt( 1 + a**2 );
			
		var projx = ( ( posx + a * posy ) - a * b ) / ( 1 + a**2 );
		var projy = ( a * ( posx + a * posy ) + b ) / ( 1 + a**2 );
	} else {
		var projx = x1;
		var projy = posy;
		dist = Math.abs(x1 - posx);
	}
	var x1r = x1 + delta*(x2-x1);
	var y1r = y1 + delta*(y2-y1);
	var x2r = x2 + delta*(x1-x2);
	var y2r = y2 + delta*(y1-y2);
	var length0 = Math.sqrt((projy-y1r)**2+(projx-x1r)**2) + Math.sqrt((projy-y2r)**2+(projx-x2r)**2);
	var lengthEdge = Math.sqrt( ( y2r - y1r )**2 + ( x2r - x1r )**2 );
	if (length0 < lengthEdge + radius && dist < radius ){
		return true;
	} else {
		return false;
	}
}

function closeToEdgeList(posx,posy,elist){
	res = false
	var i = 0;
	while(i<elist.length){
		if(closeToEdge(posx,posy,elist[i])){
			res = true;
			i = elist.length+1;
		} else {
			i++;
		}
	}
	return res;
}

function closeToPointList(posx,posy,elist){
	var n;
	res = false
	var i = 0;
	while(i<elist.length){
		n = posLabel("point",elist[i]);
		dist = Math.sqrt( ( posx - pointList[n].x )**2 + ( posy - pointList[n].y )**2 );
		if(dist < radius){
			res = true;
			i = elist.length+1;
		} else {
			i++;
		}
	}
	return res;
}

//----------------------------------------------------------------//
//            détection de la proximité d'un Arc                  //
//----------------------------------------------------------------//

function closeArc(e){
	var pos = getMousePos(canvas,e);
	var posx = pos.x;
	var posy = pos.y;

	for(var i=0;i<arcList.length;i++){
		if(arcList[i].light == false && arcList[i].selected == false){
			if(closeToArc(posx,posy,i)){
				arcList[i].light = true;
				arcList[i].drawArc();
			}
		} else if (arcList[i].light == true && arcList[i].selected == false){
			if(!(closeToArc(posx,posy,i))){
				arcList[i].light = false;
				arcList[i].drawArc();
			}
		}
	}
}


function closeToArc(posx,posy,i){
	var n1, n2, nc, ang0, ang1, angpt, radarc, radpt;
	var delta = 5;
	
	n1 = posLabel("point",arcList[i].point1);
	n2 = posLabel("point",arcList[i].point2);
	nc = posLabel("point",arcList[i].center);
	angpt = Math.atan2(posy-pointList[nc].y,posx-pointList[nc].x);
	radarc = Math.sqrt((pointList[n1].x-pointList[nc].x)**2 + (pointList[n1].y-pointList[nc].y)**2);
	radpt = Math.sqrt((posx-pointList[nc].x)**2 + (posy-pointList[nc].y)**2);
	if(Math.abs(radpt-radarc)<delta){
		if (arcList[i].trigo == true){
			ang0 = Math.atan2(pointList[n1].y-pointList[nc].y,pointList[n1].x-pointList[nc].x);
			ang1 = Math.atan2(pointList[n2].y-pointList[nc].y,pointList[n2].x-pointList[nc].x);
		} else if (arcList[i].trigo == false){
			ang1 = Math.atan2(pointList[n1].y-pointList[nc].y,pointList[n1].x-pointList[nc].x);
			ang0 = Math.atan2(pointList[n2].y-pointList[nc].y,pointList[n2].x-pointList[nc].x);
		}
		if(ang0 <= ang1){
			if((angpt >= ang0 && angpt <= ang1)){
				return true;
			} else {
				return false;
			}
		} else if (ang0 >= ang1){
			if((angpt >= ang0 && angpt <= ang1+2*Math.PI) || (angpt >= ang0-2*Math.PI && angpt <= ang1)){
				return true;
			} else {
				return false;
			}
		}
	}
}

//----------------------------------------------------------//
//  closeConstraint: action lors du passage de la souris    // 
//  sur une contrainte texte                                //
//----------------------------------------------------------//
function closeConstraint(e){
	var pos = getMousePos(canvas,e);
	var posx = pos.x;
	var posy = pos.y;
	var j = 0;
	for(var i=0;i<constraintList.length;i++){
		if(constraintList[i].param == ""){
			if(constraintList[i].light == false && constraintList[i].selected == false){
				if(closeToConstraint(posx,posy,j)){
					constraintList[i].light = true;
					lightCtrElem(i);
					i = constraintList.length;
				}
			} else if(constraintList[i].light == true && constraintList[i].selected == false){
				var elems = constraintElem(i);
				if(!closeToConstraint(posx,posy,j) && !closeToEdgeList(posx,posy,elems[1]) && !closeToPointList(posx,posy,elems[0])){
					constraintList[i].light = false;
				}
			}
			j += 1;
		}
	}
	//clearCanvas();
}
//-------------------------------------------------//
//  closeToConstraint: booléen true si on près de  //
//  la contrainte texte i                          //
//-------------------------------------------------//
function closeToConstraint(posx,posy,i){
	var hh = 0;
	var bool1 = (posx<=200 && posx>=20);
	var bool2 = (posy<=hh+(i+1)*20 && posy>=hh+i*20);
	if(bool1 && bool2){
		return true;
	} else {
		return false;
	}
}
//-----------------------------------------------//
//  closeToConstraint: booléen true si on près   //
//  d'une contrainte texte                       //
//-----------------------------------------------//
function onTextConstraint(e){
	var pos = getMousePos(canvas,e);
	var posx = pos.x;
	var posy = pos.y;
	var i = 0;
	var res = [];
	res[0] = false, res[1] = -1;
	while(i<constraintList.length){
		if(closeToConstraint(posx,posy,i)){
			res[0] = true;
			res[1] = constraintList[i].label;
			i = constraintList.length;
		} else {
			i++;
		}
	}
	return res;
}

//-----------------------------------------------------//
//  closeParam: action lors du passage de la souris    // 
//  sur un paramètre texte                             //
//-----------------------------------------------------//
function closeParameter(e){
	var pos = getMousePos(canvas,e);
	var posx = pos.x;
	var posy = pos.y;
	for(var i=0;i<parameterList.length;i++){
		if(parameterList[i].light == false && parameterList[i].selected == false){
			if(closeToParameter(posx,posy,i)){
				parameterList[i].light = true;
				lightParamElem(i);
				i = parameterList.length;
			}
		} else if(parameterList[i].light == true && parameterList[i].selected == false){
			var elems = parameterElem(i);
			if(!closeToParameter(posx,posy,i) && !closeToEdgeList(posx,posy,elems[1])){
				parameterList[i].light = false;
			}
		}
	}
	//clearCanvas();
}
//-------------------------------------------------//
//  closeToConstraint: booléen true si on près de  //
//  la contrainte texte i                          //
//-------------------------------------------------//
function closeToParameter(posx,posy,i){
	var hh = 0;
	var bool1 = (posx<=canvas.width && posx>=canvas.width-150);
	var bool2 = (posy<=hh+(i+1)*20 && posy>=hh+i*20);
	if(bool1 && bool2){
		return true;
	} else {
		return false;
	}
}

//-----------------------------------------------//
//  closeToConstraint: booléen true si on près   //
//  d'une contrainte texte                       //
//-----------------------------------------------//
function onTextParameter(e){
	var pos = getMousePos(canvas,e);
	var posx = pos.x;
	var posy = pos.y;
	var i = 0;
	var res = [];
	res[0] = false, res[1] = -1;
	while(i<parameterList.length){
		if(closeToParameter(posx,posy,i)){
			res[0] = true;
			res[1] = parameterList[i].label;
			i = parameterList.length;
		} else {
			i++;
		}
	}
	return res;
}
