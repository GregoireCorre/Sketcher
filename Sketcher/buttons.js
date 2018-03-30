
function showButtons(){
	if(mode == "select"){
		document.getElementById("bselect").src = "select_on.png";
	} else {
		document.getElementById("bselect").src = "select.png";
	}
	if(mode == "modeMultiLine0" || mode == "modeMultiLine1"){
		document.getElementById("bmultiline").src = "multiline_on.png";
	} else {
		document.getElementById("bmultiline").src = "multiline.png";
	}
	if(mode == "modeArc"){
		document.getElementById("barc").src = "arc_on.png";
	} else {
		document.getElementById("barc").src = "arc.png";
	}
	if(mode == "modeCircle"){
		document.getElementById("bcircle").src = "circle_on.png";
	} else {
		document.getElementById("bcircle").src = "circle.png";
	}
	if(mode == "modeLength"){
		document.getElementById("blength").src = "length_on.png";
	} else {
		document.getElementById("blength").src = "length.png";
	}
	if(mode == "modeAngleEdges" || mode == "modeAnglePoints"){
		document.getElementById("bangle").src = "angle_on.png";
	} else {
		document.getElementById("bangle").src = "angle.png";
	}
	if(mode == "modeEquiLength"){
		document.getElementById("bequilength").src = "equilength_on.png";
	} else {
		document.getElementById("bequilength").src = "equilength.png";
	}
	if(mode == "modeLabel"){
		document.getElementById("blabel").src = "label_on.png";
	} else {
		document.getElementById("blabel").src = "label.png";
	}
	if(mode == "modeParallel"){
		document.getElementById("bparallel").src = "parallel_on.png";
	} else {
		document.getElementById("bparallel").src = "parallel.png";
	}
	if(mode == "modeParaLength"){
		document.getElementById("bparalength").src = "paralength_on.png";
	} else {
		document.getElementById("bparalength").src = "paralength.png";
	}
	if(mode == "modeParaAngle1" || mode == "modeParaAngle2"){
		document.getElementById("bparaangle").src = "paraangle_on.png";
	} else {
		document.getElementById("bparaangle").src = "paraangle.png";
	}
	if(mode == "modeCoincidence" ){
		document.getElementById("bcoincidence").src = "coincidence_on.png";
	} else {
		document.getElementById("bcoincidence").src = "coincidence.png";
	}
	if(mode == "modeAddPoint"){
		document.getElementById("baddpoint").src = "addpoint_on.png";
	} else {
		document.getElementById("baddpoint").src = "addpoint.png";
	}
	if(mode == "modeTranslate"){
		document.getElementById("btranslate").src = "translate_on.png";
	} else {
		document.getElementById("btranslate").src = "translate.png";
	}
	if(mode == "modeMeasure"){
		document.getElementById("bmeasure").src = "measure_on.png";
	} else {
		document.getElementById("bmeasure").src = "measure.png";
	}
	if(mode == "modeGradient"){
		document.getElementById("bgradient").src = "gradient_on.png";
	} else {
		document.getElementById("bgradient").src = "gradient.png";
	}
	if(mode == "modeCreateSection"){
		document.getElementById("bcreatesection").src = "createsection_on.png";
	} else {
		document.getElementById("bcreatesection").src = "createsection.png";
	}
	if(mode == "modeCreateHole"){
		document.getElementById("bcreatehole").src = "createhole_on.png";
	} else {
		document.getElementById("bcreatehole").src = "createhole.png";
	}
	if(mode == "modeFillet"){
		document.getElementById("bfillet").src = "fillet_on.png";
	} else {
		document.getElementById("bfillet").src = "fillet.png";
	}
}