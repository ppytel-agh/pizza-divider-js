var canvas = document.getElementById("canvas1");
var ctx = canvas.getContext("2d");
var l_punktow = 0;
var punkty = [];
var proste = [];
var stan=0;//0-poczatek 1-obrano pierwszy punkt, 2-obrano dwa punkty, 3-obrano trzy punkty, 4-narysowano wielokat
var pozycjaKursora={x:-1,y:-1};
var interwal = undefined;
var odnoga=false;

var domknij = false;
var img = document.getElementById("pat1");
var pat1 = undefined;
var dodaj = true;
var skret = undefined;
var kon = document.getElementById("konsola");
img.addEventListener('load',function(){pat1 = ctx.createPattern(img,'repeat');});

//------------------------------------------	
	//funkcje kontrolne
	
//interwał programu
var funkcjaInterwalowa=function(){
	//console.log("eloxD");
	czyscEkran();
	if(stan>0&&stan<4){
		rysujProste();
		rysuj();
		rysujOdnoge();
	}else if(stan==4){
		rysujProste();
		narysuj();
	}
}

//klik w canvasie
var klik = function(a){
	//dodaje nowy punkt
	dodajPunkt(a);
	/*
	if(domknij){
		punkty.push({x:punkty[0].x,y:punkty[0].y});
		canvas.removeEventListener('click',dodajpunkt);
		canvas.removeEventListener('mousemove',next);
		punkty.pop();
		narysuj();
		canvas.addEventListener("mousemove",punktdzielenia);
	}else{
		if(dodaj){
			if(punkty == 2){
				skret(a);
			}
			punkty++;
			punkty.push({x:a.layerX,y:a.layerY});
			rysuj();
		}
	}
	*/
};
canvas.addEventListener("click",klik);


//kursor nad obrazem
var kursorNad = function(clicker2){
	//sprawdz czy interwal nie zostal usuniety
	if(interwal==undefined){
		interwal=setInterval(funkcjaInterwalowa,16);
	}
	//pobierz pozycje kursora
	pozycjaKursora={x:clicker2.layerX,y:-clicker2.layerY};
	pokaNastepny();
	/*
	//pokazuje czy mozna dodac nastepny punkt
	if(punkty>0){
		rysuj();
		ctx.beginPath();
		ctx.moveTo(punkty[punkty-1].x,punkty[punkty-1].y);
		if(punkty > 2){
			var gut = sprawdzskret(clicker2);
			if(gut){
				dodaj = true;
				var odleglosc = Math.abs(Math.sqrt(Math.pow((clicker2.layerX-punkty[0].x),2)+Math.pow((clicker2.layerY-punkty[0].y),2)));
				if(odleglosc<=10){
					ctx.lineTo(punkty[0].x,punkty[0].y);
				}else{
					ctx.lineTo(clicker2.layerX,clicker2.layerY);
				}
				ctx.stroke();
				if(odleglosc<=10){
					ctx.beginPath();
					ctx.arc(punkty[0].x,punkty[0].y,5,0,Math.PI*2);
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
	*/
};
canvas.addEventListener("mousemove",kursorNad);

//wyjscie kursora z pola
var wyjscieKursora = function(){
	pozycjaKursora={x:-1,y:-1};
	//zaoszczedzenie zasobów
	clearInterval(interwal);
	interwal=undefined;
}
canvas.addEventListener("mouseout",wyjscieKursora);

//------------------------------------------	
	//funkcje do obliczenia

//dodawanie punktow
var dodajPunkt=function(daneKliku){
	pozycjaKursora={x:daneKliku.layerX,y:-daneKliku.layerY};
	//console.log(daneKliku);
	switch(stan){
		case 0:
			punkty.push({x:pozycjaKursora.x,y:pozycjaKursora.y});
			l_punktow++;
			stan=1;
		break;
		case 1:
			if(wTymSamymMiejscu()){
				punkty.push({x:pozycjaKursora.x,y:pozycjaKursora.y});
				l_punktow++;
				proste.push(f_liniowa(punkty[l_punktow-1],punkty[l_punktow-2]));
				stan=2;
			}
		break;
		case 2:
			if(wTejSamejLinii()){
				punkty.push({x:pozycjaKursora.x,y:pozycjaKursora.y});
				l_punktow++;
				proste.push(f_liniowa(punkty[l_punktow-1],punkty[l_punktow-2]));
				stan=3;
			}
		break;
		case 3:
			if(czyDomyka()){
				proste.push(f_liniowa(punkty[0],punkty[l_punktow-1]));
				stan=4;
			}else{
				if(czyLegitne()){
					punkty.push({x:pozycjaKursora.x,y:pozycjaKursora.y});
					l_punktow++;
					proste.push(f_liniowa(punkty[l_punktow-1],punkty[l_punktow-2]));
				}
			}
		break;
	}
}

var pokaNastepny=function(){
	switch(stan){
		case 1:
			if(wTymSamymMiejscu()){
				odnoga=true;
			}else{
				odnoga=false;
			}
		break;
		case 2:
			if(wTejSamejLinii()){
				odnoga=true;
			}else{
				odnoga=false;
			}
		break;
		case 3:
			if(czyDomyka()){
				pozycjaKursora=punkty[0];
				odnoga=true;
			}else{
				if(czyLegitne()){
					odnoga=true;
				}else{
					odnoga=false;
				}
			}
		break;
	}
}

//czy są w tym samym miejscu
var wTymSamymMiejscu = function(){
	if(pozycjaKursora.x == punkty[l_punktow-1].x && pozycjaKursora.y == punkty[l_punktow-1].y){
		return false;
	}else{
		return true;
	}
}

//czy punkt nie lezy w tej samej lini co poprzedni
var wTejSamejLinii = function(){
	//sprawdz czy punkt znajduje sie w tej samej linii co poprzednie dwa
	var tmpf=f_liniowa(pozycjaKursora,punkty[l_punktow-1]);
	var tmpf2=proste[l_punktow-2];
	if(tmpf.a==tmpf2.a && tmpf.b==tmpf2.b){
		return false;
	}else{
		return true;
	}
}

//czy zwiera sie w trojkacie dozwolonym
var czyLegitne=function(){
	for(var i=0;i<3;i++){
		//0-prosta 0n, 1-prosta 01, 2-prosta n(n-1)
		switch(i){
			case 0:
				var tmpf=f_liniowa(punkty[0],punkty[l_punktow-1]);
				var tmppunkt=punkty[1];
			break;
			case 1:
				var tmpf=proste[0];
				var tmppunkt=punkty[2];
			break;
			case 2:
				var tmpf=proste[l_punktow-2];
				var tmppunkt=punkty[0];
			break;
		}
		if(tmpf.a==undefined){
			//w przypadku gdy jest to prosta pionowa
			if(tmppunkt.x>tmpf.b){
				if(i==0 && pozycjaKursora.x>tmpf.b){
					return false;
				}
				if(i !=0 && pozycjaKursora.x<tmpf.b){
					return false;
				}
			}else{
				if(i==0 && pozycjaKursora.x<tmpf.b){
					return false;
				}
				if(i !=0 && pozycjaKursora.x>tmpf.b){
					return false;
				}
			}
		}else{
			var tmpy=Math.round(tmpf.a*tmppunkt.x+tmpf.b);
			var tmpy2=Math.round(tmpf.a*pozycjaKursora.x+tmpf.b);
			if(tmppunkt.y>tmpy){
				if(i==0 && pozycjaKursora.y>tmpy2){
					return false;
				}
				if(i!=0 && pozycjaKursora.y<tmpy2){
					return false;
				}
			}else{
				if(i==0 && pozycjaKursora.y<tmpy2){
					return false;
				}
				if(i!=0 && pozycjaKursora.y>tmpy2){
					return false;
				}
			}
		}
	}
	return true;
}

//czy punkt moze domknac wielokat
var czyDomyka=function(){
	//oblicz odległość od pierwszego punktu
	var odleglosc=Math.sqrt(Math.pow(punkty[0].x-pozycjaKursora.x,2)+Math.pow(punkty[0].y-pozycjaKursora.y,2));
	console.log(odleglosc);
	if(odleglosc<=15){
		return true;
	}else{
		return false;
	}
}

//obliczanie prostej miedzy punktami A i B
var f_liniowa=function(punktA,punktB){
	if(punktA.x == punktB.x){
		var funkcja={a:undefined,b:punktA.x};
	}else{
		var wspA=(punktB.y-punktA.y)/(punktB.x-punktA.x);
		var wspB=punktA.y-(punktA.x*wspA);
		var funkcja={a:wspA,b:wspB};
	}
	return funkcja;
}

//oblicza punkt dzielenia na pol, DO ROZWINIECIA
var punktdzielenia = function(minput){
	console.log("\n\n\n\n");
	var odleglosci = [];
	var min;
	//wyliczenie najblizszego punktu
	for(x in punkty){
		odleglosci[x] = Math.abs(Math.sqrt(Math.pow((minput.layerX-punkty[x].x),2)+Math.pow((minput.layerY-punkty[x].y),2)));
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
		var a1 = (punkty[(punkty.length-1)].x - punkty[min].x)/(punkty[(punkty.length-1)].y - punkty[min].y)
		var b1 = punkty[min].y - (a1*punkty[min].x);
		var f1 = {a:a1,b:b1};
		console.log("f1: y = "+f1.a+"x+"+f1.b);
	}else{
		var a1 = (punkty[(parseInt(min)-1)].x - punkty[min].x)/(punkty[(parseInt(min)-1)].y - punkty[min].y);
		var b1 = punkty[min].y - (a1*punkty[min].x);
		var f1 = {a:a1,b:b1};
		console.log("f1: y = "+f1.a+"x+"+f1.b);
	}
	if(min == (punkty.length-1)){
		var a2 = (punkty[0].x - punkty[min].x)/(punkty[0].y - punkty[min].y)
		var b2 = punkty[min].y - (a1*punkty[min].x);
		var f2 = {a:a2,b:b2};
		console.log("f2: y = "+f2.a+"x+"+f2.b);
	}else{
		var a2 = (punkty[(parseInt(min)+1)].x - punkty[min].x)/(punkty[(parseInt(min)+1)].y - punkty[min].y)
		var b2 = punkty[min].y - (a1*punkty[min].x);
		var f2 = {a:a2,b:b2};
		console.log("f2: y = "+f2.a+"x+"+f2.b);
	}
	narysuj()
	ctx.beginPath();
	ctx.arc(punkty[min].x,punkty[min].y,5,0,Math.PI*2);
	ctx.fillStyle="red";
	ctx.fill();
	ctx.stroke();
};


/*niepotrzebne
//oblicza skret linii lamanej
var skret = function(a){
	var dx1 = punkty[1].x-punkty[0].x;
	var dy1 = punkty[1].y-punkty[0].y;
	var k1 = parseInt((Math.atan2(dy1,dx1)/Math.PI)*180);
	var dx2 = a.layerX-punkty[1].x;
	var dy2 = a.layerY-punkty[1].y;
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
	var dx1 = punkty[punkty.length-1].x-punkty[punkty.length-2].x;
	var dy1 = punkty[punkty.length-1].y-punkty[punkty.length-2].y;
	var k1 = parseInt((Math.atan2(dy1,dx1)/Math.PI)*180);
	var dx2 = a.layerX-punkty[punkty.length-1].x;
	var dy2 = a.layerY-punkty[punkty.length-1].y;
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
		var dx1 = a.layerX-punkty[punkty.length-1].x;
		var dy1 = a.layerY-punkty[punkty.length-1].y;
		var k1 = parseInt((Math.atan2(dy1,dx1)/Math.PI)*180);
		var dx2 = punkty[0].x-a.layerX;
		var dy2 = punkty[0].y-a.layerY;
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
			var dx1 = punkty[0].x-a.layerX;
			var dy1 = punkty[0].y-a.layerY;
			var k1 = parseInt((Math.atan2(dy1,dx1)/Math.PI)*180);
			var dx2 = punkty[1].x-punkty[0].x
			var dy2 = punkty[1].y-punkty[0].y
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
*/

	
//------------------------------------------	
	//funkcje do rysowania

//czysci ekran
var czyscEkran=function(){
	ctx.beginPath();
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.moveTo(0,0);
	ctx.closePath();
}

//odswierza zarys
var rysuj=function(){
	ctx.beginPath();
	ctx.strokeStyle="black";
	ctx.lineWidth=3;
	ctx.moveTo(punkty[0].x,-punkty[0].y);
	for(x = 1;x<punkty.length;x++){
		ctx.lineTo(punkty[x].x,-punkty[x].y);
	}
	ctx.stroke();
	ctx.closePath();
}

//rysuje proste tworzace wielokat
var rysujProste=function(){
	for(var prosta of proste){
		ctx.beginPath();
		ctx.strokeStyle="blue";
		ctx.lineWidth=1;
		if(prosta.a == undefined){
			ctx.moveTo(prosta.b,0);
			ctx.lineTo(prosta.b,canvas.height);
		}else{
			ctx.moveTo(0,-Math.round(prosta.b));
			ctx.lineTo(canvas.width,-Math.round(canvas.width*prosta.a+prosta.b));
		}
		ctx.stroke();
		ctx.closePath();
		if(stan==3){
			var dodatkowa=f_liniowa(punkty[0],punkty[l_punktow-1]);
			ctx.beginPath();
			ctx.strokeStyle="green";
			if(dodatkowa.a == undefined){
				ctx.moveTo(dodatkowa.b,0);
				ctx.lineTo(dodatkowa.b,canvas.height);
			}else{
				ctx.moveTo(0,-Math.round(dodatkowa.b));
				ctx.lineTo(canvas.width,-Math.round(canvas.width*dodatkowa.a+dodatkowa.b));
			}
			ctx.stroke();
			ctx.closePath();
		}
	}
}

var rysujOdnoge=function(){
	if(stan==3){
		//narysuj obszar w którym można postawić następny punkt
	}
	if(odnoga){
		ctx.beginPath();
		ctx.strokeStyle="red";
		ctx.moveTo(punkty[l_punktow-1].x,-punkty[l_punktow-1].y);
		ctx.lineTo(pozycjaKursora.x,-pozycjaKursora.y);
		ctx.stroke();
		ctx.closePath();
	}
}

//odswierza wielokat
var narysuj = function(){
	ctx.beginPath();
	ctx.strokeStyle="black";
	ctx.lineWidth=1;
	ctx.moveTo(punkty[0].x,-punkty[0].y);
	for(x = 1;x<punkty.length;x++){
		ctx.lineTo(punkty[x].x,-punkty[x].y);
	}
	ctx.lineTo(punkty[0].x,-punkty[0].y);
	ctx.fillStyle= pat1;
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}

