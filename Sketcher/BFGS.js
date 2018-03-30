
function updateSketch(){
	var newpoints = BFGS();
	pointList = newpoints;
	//updateEdgeListFromPoints();
	clearCanvas();
	drawCanvas();
	//shapes[ishape].drawSection();
}

function BFGS(){
	var tol = 0.01;
	var tol_oc = 5; // tolerance sur-contrainte
	var status = "keep on";
	var npt = pointList.length;
	var pts_res = pointList;
	var norm, grad;
	var vecDir = [];
	var grad_sig0 =[], grad_sig1=[],delta_grad=[];
	grad_sig1.length = 2*npt;
	grad_sig1.fill(0);
	var matH = []; // initialisation de la matrice H à la matrice identité
	matH.length = 4*npt**2;
	matH.fill(0);
	for (i=0;i<2*npt;i++){
		matH[i*2*npt+i] = 1;
	}
	var nbiter = 0;
	
	while (status != "stop"){
		// Calcul de la dérivée de (Sigma = somme des contraintes au carré)
		nbiter += 1;
		grad_sig0 = grad_sig1;
		grad = gradSig(pts_res);
		grad_sig1 = grad[1];
		norm = normL2(grad_sig1);
		if (norm < tol || nbiter >= 5000){
			if( nbiter >= 5000){
				console.log("trop grand nombre d'itérations");
			};
			status = "stop";
			if(grad[0] > tol_oc){
				alert("WARNING: Your drawing may be overconstrainted");
			}
		} else {
			delta_grad = vecSous(grad_sig1,grad_sig0);
		
			// Calcul de la direction de recherche
			vecDir = multMatVect(matH,grad_sig1);
			vecDir = vecMult(-1,vecDir);
			
			// Calcul de l'incrément de ddl
			lambda = fletcherLemarechal(pts_res,vecDir);
			for(i=0;i<pts_res.length;i++){
				pts_res[i].x = pts_res[i].x + lambda * vecDir[i];
				pts_res[i].y = pts_res[i].y + lambda * vecDir[npt+i];
			}
			// Mise à jour de la pseudo-Hessienne Hessienne
			deltaX = vecMult(lambda,vecDir);
			//matH = updateHessian(matH,delta_grad,deltaX);	
		}
	}
	return pts_res;
}

function gradSig(pts_res){
	var x1, x2, y1, y2, pt1, pt2;
	var n1, n2;
	var npt = pts_res.length;
	var res = 0;
	var resgrad = [];
	var f;
	resgrad.length = 2*npt;
	resgrad.fill(0);
	
	for(var i=0;i<constraintList.length;i++){
		pt1 = constraintList[i].point1;
		n1 = posLabel("point",pt1);
		x1 = pts_res[n1].x;
		y1 = pts_res[n1].y;
		if (constraintList[i].type == "distance"){
			pt2 = constraintList[i].point2;
			n2 = posLabel("point",pt2);
			x2 = pts_res[n2].x;
			y2 = pts_res[n2].y;
			var l = constraintList[i].distance;
			var ll = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
			var coeff = 2 * (ll - l )/ll;
			resgrad[n1] += coeff * - ( x2 - x1 );
			resgrad[n2] += coeff * ( x2 - x1 );
			resgrad[npt + n1] += coeff * - ( y2 - y1 );
			resgrad[npt + n2] += coeff * ( y2 - y1 );
			res += ll**2 + l**2 -2*l*ll;
		} else if (constraintList[i].type == "horivert"){
			pt2 = constraintList[i].point2;
			n2 = posLabel("point",pt2);
			x2 = pts_res[n2].x;
			y2 = pts_res[n2].y;
			if(constraintList[i].dir == "v"){
				resgrad[n1] += -2 * ( x2 - x1 );
				resgrad[n2] += 2 * ( x2 - x1 );
				res += (x2 - x1)**2;
			} else if (constraintList[i].dir == "h"){
				resgrad[npt + n1] += -2 * ( y2 - y1 );
				resgrad[npt + n2] += 2 * ( y2 - y1 );
				res += (y2 - y1)**2;
			}
		} else if (constraintList[i].type == "equilength"){
			pt2 = constraintList[i].point2;
			n2 = posLabel("point",pt2);
			x2 = pts_res[n2].x;
			y2 = pts_res[n2].y;
			var pt3 = constraintList[i].point3;
			var pt4 = constraintList[i].point4;
			if( pt4 == pts_res.length ){
				pt4 = 0
			};
			var n3 = posLabel("point",pt3);
			var n4 = posLabel("point",pt4);
			x3 = pts_res[n3].x;
			y3 = pts_res[n3].y;
			x4 = pts_res[n4].x;
			y4 = pts_res[n4].y;
			var l12 = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
			var l34 = Math.sqrt((x4-x3)**2 + (y4-y3)**2);
			resgrad[n1] += -2 * (l12-l34) * ( x2 - x1 )/l12;
			resgrad[n2] += 2 * (l12-l34) * ( x2 - x1 )/l12;
			resgrad[n3] += 2 * (l12-l34) * ( x4 - x3 )/l34;
			resgrad[n4] += -2 * (l12-l34) * ( x4 - x3 )/l34;
			resgrad[npt + n1] += -2 * (l12-l34) * ( y2 - y1 )/l12;
			resgrad[npt + n2] += 2 * (l12-l34) * ( y2 - y1 )/l12;
			resgrad[npt + n3] += 2 * (l12-l34) * ( y4 - y3 )/l34;
			resgrad[npt + n4] += -2 * (l12-l34) * ( y4 - y3 )/l34;
			res += l12**2 + l34**2 - 2 * l12 * l34;
		} else if (constraintList[i].type == "angle"){
			pt2 = constraintList[i].point2;
			n2 = posLabel("point",pt2);
			x2 = pts_res[n2].x;
			y2 = pts_res[n2].y;
			var pt3 = constraintList[i].point3;
			if ( pt3 == pts_res.length ){
				pt3 = 0;
			};
			var n3 = posLabel("point",pt3);
			x3 = pts_res[n3].x;
			y3 = pts_res[n3].y;
			var a = Math.sqrt((x1-x2)**2+(y1-y2)**2);
			var b = Math.sqrt((x3-x2)**2+(y3-y2)**2);
			var c = Math.sqrt((x3-x1)**2+(y3-y1)**2);
			var angle = constraintList[i].angle/180*Math.PI;
			var c0 = Math.cos(angle)
			var d = Math.sqrt(a**2+b**2-2*a*b*c0);
			f = c-Math.sqrt(a**2+b**2-2*a*b*c0);
			resgrad[n1] += -2*(x3-x1)+2*(x1-x2)-2*c0*(x1-x2)/a*b+2*(x3-x1)/c*d-2*c*((x1-x2)-(x1-x2)/a*b*c0)/d;
			resgrad[n2] += -2*(x1-x2)-2*(x3-x2)+2*c0*((x1-x2)/a*b+(x3-x2)/b*a)-2*c*(-(x1-x2)-(x3-x2)+c0*((x1-x2)/a*b+(x3-x2)/b*a))/d;
			resgrad[n3] += 2*(x3-x1)+2*(x3-x2)-2*c0*(x3-x2)/b*a-2*(x3-x1)/c*d-2*c*((x3-x2)-(x3-x2)/b*a*c0)/d;
			resgrad[npt + n1] += -2*(y3-y1)+2*(y1-y2)-2*c0*(y1-y2)/a*b+2*(y3-y1)/c*d-2*c*((y1-y2)-(y1-y2)/a*b*c0)/d;
			resgrad[npt + n2] += -2*(y1-y2)-2*(y3-y2)+2*c0*((y1-y2)/a*b+(y3-y2)/b*a)-2*c*(-(y1-y2)-(y3-y2)+c0*((y1-y2)/a*b+(y3-y2)/b*a))/d;
			resgrad[npt + n3] += 2*(y3-y1)+2*(y3-y2)-2*c0*(y3-y2)/b*a-2*(y3-y1)/c*d-2*c*((y3-y2)-(y3-y2)/b*a*c0)/d;
			res += f**2
		} else if (constraintList[i].type == "parallel"){
			pt2 = constraintList[i].point2;
			n2 = posLabel("point",pt2);
			x2 = pts_res[n2].x;
			y2 = pts_res[n2].y;
			var pt3 = constraintList[i].point3;
			var pt4 = constraintList[i].point4;
			var n3 = posLabel("point",pt3);
			var n4 = posLabel("point",pt4);
			x3 = pts_res[n3].x;
			y3 = pts_res[n3].y;
			x4 = pts_res[n4].x;
			y4 = pts_res[n4].y;
			if(x3==x4){
				resgrad[n1] += -2 * ( x2 - x1 );
				resgrad[n2] += 2 * ( x2 - x1 );
				res += (x2 - x1)**2;
			} else if(x1==x2){
				resgrad[n1] += -2 * ( x4 - x3 );
				resgrad[n2] += 2 * ( x4 - x3 );
				res += (x2 - x1)**2;
			} else if(y3==y4){
				resgrad[npt + n1] += -2 * ( y2 - y1 );
				resgrad[npt + n2] += 2 * ( y2 - y1 );
				res += (y2 - y1)**2;
			} else if(y1==y2){
				resgrad[npt + n1] += -2 * ( y2 - y1 );
				resgrad[npt + n2] += 2 * ( y2 - y1 );
				res += (y2 - y1)**2;
			} else {
				var a = (x2-x1)*(y3-y4);
				var b = (x3-x4)*(y2-y1);
				var signa = a/Math.abs(a);
				var signb = b/Math.abs(b);
				var sra = Math.sqrt(Math.abs(a));
				var srb = Math.sqrt(Math.abs(b));
				f = sra - srb;
				resgrad[n1] += -f*(y3-y4)*signa/sra;
				resgrad[n2] += f*(y3-y4)*signa/sra;
				resgrad[npt + n3] += f*(x2-x1)*signa/sra;
				resgrad[npt + n4] += -f*(x2-x1)*signa/sra;
				resgrad[n3] += -f*(y2-y1)*signb/srb;
				resgrad[n4] += f*(y2-y1)*signb/srb;
				resgrad[npt + n1] += f*(x3-x4)*signb/srb;
				resgrad[npt + n2] += -f*(x3-x4)*signb/srb;
				res += f**2;
			}
		} else if (constraintList[i].type == "position"){
			resgrad[n1] += 2*(x1 - constraintList[i].posx);
			resgrad[npt + n1] += 2*(y1 - constraintList[i].posy);
			res += (x1 - constraintList[i].posx)**2 + (y1 - constraintList[i].posy)**2;
		} else if (constraintList[i].type == "alignment"){
			pt2 = constraintList[i].point2;
			n2 = posLabel("point",pt2);
			x2 = pts_res[n2].x;
			y2 = pts_res[n2].y;
			if(constraintList[i].dir == "h"){
				resgrad[npt + n1] += -2*(y2 - y1);
				resgrad[npt + n2] += 2*(y2 - y1);
				res += (y2 - y1)**2;
			} else if(constraintList[i].dir == "v"){
				resgrad[n1] += -2*(x2 - x1);
				resgrad[n2] += 2*(x2 - x1);
				res += (x2 - x1)**2;
			}
		} else if (constraintList[i].type == "distanceH"){
			pt2 = constraintList[i].point2;
			n2 = posLabel("point",pt2);
			x2 = pts_res[n2].x;
			y2 = pts_res[n2].y;
			ll = Math.abs(x2 - x1) - constraintList[i].distance;
			if(x2 < x1) var sign = -1;
			if(x2 >=x1) var sign = +1;
			resgrad[n1] += -2*ll*sign;
			resgrad[n2] += 2*ll*sign;
			res += ll**2;
		} else if (constraintList[i].type == "distanceV"){
			pt2 = constraintList[i].point2;
			n2 = posLabel("point",pt2);
			x2 = pts_res[n2].x;
			y2 = pts_res[n2].y;
			ll = Math.abs(y2 - y1) - constraintList[i].distance;
			if(y2 < y1) var sign = -1;
			if(y2 >=y1) var sign = +1;
			resgrad[npt + n1] += -2*ll*sign;
			resgrad[npt + n2] += 2*ll*sign;
			res += ll**2;
		} else if (constraintList[i].type == "coincidence"){
			pt2 = constraintList[i].point2;
			n2 = posLabel("point",pt2);
			x2 = pts_res[n2].x;
			y2 = pts_res[n2].y;
			resgrad[npt + n1] += -2*(y2 - y1);
			resgrad[npt + n2] += 2*(y2 - y1);
			resgrad[n1] += -2*(x2 - x1);
			resgrad[n2] += 2*(x2 - x1);
			res += (y2 - y1)**2 + (x2 - x1)**2;
		} else if (constraintList[i].type == "gradient"){
			pt2 = constraintList[i].point2;
			n2 = posLabel("point",pt2);
			x2 = pts_res[n2].x;
			y2 = pts_res[n2].y;
			signx = 1, signy = 1;
			if(y2 < y1) signy = -1;
			if(x2 < x1) signx = -1;
			f = Math.abs(y2-y1) - constraintList[i].gradient/100*Math.abs(x2-x1);
			resgrad[n1] = f*constraintList[i].gradient/100*signx;
			resgrad[n2] = -f*constraintList[i].gradient/100*signx;
			resgrad[npt + n1] = -f*signy;
			resgrad[npt + n2] = f*signy;
			res += f**2;
		}
	}
	for(var i=0;i<arcList.length;i++){
		pt1 = arcList[i].point1;
		pt2 = arcList[i].point2;
		var pt3 = arcList[i].center;
		n1 = posLabel("point",pt1);
		n2 = posLabel("point",pt2);
		var n3 = posLabel("point",pt3);
		x1 = pts_res[n1].x;
		y1 = pts_res[n1].y;
		x2 = pts_res[n2].x;
		y2 = pts_res[n2].y;
		x3 = pts_res[n3].x;
		y3 = pts_res[n3].y;
		var l12 = Math.sqrt((x3-x1)**2 + (y3-y1)**2);
		var l34 = Math.sqrt((x2-x3)**2 + (y2-y3)**2);
		resgrad[n1] += -2 * (l12-l34) * ( x3 - x1 )/l12;
		resgrad[n2] += 2 * (l12-l34) * ( x3 - x1 )/l12;
		resgrad[n3] += 2 * (l12-l34) * ( x2 - x3 )/l34;
		resgrad[npt + n1] += -2 * (l12-l34) * ( y3 - y1 )/l12;
		resgrad[npt + n2] += 2 * (l12-l34) * ( y3 - y1 )/l12;
		resgrad[npt + n3] += 2 * (l12-l34) * ( y2 - y3 )/l34;
		res += l12**2 + l34**2 - 2 * l12 * l34;
	}
	return [res,resgrad];
}


function fletcherLemarechal(pts_res,vecDir){
	var alpha0 = 0;
	var alpha1 = 1000;
	var alpha = 1;
	var status = "keep on"
	while (status == "keep on"){
		cond = condWolfe(alpha,pts_res,vecDir);
		cond1 = cond[0];
		cond2 = cond[1];
		if(!cond1){
			alpha1 = alpha;
			alpha = 0.5 *( alpha0 + alpha1 );
		} else {
			if(cond2){
				status = "stop";
			} else {
				alpha0 = alpha;
				if (alpha1==100){
					alpha = 2*alpha0;
				} else {
					alpha = 0.5 * ( alpha0 + alpha1 );
				}
			}
		};
		// conditions d'arrêt qui dépannent mais qui sont pas top top
		if(alpha<1e-10 || alpha0 == alpha1 || alpha == alpha1 || alpha == alpha0){ 
			status = "stop";
		};
	}
	return alpha
}

function condWolfe(alpha,pts_res,vecDir){
	var pts_res_cor = [];
	var res1, res2;
	var npt = pts_res.length;
	var omega1 = 0.001, omega2 = 0.999;
	
	for(var i=0;i<pts_res.length;i++){
		posx = pts_res[i].x + alpha*vecDir[i];
		posy = pts_res[i].y + alpha*vecDir[npt+i];
		pts_res_cor[i] = new Point(posx,posy);
	}
	grad = gradSig(pts_res_cor);
	sig_cor = grad[0];
	grad_sig_cor = grad[1]
	grad = gradSig(pts_res);
	sig = grad[0];
	grad_sig = grad[1];
	var prod1 = prodVect(vecDir,grad_sig);
	res1 = sig + omega1 * alpha * prod1;
	if (sig_cor <= res1 || sig_cor<1e-5){
		cond1 = true;
	} else {
		cond1 = false;
	}
	res1 = prodVect(vecDir,grad_sig_cor);
	res2 = omega2 * prodVect(vecDir,grad_sig);
	if (res1 >= res2){
		cond2 = true;
	} else {
		cond2 = false;
	}
	return [cond1,cond2];
}

function updateHessian(matH,vecY,deltaX){
	var vec1=[],vec2=[], vec3=[]; 
	var res2, res3;
	var nn = matH.length, mm = vecY.length;
	var matH_res
	var term2 = [], term1 = [];
	term1.length = nn;
	term2.length = nn;
	vec1.length = nn;
	vec2.length = mm;
	vec3.length = mm;
	// premier coeff
	vec2 = multMatVect(matH,vecY);
	res3 = prodVect(vecY,vec2);
	res2 = prodVect(deltaX,vecY);
	coeff1 = 1 + res3/res2;
	// premier terme
	vec1 = prodVect2(deltaX,deltaX);
	res2 = prodVect(deltaX,vecY);
	coeff1 = coeff1/res2;
	term1 = vecMult(coeff1,vec1);
	// deuxième terme
	vec2 = multMatVect(matH,vecY);
	vec1 = prodVect2(vec2,deltaX);
	res3 = prodVect(deltaX,vecY);
	for(var i=0;i<mm;i++){
		for(var j=0;j<mm;j++){
			term2[i*mm+j]=-(vec1[i*mm+j]+vec1[j*mm+i])/res3;
		}
	}
	matH_res = vecSum(term1,term2);
	matH_res = vecSum(matH,matH_res);
	return matH_res
}
