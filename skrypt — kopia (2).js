var canvas = document.getElementById("canvas1");
var ctx = canvas.getContext("2d");
var punkty = 0;
var obpunkty = [];
var domknij = false;
var img = document.getElementById("pat1");
var pat1 = undefined;
var dodaj = true;
var skret = undefined;
var kon = document.getElementById("konsola");
img.addEventListener('load',function(){pat1 = ctx.createPattern(img,'repeat');});

//funkcje do obliczenia

var punktdzielenia = function(minput){
	console.log("\n\n\n\n");
	var odleglosci = [];
	var min;
	//wyliczenie najblizszego punktu
	for(x in obpunkty){
		odleglosci[x] = Math.abs(Math.sqrt(Math.pow((minput.layerX-obpunkty[x].x),2)+Math.pow((minput.layerY-obpunkty[x].y),2)));
		//console.log(x+": "+odleglosci[x]);
		if(x == 0){
			min = x;
		}else{
			if(odleglosci[x]<odleglosci[min]){
				min = x;
			}
		}
	}
	//liczenie odleglosci od odcinka (w produkcji)
	//pierwszy odcinek - przed najblizszym punktem
	if(min == 0){
		var a1 = (obpunkty[(obpunkty.length-1)].x - obpunkty[min].x)/(obpunkty[(obpunkty.length-1)].y - obpunkty[min].y)
		var b1 = obpunkty[min].y - (a1*obpunkty[min].x);
		var f1 = {a:a1,b:b1};
		console.log("f1: y = "+f1.a+"x+"+f1.b);
	}else{
		var a1 = (obpunkty[(parseInt(min)-1)].x - obpunkty[min].x)/(obpunkty[(parseInt(min)-1)].y - obpunkty[min].y);
		var b1 = obpunkty[min].y - (a1*obpunkty[min].x);
		var f1 = {a:a1,b:b1};
		console.log("f1: y = "+f1.a+"x+"+f1.b);
	}
	if(min == (obpunkty.length-1)){
		var a2 = (obpunkty[0].x - obpunkty[min].x)/(obpunkty[0].y - obpunkty[min].y)
		var b2 = obpunkty[min].y - (a1*obpunkty[min].x);
		var f2 = {a:a2,b:b2};
		console.log("f2: y = "+f2.a+"x+"+f2.b);
	}else{
		var a2 = (obpunkty[(parseInt(min)+1)].x - obpunkty[min].x)/(obpunkty[(parseInt(min)+1)].y - obpunkty[min].y)
		var b2 = obpunkty[min].y - (a1*obpunkty[min].x);
		var f2 = {a:a2,b:b2};
		console.log("f2: y = "+f2.a+"x+"+f2.b);
	}
	narysuj()
	/*ctx.beginPath();
	ctx.translate(minput.layerX,minput.layerY);
	ctx.moveTo(15,15);
	ctx.lineTo(-15,-15);
	ctx.stroke();
	ctx.translate(-minput.layerX,-minput.layerY);*/
	liniepomocnicze(f1,minput);
	liniepomocnicze(f2,minput);
	/*if(op1<op2){
		if(min == 0){
			var min2 = obpunkty.length-1;
		}else{
			var min2 = parseInt(min)-1;
		}
	}else{
		if(min == (obpunkty.length-1)){
			var min2 = 0;
		}else{
			var min2 = parseInt(min)+1;
		}
	}*/
};
//funkcje do rysowania
function liniepomocnicze(f,mysz){
	var a = -f.a;
	
	var x = 15;
	var y = x*a+f.b;
	
	ctx.beginPath();
	ctx.translate(mysz.layerX,mysz.layerY);
	ctx.moveTo(x,y);
	ctx.lineTo(-x,-y);
	ctx.stroke();
	ctx.translate(-mysz.layerX,-mysz.layerY);
}
//odswierza wielokat
function narysuj(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.beginPath();
	ctx.moveTo(obpunkty[0].x,obpunkty[0].y);
	for(x = 1;x<obpunkty.length;x++){
		ctx.lineTo(obpunkty[x].x,obpunkty[x].y);
	}
	ctx.lineTo(obpunkty[0].x,obpunkty[0].y);
	ctx.fillStyle= pat1;
	ctx.fill();
	ctx.stroke();
}

//dodaje punkt
var dodajpunkt = function(a){
	if(domknij){
		obpunkty.push({x:obpunkty[0].x,y:obpunkty[0].y});
		canvas.removeEventListener('click',dodajpunkt);
		canvas.removeEventListener('mousemove',next);
		obpunkty.pop();
		narysuj();
		canvas.addEventListener("mousemove",punktdzielenia);
	}else{
		if(dodaj){
			if(punkty == 2){
				skret(a);
			}
			punkty++;
			obpunkty.push({x:a.layerX,y:a.layerY});
			rysuj();
		}
	}
};
canvas.addEventListener("click",dodajpunkt);


//pokazuje zarys nastepnej linii
var next = function(clicker2){
	if(punkty>0){
		rysuj();
		ctx.beginPath();
		ctx.moveTo(obpunkty[punkty-1].x,obpunkty[punkty-1].y);
		if(punkty > 2){
			var gut = sprawdzskret(clicker2);
			if(gut){
				dodaj = true;
				var odleglosc = Math.abs(Math.sqrt(Math.pow((clicker2.layerX-obpunkty[0].x),2)+Math.pow((clicker2.layerY-obpunkty[0].y),2)));
				if(odleglosc<=10){
					ctx.lineTo(obpunkty[0].x,obpunkty[0].y);
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
			}else{
				dodaj = false;
				domknij = false;
			}	
		}else{
			dodaj = true;
			ctx.lineTo(clicker2.layerX,clicker2.layerY);
			ctx.stroke();
		}
	}
};
canvas.addEventListener("mousemove",next);

//odswierza zarys
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

//oblicza skret linii lamanej
var skret = function(a){
	var dx1 = obpunkty[1].x-obpunkty[0].x;
	var dy1 = obpunkty[1].y-obpunkty[0].y;
	var k1 = parseInt((Math.atan2(dy1,dx1)/Math.PI)*180);
	var dx2 = a.layerX-obpunkty[1].x;
	var dy2 = a.layerY-obpunkty[1].y;
	var k2 = parseInt((Math.atan2(dy2,dx2)/Math.PI)*180);
	if((k1<=0&&k2<=0)||(k1>=0&&k2>=0)){
		if(k2>k1){
			skret="p";
		}else if(k2<k1){
			skret="l"
		}
	}else{
		if(Math.abs(k1)+Math.abs(k2)>180){
			if(k1<0){
				skret="l";
			}else{
				skret="p";
			}
		}else if(Math.abs(k1)+Math.abs(k2)<180){
			if(k1<0){
				skret="p";
			}else{
				skret="l";
			}
		}
	}
}

//sprawdza czy linia lamie sie w dobra strone
var sprawdzskret = function(a){
	var skret2;
	var dx1 = obpunkty[obpunkty.length-1].x-obpunkty[obpunkty.length-2].x;
	var dy1 = obpunkty[obpunkty.length-1].y-obpunkty[obpunkty.length-2].y;
	var k1 = parseInt((Math.atan2(dy1,dx1)/Math.PI)*180);
	var dx2 = a.layerX-obpunkty[obpunkty.length-1].x;
	var dy2 = a.layerY-obpunkty[obpunkty.length-1].y;
	var k2 = parseInt((Math.atan2(dy2,dx2)/Math.PI)*180);
	if((k1<=0&&k2<=0)||(k1>=0&&k2>=0)){
		if(k2>k1){
			skret2="p";
		}else if(k2<k1){
			skret2="l"
		}
	}else{
		if(Math.abs(k1)+Math.abs(k2)>180){
			if(k1<0){
				skret2="l";
			}else{
				skret2="p";
			}
		}else if(Math.abs(k1)+Math.abs(k2)<180){
			if(k1<0){
				skret2="p";
			}else{
				skret2="l";
			}
		}
	}
	if(skret2==skret){
		var skret2;
		var dx1 = a.layerX-obpunkty[obpunkty.length-1].x;
		var dy1 = a.layerY-obpunkty[obpunkty.length-1].y;
		var k1 = parseInt((Math.atan2(dy1,dx1)/Math.PI)*180);
		var dx2 = obpunkty[0].x-a.layerX;
		var dy2 = obpunkty[0].y-a.layerY;
		var k2 = parseInt((Math.atan2(dy2,dx2)/Math.PI)*180);
		if((k1<=0&&k2<=0)||(k1>=0&&k2>=0)){
			if(k2>k1){
				skret2="p";
			}else if(k2<k1){
				skret2="l"
			}
		}else{
			if(Math.abs(k1)+Math.abs(k2)>180){
				if(k1<0){
					skret2="l";
				}else{
					skret2="p";
				}
			}else if(Math.abs(k1)+Math.abs(k2)<180){
				if(k1<0){
					skret2="p";
				}else{
					skret2="l";
				}
			}
		}
		if(skret2==skret){
			var skret2;
			var dx1 = obpunkty[0].x-a.layerX;
			var dy1 = obpunkty[0].y-a.layerY;
			var k1 = parseInt((Math.atan2(dy1,dx1)/Math.PI)*180);
			var dx2 = obpunkty[1].x-obpunkty[0].x
			var dy2 = obpunkty[1].y-obpunkty[0].y
			var k2 = parseInt((Math.atan2(dy2,dx2)/Math.PI)*180);
			if((k1<=0&&k2<=0)||(k1>=0&&k2>=0)){
				if(k2>k1){
					skret2="p";
				}else if(k2<k1){
					skret2="l"
				}
			}else{
				if(Math.abs(k1)+Math.abs(k2)>180){
					if(k1<0){
						skret2="l";
					}else{
						skret2="p";
					}
				}else if(Math.abs(k1)+Math.abs(k2)<180){
					if(k1<0){
						skret2="p";
					}else{
						skret2="l";
					}
				}
			}
			if(skret2 == skret){
				return true;
			}
		}
	}else{
		return false;
	}
}