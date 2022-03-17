var canvas = document.getElementById("canvas1");
var ctx = canvas.getContext("2d");
var l_punktow = 0;
var punkty = [];
var proste = [];
var stan=0;//0-poczatek 1-obrano pierwszy punkt, 2-obrano dwa punkty, 3-obrano trzy punkty, 4-narysowano wielokat, 5-wyznaczono miejsce przeciecia
var pozycjaKursora={x:-1,y:-1};
var interwal = undefined;
var odnoga=false;

var najblizszyPunkt=[];
var punktNaProstej=[];
var odleglosc=[];
var przyleglyDoProstej=[];
var czyZawieraSiewOdcinku=[];

var miejscePrzeciecia=undefined;
var przylegaDo=undefined;
var wachlarze=[];
var punktDzielacy=undefined;

var domknij = false;
var img = document.getElementById("pat1");
var pat1 = undefined;
var dodaj = true;
var skret = undefined;
var kon = document.getElementById("konsola");
//img.addEventListener('load',function(){pat1 = ctx.createPattern(img,'repeat');});
window.onload=function(){
	pat1 = ctx.createPattern(img,'repeat');
}

//------------------------------------------	
	//funkcje kontrolne
	
//interwał programu
var funkcjaInterwalowa=function(){
	//console.log("eloxD");
	czyscEkran();
	if(stan>0&&stan<4){
		rysujProste();
		rysuj();
		if(stan==3){
			rysujZielonke();
		}
		rysujOdnoge();
	}
	if(stan>=4){
		//rysujProste();
		narysuj();
		//rysujOdleglosci();
	}
	if(stan==4){
		rysujKropke();
		narysujPrzeciecie();
	}else if(stan==5){
		narysujPrzeciecie();
	}
}

//klik w canvasie
var klik = function(a){
	//dodaje nowy punkt
	if(stan < 4){
		dodajPunkt(a);
	}else if(stan==4){
		wyznaczMiejscePrzeciecia();
		obliczPolaWachlarza();
		porownajPola();
	}
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
	if(stan<4){
		pokaNastepny();
	}else if(stan==4){
		znajdzNajblizszyPunkt();
		znajdzProstaPrzylegla();
		wyznaczMiejscePrzeciecia();
		obliczPolaWachlarza();
		porownajPola();
	}
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
				znajdzNajblizszyPunkt();
				znajdzProstaPrzylegla();
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
	var odleglosc=odlegloscPunktow(punkty[0],pozycjaKursora);
	//console.log(odleglosc);
	if(odleglosc<=15){
		return true;
	}else{
		return false;
	}
}

//znajduje punkty najblizej kursora
var znajdzNajblizszyPunkt=function(){
	var zwrot=0;
	var najblizsza = odlegloscPunktow(punkty[0],pozycjaKursora);
	for(var i=1;i<l_punktow;i++){
		var tmpodl=odlegloscPunktow(punkty[i],pozycjaKursora);
		if(tmpodl<najblizsza){
			zwrot=i;
			najblizsza=tmpodl;
		}
	}
	najblizszyPunkt[0]=zwrot;
	//najblizsza=undefined;
	var tmp1,tmp2;
	var i1=(najblizszyPunkt[0]+l_punktow-1)%l_punktow;
	var i2=(najblizszyPunkt[0]+1)%l_punktow;
	tmp1=odlegloscPunktow(punkty[i1],pozycjaKursora);
	tmp2=odlegloscPunktow(punkty[i2],pozycjaKursora);	
	if(tmp1<=tmp2){
		najblizszyPunkt[1]=i1;
		najblizszyPunkt[2]=i2;
	}else{
		najblizszyPunkt[1]=i2;
		najblizszyPunkt[2]=i1;
	}
}

//oblicz do ktorej prostej zbliza sie kursor
var znajdzProstaPrzylegla=function(){
	var szukane=[];
	szukane[0]=proste[najblizszyPunkt[0]];
	szukane[1]=proste[(najblizszyPunkt[0]+l_punktow-1)%l_punktow];
	var odleglosci=[];
	var szukanePunkty=[];
	var czywDziedzinie=[];
	for(var i=0;i<2;i++){
		//console.log(szukane[i]);
		odleglosci[i]=dOdl(pozycjaKursora,szukane[i]);
		//punkt przeciecia prostej prostopadelj i wogole
		var tmpProsta;
		if(szukane[i].a==undefined){
			//
			tmpProsta={a:0,b:pozycjaKursora.y};
		}else if(szukane[i].a==0){
			tmpProsta={a:undefined,b:pozycjaKursora.x};
		}else{
			var tmpa=-1/szukane[i].a;
			var tmpb=pozycjaKursora.y-(tmpa*pozycjaKursora.x);
			tmpProsta={a:tmpa,b:tmpb};
			//console.log(tmpProsta);	
		}
		szukanePunkty[i]=ukladProstych(szukane[i],tmpProsta);
	}
	//oblicz czy punkt znajduje sie na odcinku
	var bliskaProsta=[];
	for(var i=0;i<2;i++){
		var i1=najblizszyPunkt[0];
		var i2;
		if(i==0){
			i2=(najblizszyPunkt[0]+1)%l_punktow;
			bliskaProsta[i]=i1;
		}else{
			i2=(najblizszyPunkt[0]+l_punktow-1)%l_punktow;
			bliskaProsta[i]=i2;
		}
		if((szukanePunkty[i].x>punkty[i1].x && szukanePunkty[i].x>punkty[i2].x)||
		(szukanePunkty[i].x<punkty[i1].x && szukanePunkty[i].x<punkty[i2].x)||
		(szukanePunkty[i].y > punkty[i1].y && szukanePunkty[i].y > punkty[i2].y)||
		((szukanePunkty[i].y < punkty[i1].y && szukanePunkty[i].y < punkty[i2].y))
		){
			czywDziedzinie[i]=false;
		}else{
			czywDziedzinie[i]=true;
		}
	}
	if(odleglosci[0]<=odleglosci[1]){
		punktNaProstej[0]=szukanePunkty[0];
		odleglosc[0]=odleglosci[0];
		czyZawieraSiewOdcinku[0]=czywDziedzinie[0];
		przyleglyDoProstej[0]=bliskaProsta[0];
		punktNaProstej[1]=szukanePunkty[1];
		odleglosc[1]=odleglosci[1];
		czyZawieraSiewOdcinku[1]=czywDziedzinie[1];
		przyleglyDoProstej[1]=bliskaProsta[1];
	}else{
		punktNaProstej[0]=szukanePunkty[1];
		odleglosc[0]=odleglosci[1];
		czyZawieraSiewOdcinku[0]=czywDziedzinie[1];
		przyleglyDoProstej[0]=bliskaProsta[1];
		punktNaProstej[1]=szukanePunkty[0];
		odleglosc[1]=odleglosci[0];
		czyZawieraSiewOdcinku[1]=czywDziedzinie[0];
		przyleglyDoProstej[1]=bliskaProsta[0];
	}
}

//przejscie do stanu 5
var wyznaczMiejscePrzeciecia=function(){
	if(czyZawieraSiewOdcinku[0]){
		miejscePrzeciecia=punktNaProstej[0];
		przylegaDo=przyleglyDoProstej[0];
		//stan=5;
	}
}

//
var obliczPolaWachlarza=function(){
	for(var i=0;i<(l_punktow-1);i++){
		var i1=(przylegaDo+1+i)%l_punktow;
		var i2=(przylegaDo+2+i)%l_punktow;
		var p1=punkty[i1];
		var p2=punkty[i2];
		var tmpPole=Math.abs(((p1.x-miejscePrzeciecia.x)*(p2.y-miejscePrzeciecia.y))-((p1.y-miejscePrzeciecia.y)*(p2.x-miejscePrzeciecia.x)));
		wachlarze[i]=tmpPole;
		//console.log(tmpPole);
	}
}

var porownajPola=function(){
	var sumaPol;
	for(var i=0;i<wachlarze.length;i++){
		sumaPol+=wachlarze[i];
	}
	var i1=0;
	var i2=(wachlarze.length-1);
	var s1=wachlarze[i1];
	var s2=wachlarze[i2];
	while(Math.abs(i1-i2)>1){
		if(s1>s2){
			i2--;
			s2+=wachlarze[i2];
		}else if(s2>s1){
			i1++;
			s1+=wachlarze[i1];
		}else{
			if(Math.abs(i1-i2)==2){
				//przedziel ostatni trojkat na pół
			}else{
				i1++;
				s1+=wachlarze[i1];
				i2--;
				s2+=wachlarze[i2];
			}
		}
	}
	//console.log(s1);
	//console.log(s2);
	//polowa roznicy miedzy polami
	if(s1>s2){
		//podziel trojkat i1
		var prostaDoPodzielenia=(przylegaDo+1+i1)%l_punktow;
		var obProstej=proste[prostaDoPodzielenia];
		var wysokosc=dOdl(miejscePrzeciecia,obProstej);
		//console.log(wysokosc);
		var roznica = s1-s2;
		//console.log(roznica)
		var odcinek = (roznica/2)/wysokosc;
		var p1=punkty[(prostaDoPodzielenia+1)%l_punktow];
		var p2=punkty[prostaDoPodzielenia];
		var r2=odlegloscPunktow(p1,p2)-odcinek;
		//console.log(odlegloscPunktow(p1,p2));
		//console.log(odcinek);
		//console.log(r2);
		if(obProstej.a==undefined){
		}else{
			var szukaneX=(Math.pow(odcinek,2)-Math.pow(r2,2)+Math.pow(p2.x,2)+Math.pow(obProstej.a*p2.x,2)-Math.pow(p1.x,2)-Math.pow(obProstej.a*p1.x,2))/
			(2*(p2.x+(Math.pow(obProstej.a,2)*p2.x)-p1.x-(Math.pow(obProstej.a,2)*p1.x)));
			var szukaneY=obProstej.a*szukaneX+obProstej.b;
			punktDzielacy={x:Math.round(szukaneX),y:Math.round(szukaneY)};
		}
	}else if(s2>s1){
		//podziel trojkat i2
		var prostaDoPodzielenia=(przylegaDo+1+i2)%l_punktow;
		var obProstej=proste[prostaDoPodzielenia];
		var wysokosc=dOdl(miejscePrzeciecia,obProstej);
		var roznica = s2-s1;
		var odcinek = (roznica/2)/wysokosc;
		var p1=punkty[prostaDoPodzielenia];
		var p2=punkty[(prostaDoPodzielenia+1)%l_punktow];
		var r2=odlegloscPunktow(p1,p2)-odcinek;
		//console.log(odlegloscPunktow(p1,p2));
		//console.log(odcinek);
		//console.log(r2);
		if(obProstej.a==undefined){
			
		}else{
			var szukaneX=(Math.pow(odcinek,2)-Math.pow(r2,2)+Math.pow(p2.x,2)+Math.pow(obProstej.a*p2.x,2)-Math.pow(p1.x,2)-Math.pow(obProstej.a*p1.x,2))/
			(2*(p2.x+(Math.pow(obProstej.a,2)*p2.x)-p1.x-(Math.pow(obProstej.a,2)*p1.x)));
			var szukaneY=obProstej.a*szukaneX+obProstej.b;
			punktDzielacy={x:Math.round(szukaneX),y:Math.round(szukaneY)};
		}
	}else{
		
	}
}

//------------------------
//ogolne matematyczne

//odległość między punktami
var odlegloscPunktow=function(punktA,punktB){
	var zwrot=Math.sqrt(Math.pow(punktA.x-punktB.x,2)+Math.pow(punktA.y-punktB.y,2));
	return zwrot;
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

//zwraca punkt przeciecia prostych
var ukladProstych=function(prostaA,prostaB){
	var zwrot;
	if(prostaA.a==prostaB.a){
		return undefined;
	}
	if(prostaA.a==undefined||prostaB.a==undefined){
		if(prostaA.a==undefined){
			zwrot={x:prostaA.b,y:prostaB.a*prostaA.b+prostaB.b};
		}else{
			zwrot={x:prostaB.b,y:prostaA.a*prostaB.b+prostaA.b};
		}
	}else{
		if(Math.abs(prostaA.a)<=1){
			var szukanyX=Math.round((prostaB.b-prostaA.b)/(prostaA.a-prostaB.a));
			zwrot={x:szukanyX,y:Math.round(prostaA.a*szukanyX+prostaA.b)};
		}else{
			var szukanyY=Math.round(((prostaB.b*prostaA.a)-(prostaA.b*prostaB.a))/(prostaA.a-prostaB.a));
			zwrot={x:Math.round((szukanyY-prostaA.b)/prostaA.a),y:szukanyY};
		}
	}
	return zwrot;
}

var dOdl=function(punkt,prosta){
	if(prosta.a==undefined){
		var odleglosc=Math.abs(prosta.b-punkt.x);
	}else{
		var A=prosta.a;
		var B=-1;
		var C=prosta.b;
		var odleglosc = Math.abs(A*punkt.x+B*punkt.y+C)/Math.sqrt(Math.pow(A,2)+Math.pow(B,2));
	}
	return odleglosc;
}

/*
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

var rysujZielonke=function(){
	var tmpProsta=f_liniowa(punkty[0],punkty[l_punktow-1]);
	var punktPrzeciecia = ukladProstych(proste[0],proste[l_punktow-2]);
	var czworokat=false;
	if(punktPrzeciecia != undefined){
		if((punktPrzeciecia.x >= 0 && punktPrzeciecia.x <= canvas.width) && (-punktPrzeciecia.y>=0 && -punktPrzeciecia.y <= canvas.height)){
			if(tmpProsta.a==undefined){
				if(punkty[1].x>tmpProsta.b){
					if(punktPrzeciecia.x>tmpProsta.b){
						czworokat=true;
					}
				}else{
					if(punktPrzeciecia.x<tmpProsta.b){
						czworokat=true;
					}
				}
			}else{
				var tmpy=Math.round(punkty[1].x*tmpProsta.a+tmpProsta.b);
				var tmpy2=Math.round(punktPrzeciecia.x*tmpProsta.a+tmpProsta.b);
				if(punkty[1].y<tmpy){
					if(punktPrzeciecia.y<tmpy2){
						czworokat=true;
					}
				}else{
					if(punktPrzeciecia.y>tmpy2){
						czworokat=true;
					}
				}
			}
		}else{
			czworokat=true;
		}
	}else{
		czworokat=true;
	}
	if(!czworokat){
		ctx.beginPath();
		ctx.fillStyle="lightgreen";
		ctx.moveTo(punkty[0].x,-punkty[0].y);
		ctx.lineTo(punkty[l_punktow-1].x,-punkty[l_punktow-1].y);
		ctx.lineTo(punktPrzeciecia.x,-punktPrzeciecia.y);
		ctx.lineTo(punkty[0].x,-punkty[0].y);
		ctx.fill();
		ctx.closePath();
	}else{
		var p=[[],[]];
		for(var i=0;i<2;i++){
			if(i==0){
				var tmpProsta=proste[0];
			}else{
				var tmpProsta=proste[l_punktow-2];
			}
			if(tmpProsta.a==undefined){
				p[i][0]={x:Math.round(tmpProsta.b),y:0};
				p[i][1]={x:Math.round(tmpProsta.b),y:-canvas.height};
			}else{
				p[i][0]={x:-10000,y:Math.round(tmpProsta.a*-10000+tmpProsta.b)};
				p[i][1]={x:10000,y:Math.round(tmpProsta.a*10000+tmpProsta.b)};
			}
		}
		var p1,p2;
		if(tmpProsta.a==undefined){
			if(punkty[1].x>tmpProsta.b){
				p1=p[0][0];
				p2=p[0][0];
			}else{
				p1=p[0][1];
				p2=p[0][1];
			}
		}else{
			if(punkty[1].x>punkty[0].x){
				p1=p[0][0];
			}else{
				p1=p[0][1];
			}
			if(punkty[l_punktow-2].x>punkty[l_punktow-1].x){
				p2=p[1][0];
			}else{
				p2=p[1][1];
			}
		}
		ctx.beginPath();
		ctx.fillStyle="lightgreen";
		ctx.moveTo(punkty[0].x,-punkty[0].y);
		ctx.lineTo(punkty[l_punktow-1].x,-punkty[l_punktow-1].y);
		ctx.lineTo(p2.x,-p2.y);
		ctx.lineTo(p1.x,-p1.y);
		ctx.lineTo(punkty[0].x,-punkty[0].y);
		ctx.fill();
		ctx.closePath();
	}
}

var rysujOdnoge=function(){
	if(odnoga){
		ctx.beginPath();
		ctx.strokeStyle="red";
		ctx.moveTo(punkty[l_punktow-1].x,-punkty[l_punktow-1].y);
		ctx.lineTo(pozycjaKursora.x,-pozycjaKursora.y);
		ctx.stroke();
		ctx.closePath();
	}
}

var rysujOdleglosci=function(){
	for(var tmp of punkty){
		ctx.beginPath();
		ctx.strokeStyle="blue";
		ctx.moveTo(pozycjaKursora.x,-pozycjaKursora.y);
		ctx.lineTo(tmp.x,-tmp.y);
		ctx.stroke();
		ctx.closePath();
	}
	//najblizszaProsta
	ctx.beginPath();
	ctx.strokeStyle="red";
	ctx.strokeWidth=2;
	ctx.moveTo(punkty[najblizszyPunkt[0]].x,-punkty[najblizszyPunkt[0]].y);
	ctx.lineTo(punkty[najblizszyPunkt[1]].x,-punkty[najblizszyPunkt[1]].y);
	ctx.stroke();
	ctx.closePath();
	for(var i=0;i<3;i++){
		var kolor;
		switch(i){
			case 0:
			kolor="red";
			break;
			case 1:
			kolor="orange";
			break;
			case 2:
			kolor="yellow";
			break;
		}
		ctx.beginPath();
		ctx.fillStyle=kolor;
		ctx.strokeStyle="black";
		ctx.moveTo(punkty[najblizszyPunkt[i]].x,-punkty[najblizszyPunkt[i]].y);
		ctx.arc(punkty[najblizszyPunkt[i]].x,-punkty[najblizszyPunkt[i]].y,5,0,2*Math.PI);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
	}
	for(var i=0;i<2;i++){
	//punkt na najbliszej prostej
		var kolor1,kolor2;
		if(i==0){
			if(czyZawieraSiewOdcinku[0]==false){
				kolor1="red";
			}else{
				kolor1="green";
			}
			kolor2="green";
		}else{
			if(czyZawieraSiewOdcinku[1]==false){
				kolor1="red";
			}else{
				kolor1="blue";
			}
			kolor2="blue";
		}
		ctx.beginPath();
		ctx.strokeStyle=kolor1;
		ctx.moveTo(pozycjaKursora.x,-pozycjaKursora.y);
		ctx.lineTo(punktNaProstej[i].x,-punktNaProstej[i].y);
		ctx.stroke();
		ctx.closePath();
		ctx.beginPath();
		ctx.strokeStyle="black";
		ctx.fillStyle=kolor2;
		ctx.arc(punktNaProstej[i].x,-punktNaProstej[i].y,5,0,2*Math.PI);
		ctx.fill();
		ctx.stroke;
		ctx.closePath();
	}
}

var rysujKropke=function(){
	if(czyZawieraSiewOdcinku[0] && odleglosc[0]<15){
		ctx.beginPath();
		ctx.strokeStyle="black";
		ctx.fillStyle="green";
		ctx.moveTo(punktNaProstej[0].x,-punktNaProstej[0].y);
		ctx.arc(punktNaProstej[0].x,-punktNaProstej[0].y,5,0,2*Math.PI);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
	}
}

var narysujPrzeciecie=function(){
	ctx.beginPath();
	ctx.fillStyle="green";
	ctx.strokeStyle="black";
	ctx.moveTo(miejscePrzeciecia.x,-miejscePrzeciecia.y);
	ctx.arc(miejscePrzeciecia.x,-miejscePrzeciecia.y,5,0,2*Math.PI);
	ctx.stroke();
	ctx.fill();
	ctx.closePath();
	/*
	var i1=przylegaDo;
	var i2=(przylegaDo+1)%l_punktow;
	for(var i=0;i<l_punktow;i++){
		if(i==i1 || i==i2){
			continue;
		}
		ctx.beginPath();
		ctx.strokeStyle="blue";
		ctx.moveTo(miejscePrzeciecia.x,-miejscePrzeciecia.y);
		ctx.lineTo(punkty[i].x,-punkty[i].y);
		ctx.stroke();
		ctx.closePath();
	}
	*/
	if(punktDzielacy!=undefined){
		ctx.beginPath();
		ctx.strokeStyle="green";
		ctx.moveTo(miejscePrzeciecia.x,-miejscePrzeciecia.y);
		ctx.lineTo(punktDzielacy.x,-punktDzielacy.y);
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

