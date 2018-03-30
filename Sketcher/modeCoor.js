function modeCoor(){
	mode = "modeCoor"
	showButtons();
}

function seizeCoor(e){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	var dist;
	
	var j = 0, i = 0;
	while (j<shapes.length){
		while (i<shapes[j].pointList.length){
			dist = Math.sqrt( ( posx - shapes[j].pointList[i].x )**2 + ( posy - shapes[j].pointList[i].y )**2 );
			if( dist < radius ) {
				var coorx_str = prompt("Please enter the X coordinate:", "");
				var coory_str = prompt("Please enter the Y coordinate:", "");
				var coorx = parseFloat(coorx_str);
				var coory = parseFloat(coory_str);
				if (isNaN(coorx) && isNaN(coory)){
					alert("Seriously? You can't correctly enter two numbers?");
				} else {
					shapes[j].pointList[i].x = coorx;
					shapes[j].pointList[i].y = coory;
					shapes[j].pointList[i].lock = "yes";
					shapes[j].edgeList[i].point1.x = coorx;
					shapes[j].edgeList[i].point1.y = coory;
					shapes[j].edgeList[i].point1.lock = "yes";
					shapes[j].edgeList[i].updateLength();
					if ( i != 0 ){
						shapes[j].edgeList[i-1].point2.x = coorx;
						shapes[j].edgeList[i-1].point2.y = coory;
						shapes[j].edgeList[i-1].point2.lock = "yes";
						shapes[j].edgeList[i-1].updateLength();
					} else {
						var nn = shapes[j].edgeList.length-1
						shapes[j].edgeList[nn].point2.x = coorx;
						shapes[j].edgeList[nn].point2.y = coory;
						shapes[j].edgeList[nn].point2.lock = "yes";
						shapes[j].edgeList[nn].updateLength();
					}
				}
				
				clearCanvas();
				
				i = shapes[j].pointList.length + 1
			} else {
				i++;
			}
		}
		if(i==shapes[j].pointList.length + 1){
			j=shapes.length;
		} else {
		j++;
		}
	}
}

function yieldCoor(i,j){
	alert("Coordinates of point number "+ j +" of shape "+ i +":\n"+"X: "+shapes[i].pointList[j].x+", Y: "+shapes[i].pointList[j].y);
}

