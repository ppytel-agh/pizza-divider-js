var canvas = document.getElementById("canvas1");
var ctx = canvas.getContext("2d");
var punkty = 0;
var obpunkty = [];
var domknij = false;
var img = document.getElementById("pat1");
var pat1 = undefined;
img.addEventListener('load',function(){pat1 = ctx.createPattern(img,'repeat');});

var dodajpunkt = function(a){
	if(domknij){
		obpunkty.push({x:obpunkty[0].x,y:obpunkty[0].y});
		canvas.removeEventListener('click',dodajpunkt);
		canvas.removeEventListener('mousemove',next);
		narysuj();
	}else{
		punkty++;
		obpunkty.push({x:a.layerX,y:a.layerY});
		rysuj();
	}
};
canvas.addEventListener("click",dodajpunkt);

var next = function(clicker2){
	if(punkty>0){
		rysuj();
		ctx.beginPath();
		ctx.moveTo(obpunkty[punkty-1].x,obpunkty[punkty-1].y);
		if(punkty > 2){
			//console.log("("+obpunkty[0].x+','+obpunkty[0].y+")  ("+clicker2.layerX+','+clicker2.layerY+')');
			var odleglosc = Math.abs(Math.sqrt(Math.pow((clicker2.layerX-obpunkty[0].x),2)+Math.pow((clicker2.layerY-obpunkty[0].y),2)));
			if(odleglosc<=10){
				ctx.lineTo(obpunkty[0].x,obpunkty[0].y);
			}else{
				ctx.lineTo(clicker2.layerX,clicker2.layerY);
			}
		}else{
			ctx.lineTo(clicker2.layerX,clicker2.layerY);
		}
		ctx.stroke();
		if(odleglosc<=10){
			ctx.beginPath();
			ctx.arc(obpunkty[0].x,obpunkty[0].y,5,0,Math.PI*2);
			ctx.fillStyle="red";
			ctx.fill();
			domknij = true;
		}else{
			domknij = false;
		}
	}
};
canvas.addEventListener("mousemove",next);

function rysuj(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	if(punkty == 1){
		ctx.beginPath();
		ctx.moveTo(obpunkty[0].x,obpunkty[0].y);
		ctx.lineTo(obpunkty[0].x+1,obpunkty[0].y+1);
		ctx.stroke();
	}else{
		ctx.beginPath();
		ctx.moveTo(obpunkty[0].x,obpunkty[0].y);
	}
	var x;
	for(x = 1;x<obpunkty.length;x++){
		ctx.lineTo(obpunkty[x].x,obpunkty[x].y);
	}
	ctx.stroke();
}
function narysuj(){
	console.log("kuniec");
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.beginPath();
	ctx.moveTo(obpunkty[0].x,obpunkty[0].y);
	for(x = 1;x<obpunkty.length;x++){
		ctx.lineTo(obpunkty[x].x,obpunkty[x].y);
	}
	ctx.fillStyle= pat1;
	ctx.fill();
	ctx.stroke();
}