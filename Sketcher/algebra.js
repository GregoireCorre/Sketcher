
function normL2(vect){
	res = 0;
	for(var i=0;i<vect.length;i++){
		res += vect[i]**2
	}
	res = Math.sqrt(res);
	return res;
}

function multMatVect(A,B){ // multitplie la matrice carrée A avec le vecteur B
	var res = [];
	res.length = B.length;
	res.fill(0);
	var nn = B.length;
	for (var i=0;i<nn;i++){
		for(var j=0;j<nn;j++){
			res[i] += A[i*nn + j]*B[j];
		}
	}
	return res;
}

function prodVect(U,V){ // le résultat est un scalaire
	var res = 0;
	for (i=0;i<U.length;i++){
		res += U[i]*V[i];
	}
	return res;
}

function prodVect2(U,V){ //  le résultat est une matrice
	var res = [];
	for (i=0;i<U.length;i++){
		for (j=0;j<V.length;j++){
			res[i*V.length+j]=U[i]*V[j];
		}
	}
	return res;
}

function vecMult(alpha,vec){ // multiplication de vec par le scalaire alpha
	var res = [];
	res.length = vec.length;
	for(i=0;i<vec.length;i++){
		res[i] = alpha*vec[i];
	}
	return res;
}

function vecSous(vec1,vec2){ // soustraction vec1 - vec2
	var res = [];
	res.length = vec1.length;
	for(i=0;i<vec1.length;i++){
		res[i]=vec1[i]-vec2[i]
	}
	return res;
}

function vecSum(vec1,vec2){ // addition vec1 + vec2
	var res = [];
	res.length = vec1.length;
	for(i=0;i<vec1.length;i++){
		res[i]=vec1[i]+vec2[i]
	}
	return res;
}