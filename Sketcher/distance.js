function modeDistChoice(){
	mode = "modeLength"
	if(distbutton == "off"){
		// Création de deux nouveax boutons
		point2point = document.createElement("BUTTON");
		point2pointH = document.createElement("BUTTON");
		point2pointV = document.createElement("BUTTON");
		point2point.setAttribute("id","buttonp2p");
		point2pointH.setAttribute("id","buttonp2pH");
		point2pointV.setAttribute("id","buttonp2pV");
		point2point.innerHTML = '<img src="p2p.png" width="60px" height="60px" />';
		point2pointH.innerHTML = '<img src="p2ph.png" width="60px" height="60px"/>';
		point2pointV.innerHTML = '<img src="p2pv.png" width="60px" height="60px"/>';
		point2point.setAttribute("style","position: absolute; top:260px;left:1140px");
		point2pointH.setAttribute("style","position: absolute; top:260px;left:1075px");
		point2pointV.setAttribute("style","position: absolute; top:260px;left:1010px");
		document.body.appendChild(point2point);
		document.body.appendChild(point2pointH);
		document.body.appendChild(point2pointV);
		// Création des nouvelles actions associées aux nouveaux boutons
		addListener(document.getElementById("buttonp2p"),"click",modeP2p);
		addListener(document.getElementById("buttonp2pH"),"click",modeP2pH);
		addListener(document.getElementById("buttonp2pV"),"click",modeP2pV);
		distbutton = "on";
	} else {
		point2point.parentNode.removeChild(point2point);
		point2pointH.parentNode.removeChild(point2pointH);
		point2pointV.parentNode.removeChild(point2pointV);
		distbutton = "off";
	}
}
function modeP2p(){
	mode = "modeP2p";
	showButtons();
	point2point.parentNode.removeChild(point2point);
	point2pointH.parentNode.removeChild(point2pointH);
	point2pointV.parentNode.removeChild(point2pointV);
	distbutton = "off";
}

function modeP2pH(){
	mode = "modeP2pH";
	showButtons();
	point2point.parentNode.removeChild(point2point);
	point2pointH.parentNode.removeChild(point2pointH);
	point2pointV.parentNode.removeChild(point2pointV);
	distbutton = "off";
}

function modeP2pV(){
	mode = "modeP2pV";
	showButtons();
	point2point.parentNode.removeChild(point2point);
	point2pointH.parentNode.removeChild(point2pointH);
	point2pointV.parentNode.removeChild(point2pointV);
	distbutton = "off";
}

function seizePointDist(e){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	var dist;
	
	var i = 0;
	while (i<pointList.length){
		dist = Math.sqrt( ( posx - pointList[i].x )**2 + ( posy - pointList[i].y )**2 );
		if( dist < radius ) {
			point2pointdist.push(pointList[i].label);
			i = pointList.length + 1;
		} else {
			i++;
		}
	}
	if(point2pointdist.length == 2){
		var dist_str = prompt("Enter the distance value:","");
		var dist = parseFloat(dist_str);
		if(isNaN(dist)){
			alert("Sorry but that's not an acceptable value !");
		} else {
			if(mode == "modeP2p"){
				constraintList[constraintList.length] = new Distance(point2pointdist[0],point2pointdist[1],dist);
			} else if (mode == "modeP2pH"){
				constraintList[constraintList.length] = new DistanceH(point2pointdist[0],point2pointdist[1],dist);
			} else if (mode == "modeP2pV"){
				constraintList[constraintList.length] = new DistanceV(point2pointdist[0],point2pointdist[1],dist);
			}
			constraintList[constraintList.length-1].label = labelconstraint;
			var n = posLabel("point",point2pointdist[0]);
			pointList[n].constraints.push(labelconstraint);
			n = posLabel("point",point2pointdist[1]);
			pointList[n].constraints.push(labelconstraint);
			labelconstraint += 1;
			point2pointdist = [];
			updateSketch();
		}
	}
}

