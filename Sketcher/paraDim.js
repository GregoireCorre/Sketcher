
function Parameter(name,val){
	this.name = name;
	this.value = val;
	this.type = "";
	this.edgelist = []; 
	this.light = false;
	this.selected = false;
}

function modeParaLength(){
	mode = "modeParaLength";
	showButtons();
}

function modeParaAngle(){
	mode = "modeParaAngle1";
	showButtons();
}

function modeEditPara(){
	mode = "modeEditPara";
}

function paraLength(e){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	var dist;
	var delta = 0.05;
	var error = 0;
	var pp;
	var lengthEdge;
	var j = 0, i = 0;
	while (i<edgeList.length){
		if (closeToEdge(posx,posy,i)){
			var var_str = prompt("Enter the variable name:", "");
			var k = 0
			while(k<parameterList.length){
				if (var_str == parameterList[k].name){
					lengthEdge = parameterList[k].value;
					parameterList[k].edgelist.push(edgeList[i].label);
					edgeList[i].parameters.push(parameterList[k].label);
					pp = k;
					k = parameterList.length + 1;
				} else {
					k++;
				}
			}
			if (k == parameterList.length){
				pp = k;
				var length_str = prompt("Enter the distance value:","");
				var lengthEdge = parseFloat(length_str);
				if (isNaN(lengthEdge) || lengthEdge <= 0){
					alert("Come on... Try again.");
					error = 1;
				} else {
					parameterList[pp] = new Parameter(var_str,lengthEdge);
					parameterList[pp].type = "distance";
					parameterList[pp].edgelist.push(edgeList[i].label);
					parameterList[pp].label = labelparameter;
					edgeList[i].parameters.push(labelparameter);
					labelparameter += 1;
				}
			}
			if (error == 0){
				// on cherche d'abord si une longueur n'a pas déjà été affectée à cet Edge
				for(k=0;k<edgeList[i].constraints.length;k++){
					var ind = edgeList[i].constraints[k];
					var pc = posLabelCtr(ind);
					if(constraintList[pc].type == "distance"){
						constraintList[pc].distance = lengthEdge;
						k = constraintList.length + 1;
					} 
				}
				// Sinon, on attribue une nouvelle contrainte "distance" à cet Edge
				if(k==edgeList[i].constraints.length){
					constraintList[constraintList.length] = new Distance(edgeList[i].point1,edgeList[i].point2,lengthEdge);
					constraintList[constraintList.length-1].label = labelconstraint;
					constraintList[constraintList.length-1].param = parameterList[pp].name;
					edgeList[i].constraints.push(labelconstraint);
					labelconstraint += 1;
				}
				updateSketch();
			}
			i = edgeList.length + 1
			//clearCanvas();
			
		} else {
			i++;
		}
	}
}

function paraAngle1(e){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	
	var j = 0, i = 0;
	while (i<edgeList.length){
		if (closeToEdge(posx,posy,i,j)){
			edgeangle[0] = edgeList[i].label;
			edgeList[i].selected = true;
			i = edgeList.length + 1;
		} else {
			i++;
		}
	}
	mode = "modeParaAngle2";
}

function paraAngle2(e){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	var dist;
	var delta = 0.05;
	var error = 0;
	var pp;
	var angle
	var j = 0, i = 0;
	while (i<edgeList.length){
		if (closeToEdge(posx,posy,i)){
			var var_str = prompt("Enter the variable name:", "");
			var k = 0
			edgeangle[1] = edgeList[i].label;
			var n1 = posLabel("edge",edgeangle[0]);
			while(k<parameterList.length){
				if (var_str == parameterList[k].name){
					angle = parameterList[k].value;
					parameterList[k].edgelist.push(edgeList[i].label);
					pp = k;
					k = parameterList.length + 1;
				} else {
					k++;
				}
			}
			if (k == parameterList.length){
				pp = k;
				var length_str = prompt("Enter the angle value:","");
				var angle = parseFloat(length_str);
				if (isNaN(angle) || angle <= 0){
					alert("Come on... Try again.");
					error = 1;
				} else {
					parameterList[pp] = new Parameter(var_str,angle);
					parameterList[pp].type = "angle";
					parameterList[pp].edgelist.push(edgeList[i].label);
					parameterList[pp].edgelist.push(edgeList[n1].label);
					parameterList[pp].label = labelparameter;
					edgeList[i].parameters.push(labelparameter);
					edgeList[n1].parameters.push(labelparameter);
					labelparameter += 1;
				}
			}
			if (error == 0){
				// on cherche d'abord si une longueur n'a pas déjà été affectée à ces Edges
				for(k=0;k<edgeList[i].constraints.length;k++){
					var ind = edgeList[i].constraints[k];
					var pc = posLabelCtr(ind);
					if(constraintList[pc].type == "angle"){
						constraintList[pc].angle = angle;
						k = constraintList.length + 1;
					} 
				}
				// Sinon, on attribue une nouvelle contrainte "angle" à ces Edges
				if(k==edgeList[i].constraints.length){
					
					// identification du noeud commun
					
					if (edgeList[n1].point1 == edgeList[i].point2){
							pt1 = edgeList[i].point1;
							pt2 = edgeList[i].point2;
							pt3 = edgeList[n1].point2;
					} else if (edgeList[n1].point2 == edgeList[i].point1){
							pt1 = edgeList[n1].point1;
							pt2 = edgeList[n1].point2;
							pt3 = edgeList[i].point2;
					} else if (edgeList[n1].point1 == edgeList[i].point1){
							pt1 = edgeList[n1].point2;
							pt2 = edgeList[n1].point1;
							pt3 = edgeList[i].point2;
					} else if (edgeList[n1].point2 == edgeList[i].point2){
							pt1 = edgeList[n1].point1;
							pt2 = edgeList[n1].point2;
							pt3 = edgeList[i].point1;
					}
					edgeList[i].selected = true;
					constraintList[constraintList.length] = new Angle(pt1,pt2,pt3,angle);
					constraintList[constraintList.length-1].label = labelconstraint;
					constraintList[constraintList.length-1].param = parameterList[pp].name;
					edgeList[i].constraints.push(labelconstraint);
					edgeList[n1].constraints.push(labelconstraint);
					labelconstraint += 1;
				}
				updateSketch();
				edgeList[n1].selected = false;
				edgeList[i].selected = false;
			}
			
			i = edgeList.length + 1
			
		} else {
			i++;
		}
	};
	edgeangle = [];
	mode = "modeParaAngle1";
}

function showParams(){
	var ww = 150;
	var hh = 20;
	for(var i=0;i<parameterList.length;i++){
		if(parameterList[i].light == false){
			context.fillStyle = "#8B0000";
			context.font = "bold 12px Arial";
		} else {
			context.fillStyle = "#FF0000";
			context.font = "bold 12px Arial";
		}
		if(parameterList[i].type == "distance"){
			var str = "Distance  "+parameterList[i].name+" ="+parameterList[i].value;
		} else if(parameterList[i].type == "angle"){
			var str = "Angle "+parameterList[i].name+" ="+parameterList[i].value;
		}
		context.fillText(str,canvas.width-ww,hh);
		hh = hh + 20
	}
}

//--------------------------------------------------------//
// editParameter édite le paramètre sélectionné.          //
// lab est le label de ce paramètre.                      //
//--------------------------------------------------------//
function editParameter(lab){
	var p0 = posLabelParam(lab);
	if(parameterList[p0].type == "distance"){
		var newlstr = prompt("Enter new length","");
		var newl = parseFloat(newlstr);
		parameterList[p0].value = newl;
		for(var i=0;i<constraintList.length;i++){
			if(constraintList[i].param == parameterList[p0].name){
				constraintList[i].distance = newl;
			}
		}
	} else if(parameterList[p0].type == "angle"){
		var newastr = prompt("Enter new angle","");
		var newa = parseFloat(newastr);
		parameterList[p0].value = newa;
		for(var i=0;i<constraintList.length;i++){
			if(constraintList[i].param == parameterList[p0].name){
				constraintList[i].angle = newa;
			}
		}
	} 
	updateSketch();
	selected_param = -1;
}

//----------------------------------------------------------//
// deleteParameter supprime le paramètre sélectionné.       //
// lab est le label de ce paramètre. Il faut aussi pener à  //
// supprimer les contraintes associées au paramètre.        //
//----------------------------------------------------------//
function deleteParameter(lab){
	var p0 = posLabelParam(lab);
	var elems = parameterElem(p0);
	var pp;
	for(var i=0;i<elems[1].length;i++){
		var pe = elems[1][i]
		for(var j=0;j<edgeList[pe].parameters.length;j++){
			if(edgeList[pe].parameters[j] == lab){
				edgeList[pe].parameters.splice(j,1);
			}
		}
	}
	for(var i=0;i<constraintList.length;i++){
		if(constraintList[i].param == parameterList[p0].name){
			constraintList[i].splice(i,1);
		}
	}
	selected_param = -1;
	parameterList.splice(p0,1);
	updateSketch();
}

//-------------------------------------------------------------------------//
// parameterElem rend la POSITION dans leur liste respective des éléments  //
// concernés par le paramètre.                                             //
// i est la position du paramètre dans parameterList                       //
//-------------------------------------------------------------------------//
function parameterElem(i){ 
	var ctrPoints = [];
	var ctrEdges = [];
	var ctrArcs = [];
	if(parameterList[i].type == "distance"){
		for(var j=0;j<parameterList[i].edgelist.length;j++){
			var el = parameterList[i].edgelist[j];
			var ep = posLabel("edge",el);
			var pl1 = edgeList[ep].point1;
			var pp1 = posLabel("point",pl1);
			var pl2 = edgeList[ep].point2;
			var pp2 = posLabel("point",pl2);
			ctrPoints.push(pp1);
			ctrPoints.push(pp2);
			ctrEdges.push(ep);
		};
	}if(parameterList[i].type == "angle"){
		for(var j=0;j<parameterList[i].edgelist.length;j++){
			var el = parameterList[i].edgelist[j];
			var ep = posLabel("edge",el);
			ctrEdges.push(ep);
		};
	} /* else if (constraintList[i].type == "equilength"){
		var e1 = edgeFromPoints(constraintList[i].point1,constraintList[i].point2);
		var e2 = edgeFromPoints(constraintList[i].point3,constraintList[i].point4);
		var pe1 = posLabel("edge",e1);
		var pe2 = posLabel("edge",e2);
		ctrEdges.push(pe1);
		ctrEdges.push(pe2);
	} else if (constraintList[i].type == "horivert"){
		var e1 = edgeFromPoints(constraintList[i].point1,constraintList[i].point2);
		var pe1 = posLabel("edge",e1);
		edgeList[pe1].light = true;
		ctrEdges.push(pe1);
	}*/
	return[ctrPoints,ctrEdges,ctrArcs];
}

//--------------------------------------------------------------------//
// lightParamElem éclaire les éléments concernés par le paramètre i.  //
// i est la position de lu paramètre dans parameterList               //
//--------------------------------------------------------------------//
function lightParamElem(i){ 
	var elems = parameterElem(i);
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

//------------------------------------------------------------//
// posLabelParam rend la position dans la liste parameterList //
// de lu paramètre dont le label est lab.                     //
//------------------------------------------------------------//
function posLabelParam(lab){
	var i = 0;
	var pos = -1;
	while(i<parameterList.length){
		if(parameterList[i].label == lab){
			pos = i;
			i = parameterList.length;
		} else {
			i++;
		}
	}
	return pos;
}

//---------------------------------------------------------------//
// selectParameter définie les actions lorsqu'on clique sur un   //
// paramètre texte. lab est le label de ce paramètre.            //
//---------------------------------------------------------------//
function selectParameter(lab){
	var pl0 = onTextParameter(event)[1];
	var p0;
	if(selected_param==-1){
		selected_param = pl0;
		p0 = posLabelParam(pl0);
		parameterList[p0].selected = true;
		parameterList[p0].light = true;
		lightParamElem(p0);
	} else {
		if(onTextParameter(event)[1]==selected_param){
			editParameter(pl0);
			unSelectParam();
		} else {
			p0 = posLabelParam(selected_param);
			parameterList[p0].selected = false;
			parameterList[p0].light = false;
			selected_param = -1;
		}
	}
}

//--------------------------------------------------------------------//
// unSelectParam déselectionne le paramètre sélectionnée précédemment //
//--------------------------------------------------------------------//
function unSelectParam(){
	if(selected_param != -1){
		var p0 = posLabelParam(selected_param);
		parameterList[p0].light = false;
		parameterList[p0].selected = false;
	}
}