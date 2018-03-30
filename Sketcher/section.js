function modeCreateSection(){
	mode = "modeCreateSection";
	showButtons();
	findSections();
};

function modeCreateHole(){
	mode = "modeCreateHole";
	showButtons();
	findSections();
}
	
function findSections(){	
	var sections = [];
	var sections_elem = [];
	var j = 0;
	var jj, pp;
	var el, al;
	var pathcompt = 0;
	var pathsave = [];
	var pathoptions = [];
	var path= [];
	var elem = [];
	var elemoptions = [];
	var path_cmd;
	for(var i=0;i<pointList.length;i++){
		path[pathcompt] = [pointList[i].label];
		elem[pathcompt] = [];
		pp = pathcompt;
		pathcompt++;
		// test: est-ce un cercle?
		al = arcFromPoints(pointList[i].label,pointList[i].label);
		if(al != -1){
			sections[sections.length] = [pointList[i].label,pointList[i].label];
			sections_elem[sections_elem.length] = ["arc"];
		}
		for(var k = pp;k<path.length;k++){
			path_cmd = "";
			while(path_cmd != "stop"){
				el = edgeFromPoints(path[k][0],path[k][path[k].length-1]);
				al = arcFromPoints(path[k][0],path[k][path[k].length-1]);
				if(path[k].length == 2 && el != -1 && al != -1 ){
					sectemp = path[k].slice();
					sections[sections.length] = sectemp;
					if(elem[k][0] == "arc") elem[k] = elem[k].concat("edge");
					if(elem[k][0] == "edge") elem[k] = elem[k].concat("arc");
					sections_elem[sections_elem.length] = elem[k].slice();
					elem[k] = elem[k].slice(0,1);
				}
				jj = 0;
				for(var j=0;j<edgeList.length;j++){
					if(edgeList[j].point1 == path[k][path[k].length-1] && !(path[k].includes(edgeList[j].point2))){
						pathoptions.push(edgeList[j].point2);
						elemoptions.push("edge");
						jj=1;
					}
					if(edgeList[j].point2 == path[k][path[k].length-1] && !(path[k].includes(edgeList[j].point1))){
						pathoptions.push(edgeList[j].point1);
						elemoptions.push("edge");
						jj=1;
					}
					
				}
				for(var j=0;j<arcList.length;j++){
					if(arcList[j].point1 == path[k][path[k].length-1] && !(path[k].includes(arcList[j].point2))){
						pathoptions.push(arcList[j].point2);
						elemoptions.push("arc");
						jj=1;
					}
					if(arcList[j].point2 == path[k][path[k].length-1] && !(path[k].includes(arcList[j].point1))){
						pathoptions.push(arcList[j].point1);
						elemoptions.push("arc");
						jj=1;
					}
					
				}
				if(pathoptions.length == 1){
					pathsave = path[k].slice();
					path[k] = path[k].concat(pathoptions[0]);
					elem[k] = elem[k].concat(elemoptions[0]);
				} else if (pathoptions.length > 1){
					for(var ll=1;ll<pathoptions.length;ll++){
						path[pathcompt] = path[k].concat(pathoptions[ll]);
						elem[pathcompt] = elem[k].concat(elemoptions[ll]);
						pathcompt += 1;
					}
					path[k] = path[k].concat(pathoptions[0]);
					elem[k] = elem[k].concat(elemoptions[0]);
				}
				pathoptions = [];
				elemoptions = [];
				el = edgeFromPoints(path[k][0],path[k][path[k].length-1]);
				al = arcFromPoints(path[k][0],path[k][path[k].length-1]);
				if( path[k].length > 2 && el != -1 ){
					sections[sections.length] = path[k].slice();
					//elem[k] = elem[k].concat("edge");
					sections_elem[sections_elem.length] = elem[k].concat("edge");
					path_cmd = "stop";
				}
				if (path[k].length > 2 && al != -1 ){
					sections[sections.length] = path[k].slice();
					//elem[k] = elem[k].concat("arc");
					sections_elem[sections_elem.length] = elem[k].concat("arc");
					path_cmd = "stop";
				}
				if(jj == 0){
					path_cmd = "stop";
				}
			}
		}
	}
	[sections,sections_elem] = clearSections(sections,sections_elem);
	for(var i=0;i<sections.length;i++){
		section_list[i] = new Section(sections[i],sections_elem[i]);
	}
}

//-----------------------------------------------------------------------//
// clearSections "nettoie" sections en ne retenant que les arrays 1 à 1  //
// différents.                                                           //
//-----------------------------------------------------------------------//
function clearSections(sections,sections_elem){
	var sorted_sec = [];
	var sorted_elems = [];
	sorted_sec[0] = sections[0];
	sorted_elems[0] = sections_elem[0];
	for(var i=1;i<sections.length;i++){
		var kk = 0;
		for(var j=0;j<sorted_sec.length;j++){
			if(isIdenticalArray(sections[i],sorted_sec[j],sections_elem[i],sorted_elems[j])){
				kk = 1;
			}
		}
		if (kk==0){
			sorted_sec.push(sections[i]);
			sorted_elems.push(sections_elem[i]);
		}
	}
	return [sorted_sec,sorted_elems];
}

//----------------------------------------------------------------------//
// isIdenticalArray renvoie true si a1 et a2 sont des arrays identiques //
//----------------------------------------------------------------------//
function isIdenticalArray(a1,a2,e1,e2){
	var res = true;
	var j, a1m, a1p, a2m, a2p;
	if(a1.length != a2.length){
		res = false;
	} else {
		for(var i=0;i<a1.length;i++){
			if(!(a2.includes(a1[i]))){
				res = false;
			} else {
				if(i == 0){
					a1m = a1.length-1;
					a1p = 1
				} else if(i == a1.length-1){
					a1m = a1.length-2;
					a1p = 0;
				} else {
					a1m = i-1;
					a1p = i+1;
				}
				j = a2.indexOf(a1[i]);
				if(j == 0){
					a2m = a1.length-1;
					a2p = 1
				} else if(j == a1.length-1){
					a2m = a1.length-2;
					a2p = 0;
				} else {
					a2m = j-1;
					a2p = j+1;
				}
				if(a1[a1p] == a2[a2m]){
					if(e1[i] != e2[a2m]){
						res = false;
					}
				} else if (a1[a1p] == a2[a2p]){
					if(e1[a1p] != e2[a2p]){
						res = false;
					}
				}
			}
		}
		if(a1.length == 2){
			if(!(a2.includes(a1[0]) && a2.includes(a1[1]))){
				res = false;
			} else {
				res = true;
			}
		}
	}
	
	return res;
}

//-------------------------------------------------------------------------//
// showSections affiche les sections de la liste section_list.             //
//-------------------------------------------------------------------------//
function showSectionList(){
	var str;
	var el, al;
	var hh = 300;
	var ww = canvas.width - 25;
	for(var i =0;i<section_list.length;i++){
		context.fillStyle = "#000000";
		if(section_list[i].light == true){
			context.beginPath();
			if( mode == "modeCreateSection") color = "rgba(150,150,250,0.8)";
			if( mode == "modeCreateHole") color = "rgba(250,150,150,0.8)";
			
			if(section_list[i].hole == false){
				/*if(!isClockWise(section_list[i])){
					section_list[i].points.reverse();
					section_list[i].elems.reverse();
					var e0 = section_list[i].elems.shift();
					section_list[i].elems = section_list[i].elems.concat(e0);
				};*/
				drawShape(section_list[i].points,section_list[i].elems,color);
			} else {
				/*if(isClockWise(section_list[i])){
					section_list[i].points.reverse();
					section_list[i].elems.reverse();
					var e0 = section_list[i].elems.shift();
					section_list[i].elems = section_list[i].elems.concat(e0);
				};*/
				drawShape(section_list[i].points,section_list[i].elems,color);
			}
			context.fill();
			for(var j=0;j<section_list[i].points.length-1;j++){
				if(section_list[i].elems[j] == "edge"){
					el = edgeFromPoints(section_list[i].points[j],section_list[i].points[j+1]);
					edgeList[posLabel("edge",el)].light = true;
				} else if (section_list[i].elems[j] == "arc"){
					al = arcFromPoints(section_list[i].points[j],section_list[i].points[j+1]);
					arcList[posLabel("arc",al)].light = true;
				}
			}
			if(section_list[i].elems[section_list[i].points.length-1] == "edge"){
				el = edgeFromPoints(section_list[i].points[0],section_list[i].points[section_list[i].points.length-1]);
				edgeList[posLabel("edge",el)].light = true;
			} else if (section_list[i].elems[section_list[i].points.length-1] == "arc"){
				al = arcFromPoints(section_list[i].points[0],section_list[i].points[section_list[i].points.length-1]);
				arcList[posLabel("arc",al)].light = true;
			}
			context.fillStyle = "#FF0000";
		}
		context.font = "bold 14px Arial";
		str = "S"+i;
		context.fillText(str,ww,hh);
		hh = hh + 25;
	}
}

function closeSectionText(e){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	var hh = 300;
	var ww = canvas.width - 25;
	for(var i=0;i<edgeList.length;i++){
		edgeList[i].light = false;
	};
	for(var i=0;i<arcList.length;i++){
		arcList[i].light = false;
	};
	for(var i=0;i<section_list.length;i++){
		section_list[i].light = false;
	}
	for(var i =0;i<section_list.length;i++){
		if(posx >ww && (posy > hh -15 && posy < hh + 5)){
			section_list[i].light = true
		} 
		
		hh = hh + 25;
	}
}

function createSection(e){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	for(var i =0;i<section_list.length;i++){
		if(section_list[i].light == true){
			sectionList[sectionList.length] = new Section(section_list[i].points,section_list[i].elems);
			sectionList[sectionList.length-1].label = labelsection;
			if(mode == "modeCreateHole") sectionList[sectionList.length-1].hole = true;
			labelsection += 1;
		}
	}
	section_list = [];
	findSections();
	//mode = "select";
	//showButtons();
}

function showSections(){
	context.beginPath();
	for(var i=0;i<sectionList.length;i++){
		if(sectionList[i].hole == false){
			if(!isClockWise(sectionList[i])){
				sectionList[i].points.reverse();
				sectionList[i].elems.reverse();
				var e0 = sectionList[i].elems.shift();
				sectionList[i].elems= sectionList[i].elems.concat(e0);
			};
			drawShape(sectionList[i].points,sectionList[i].elems,"#D3D3D3");
		} else {
			if(isClockWise(sectionList[i])){
				sectionList[i].points.reverse();
				sectionList[i].elems.reverse();
				var e0 = sectionList[i].elems.shift();
				sectionList[i].elems = sectionList[i].elems.concat(e0);
			};
			drawShape(sectionList[i].points,sectionList[i].elems,"#D3D3D3");
		}
	}
	context.fill();
}

function closeSection(e){
	var pos = getMousePos(canvas, e);
    var posx = pos.x;
    var posy = pos.y;
	var sec_list = [], surf;
	var min_surf, ind_sec = -1;
	for(var i=0;i<section_list.length;i++){
		if(inSection(pos,section_list[i])){
			sec_list.push(i);
		}
	}
	if(sec_list.length>0){
		min_surf = surfSection(section_list[sec_list[0]]);
		ind_sec = sec_list[0];
		for(var i=1; i<sec_list.length;i++){
			surf = surfSection(section_list[sec_list[i]])
			if(surf<min_surf){
				min_surf = surf;
				ind_sec = sec_list[i];
			}
		}
		section_list[ind_sec].light = true;
	}
	
}

function inSection(pos,section){
	var tot = 0;
	var p1, p2, ang;
	var res = false;
	var ap, a1;
	var wn = windingNumber(pos,section);
	if(wn != 0) res = true;
	// on vérifie si le point est dans un arc de cercle;
	for(var i=0;i<section.elems.length;i++){
		if(section.elems[i] == "arc"){
			ii = i+1;
			if(i == section.elems.length-1) ii = 0;
			ap = arcFromPoints(section.points[i],section.points[ii]);
			a1 = arcList[posLabel("arc",ap)];
			if(inArc(pos,a1)){
				res = true;
			}
		}
	}
	return res;
}

function surfSection(section){
	var tot = 0;
	var p1, p2, p3, a1;
	for(var i=0;i<section.points.length-2;i++){
		p1 = pointList[posLabel("point",section.points[0])];
		p2 = pointList[posLabel("point",section.points[i+1])];
		p3 = pointList[posLabel("point",section.points[i+2])];
		tot += surfTriangle(p1,p2,p3);
	}
	for(var i=0;i<section.elems.length;i++){
		if(section.elems[i] == "arc"){
			ii = i+1;
			if(i == section.elems.length-1) ii = 0;
			a1 = arcList[posLabel("arc",arcFromPoints(section.points[i],section.points[ii]))];
			tot += surfArc(a1);
		}
	}
	return tot;
}

function surfTriangle(p1,p2,p3){
	var a = Math.sqrt((p2.x-p1.x)**2+(p2.y-p1.y)**2);
	var b = Math.sqrt((p3.x-p1.x)**2+(p3.y-p1.y)**2);
	var c = Math.sqrt((p3.x-p2.x)**2+(p3.y-p2.y)**2);
	var p = (a+b+c)/2;
	var S = Math.sqrt(p*(p-a)*(p-b)*(p-c));
	return S;
}

function windingNumber(pos,section){
	var wn = 0;
	for(var i=0;i<section.points.length;i++){
		ii = i+1;
		if(i == section.points.length-1) ii = 0;
		if(pointList[posLabel("point",section.points[i])].y <= pos.y){
			if(pointList[posLabel("point",section.points[ii])].y > pos.y){
				if( isLeft(section.points[ii],section.points[i],pos)){
					wn += 1;
				}
			}
		}
		else {
			if (pointList[posLabel("point",section.points[ii])].y <= pos.y){
				if( !isLeft(section.points[ii],section.points[i],pos)){
					wn -= 1;
				}
			}
		}
	}
	return wn;
}

function isLeft(pl1,pl2,p3){
	bool = false;
	var p1 = pointList[posLabel("point",pl1)];
	var p2 = pointList[posLabel("point",pl2)];
	var res = (p2.x-p1.x)*(p3.y-p1.y)-(p3.x-p1.x)*(p2.y-p1.y);
	if(res > 0){
		bool = true;
	}
	return bool;
}

function isClockWise(section){
	var tot = 0;
	var p1, p2, p3;
	var pts = section.points.concat(section.points[0],section.points[1]);
	for(var i=0;i<pts.length-2;i++){
		p0 = pointList[posLabel("point",pts[i])];
		p1 = pointList[posLabel("point",pts[i+1])];
		p2 = pointList[posLabel("point",pts[i+2])];
		tot += (p1.x-p0.x)*(p2.y-p1.y) - (p1.y-p0.y)*(p2.x-p1.x);
	}
	if(tot < 0 ){
		return  true;
	} else {
		return  false
	}
}