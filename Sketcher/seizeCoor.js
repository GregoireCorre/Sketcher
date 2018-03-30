function modeCoor(){
	mode = "modeCoor"
	showButtons();
}

function seizeCoor(){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	var dist;
	
	while (j<shapes.length){
		while (i<shapes[j].pointList.length){
			dist = Math.sqrt( ( posx - shapes[j].pointList[i].x )**2 + ( posy - shapes[j].pointList[i].y )**2 );
			if( dist < radius ) {
				var coorx_str = prompt("Please enter the X coordinate:", "");
				var coorx = parseFloat(coorx_str);
				
				var coory_str = prompt("Please enter the Y coordinate:", "");
				var coory = parseFloat(coorx_str);
				
				i = shapes[j].pointList.length
				j = shapes.length
			} else {
				i++;
			}
		}
		j++;
	}
}

