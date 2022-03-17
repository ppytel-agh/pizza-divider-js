var canvas = document.getElementById("canvas1");
var ctx = canvas.getContext("2d");
var r = canvas.height/2;
function figura(){
	ctx.beginPath();
	ctx.arc(0,0,r,0,Math.PI*(1/2));
	ctx.fill();
	ctx.stroke();
	ctx.translate(canvas.width,0);
	ctx.beginPath();
	ctx.arc(0,0,r,(1/2)*Math.PI,Math.PI);
	ctx.fill();
	ctx.stroke();
	ctx.translate(0,canvas.height);
	ctx.beginPath();
	ctx.arc(0,0,r,Math.PI,Math.PI*(3/2));
	ctx.fill();
	ctx.stroke();
	ctx.translate(-canvas.width,0);
	ctx.beginPath();
	ctx.arc(0,0,r,Math.PI*1.5,0);
	ctx.fill();
	ctx.stroke();
}
function kolo(){
	ctx.translate(r,r);
	ctx.beginPath();
	ctx.arc(0,0,r,0,Math.PI*(1/2));
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(0,0,r,(1/2)*Math.PI,Math.PI);
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(0,0,r,Math.PI,Math.PI*(3/2));
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(0,0,r,Math.PI*1.5,0);
	ctx.fill();
	ctx.stroke();
}