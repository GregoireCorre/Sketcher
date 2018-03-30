function modeParallel(){
	mode = "modeParallel";
	showButtons();
}

function seizeEdgeParallel1(e){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	
	// Sélection du premier Edge
	var j = 0, i = 0;
	while (j<shapes.length){
		while (i<shapes[j].edgeList.length){
	if (closeToEdge(posx,posy,i,j)){
				edgeParallel[0] = i;
				i = shapes[j].edgeList.length + 1;
			} else {
				i++;
			}
		}
		if(i==shapes[j].edgeList.length + 1){
			j=shapes.length;
		} else {
		j++;
		}
	}
}

function seizeEdgeParallel2(e){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	var pt1,pt2,pt3,pt4
	
	// Sélection du premier Edge
	var j = 0, i = 0;
	while (j<shapes.length){
		while (i<shapes[j].edgeList.length){
			if (closeToEdge(posx,posy,i,j)){
				edgeParallel[1] = i;
				pt1 = edgeParallel[0], pt2 = pt1+1, pt3 = edgeParallel[1], pt4 = pt3+1;
				if (pt1==shapes[j].edgeList.length-1){
					pt2 = 0;
				}
				if (pt3==shapes[j].edgeList.length-1){
					pt4 = 0;
				}
				shapes[j].constraints[shapes[j].constraints.length] = new Parallel(pt1,pt2,pt3,pt4);// création de la nouvelle contrainte
				shapes[j].edgeList[edgeParallel[0]].constraintsList[shapes[j].edgeList[edgeParallel[0]].constraintsList.length] = shapes[j].constraints.length - 1;
				shapes[j].edgeList[edgeParallel[1]].constraintsList[shapes[j].edgeList[edgeParallel[1]].constraintsList.length] = shapes[j].constraints.length - 1; // ajout de la contrainte dans les paramètres des Edges
				shapes[j].dimensions[shapes[j].dimensions.length] = new DimParallel(j,edgeParallel[0],edgeParallel[0]); 
				shapes[j].dimensions[shapes[j].dimensions.length] = new DimParallel(j,edgeParallel[1],edgeParallel[1]); // création nouvelle dimension
				shapes[j].edgeList[edgeParallel[0]].dimensionsList[shapes[j].edgeList[edgeParallel[0]].dimensionsList.length] = shapes[j].dimensions.length - 1; 
				shapes[j].edgeList[edgeParallel[1]].dimensionsList[shapes[j].edgeList[edgeParallel[1]].dimensionsList.length] = shapes[j].dimensions.length - 1;// ajout de la dimension dans les paramètres des Edges
				
				updateShape(j) // mise à jour de la section
				i = shapes[j].edgeList.length + 1
			} else {
				i++;
			}
		}
		if(i==shapes[j].edgeList.length + 1){
			j=shapes.length;
		} else {
		j++;
		}
	}
	if (showDim == "on"){
		showDim = "off";
	} else if (showDim == "off"){
		showDim = "on";
	}
	showDimensions();
	edgeParallel=[];
}