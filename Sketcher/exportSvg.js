function exportSVG(){
	// var svgData = canvas.outerHTML;
	var svgData = document.createElementNS( "http://www.w3.org/2000/svg", "svg" );
	importCanvas(canvas, svgData);
	var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
	var svgUrl = URL.createObjectURL(svgBlob);
	
	var downloadLink = document.createElement("a");
	downloadLink.href = svgUrl;
	downloadLink.download = "model.svg";
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
}
function importCanvas(sourceCanvas, targetSVG) {
    // get base64 encoded png data url from Canvas
    var img_dataurl = sourceCanvas.toDataURL("image/png");

    var svg_img = document.createElementNS(
        "http://www.w3.org/2000/svg", "image");

    svg_img.setAttributeNS(
        "http://www.w3.org/1999/xlink", "xlink:href", img_dataurl);

    targetSVG.appendChild(svg_img);
}