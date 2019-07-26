var goption = {};

goption.bbreit = window.innerWidth;
goption.bhoch  = window.innerHeight;


function KastenClass(x,y,breit,hoch){
	
	this.x   	 = x;
	this.y   	 = y;
	this.art 	 = false;
	this.breit 	 = breit;
	this.hoch 	 = hoch;
	this.showed  = false;
	this.Nachbar = Array();
	this.Text	 = "";
	this.flaged	 = false;
}


function FeldClass(breit, hoch, anzahl){

	var self = this;
	
	this.breit = breit;
	this.hoch = hoch;
	this.anzahl = anzahl;
	
	var feldarr = Array();
	
	for(var x=0; x<breit; x++){
		
		for(var y=0; y<hoch; y++){
			
			feldarr.push(new KastenClass(x*20,y*20,19,19));
			
		}
	}
	
	this.getIndexField = function(fx,fy){
		var count = -1;
	
		for(var x=0; x<breit; x++){
			
			for(var y=0; y<hoch; y++){
				
				count++;
				if(fx == x && fy == y){
					return count;
				}
			}
		}
		return -1;
	}
	
	
	{
		var arrcounti = 0;
		
		
		for(var x=0; x<breit; x++){
			
			for(var y=0; y<hoch; y++){
				
				
				var tmp = self.getIndexField(x-1, y-1);
				if(tmp != -1)
					feldarr[arrcounti].Nachbar.push(feldarr[tmp]);
					
				var tmp = self.getIndexField(x, y-1);
				if(tmp != -1)
					feldarr[arrcounti].Nachbar.push(feldarr[tmp]);
					
				var tmp = self.getIndexField(x+1, y-1);
				if(tmp != -1)
					feldarr[arrcounti].Nachbar.push(feldarr[tmp]);
					
				var tmp = self.getIndexField(x+1, y);
				if(tmp != -1)
					feldarr[arrcounti].Nachbar.push(feldarr[tmp]);
					
				var tmp = self.getIndexField(x+1, y+1);
				if(tmp != -1)
					feldarr[arrcounti].Nachbar.push(feldarr[tmp]);
					
				var tmp = self.getIndexField(x, y+1);
				if(tmp != -1)
					feldarr[arrcounti].Nachbar.push(feldarr[tmp]);
					
				var tmp = self.getIndexField(x-1, y+1);
				if(tmp != -1)
					feldarr[arrcounti].Nachbar.push(feldarr[tmp]);
					
				var tmp = self.getIndexField(x-1, y);
				if(tmp != -1)
					feldarr[arrcounti].Nachbar.push(feldarr[tmp]);
				
				
				arrcounti++;
			}
		}
		
		
		var ist = 0;
		while(ist < anzahl){
			var rand = Math.floor(Math.random()*feldarr.length);
			if(feldarr[rand].art == false){
				feldarr[rand].art = true;
				ist++;
			}
		}
		
		
	}
	
	
	this.ckick = function(kx, ky, e){
		
		for(var k = 0;k<feldarr.length; k++){
			
			if(	feldarr[k].x < kx && feldarr[k].x+feldarr[k].breit > kx &&
				feldarr[k].y < ky && feldarr[k].y+feldarr[k].hoch > ky ){
				
				switch (e.which) {
					case 1:
						// alert('Left Mouse button pressed.');
						self.showFeld(feldarr[k]);
						break;
					case 2:
						// alert('Middle Mouse button pressed.');
						break;
					case 3:
						// alert('Right Mouse button pressed.');
						if(!feldarr[k].showed){
							feldarr[k].flaged = (!feldarr[k].flaged);
						}
						
						break;
					default:
						// alert('You have a strange Mouse!');
				}
				
			}
			
		}
	}
	
	this.showFeld = function(obj, duechgang = 0){
		
		if(duechgang > 200){
			setTimeout(function(){
				self.showFeld(obj);
			}, 1);
			return;
		}
		
		if(obj.showed || obj.flaged == true)
			return;
		
		// ist eine Mine -> Zeige slle andere
		if(obj.art == true){
			
			for(var i=0; i<feldarr.length; i++){
				
				if(feldarr[i].art){
					feldarr[i].flaged = false;
					feldarr[i].showed = true;
				}
			}
			return;
		}
		obj.showed = true;
		
		
		
		var manz = self.countMine(obj);
		if(manz > 0){
			obj.Text = manz;
		}
		else{
		
			for(var i=0; i < obj.Nachbar.length; i++){
				
				if(!obj.Nachbar[i].showed)
					self.showFeld(obj.Nachbar[i], duechgang++);
				
			}
		}
		
	}
	
	
	this.draw = function(){
		
		for(var k = 0;k<feldarr.length; k++){
		
			if(feldarr[k].flaged){
				ctx.fillStyle = "#ffff00"; 
			}
			
			else if(feldarr[k].showed){
				
				if(feldarr[k].art == true){
					ctx.fillStyle = "#0000ff";
				}
				else{
					ctx.fillStyle = "#00ff00"; 
				}
				
			}else{
				ctx.fillStyle = "#ff0000"; 
			}
			
			ctx.fillRect(feldarr[k].x, feldarr[k].y, feldarr[k].breit, feldarr[k].hoch);
			
			if(feldarr[k].Text != ""){
				
				ctx.fillStyle = "#ff00ff";
				
				ctx.fillText(feldarr[k].Text,  feldarr[k].x + (feldarr[k].breit/2), feldarr[k].y + (feldarr[k].hoch / 2));
				
			}
		}
	}
	
	
	this.countMine = function(obj){
		var count = 0;
		//console.log(obj.Nachbar);
		
		for(var i=0; i<obj.Nachbar.length; i++){
			
			if(obj.Nachbar[i].art == true){
				count ++;
			}
		}
		
		return count;
	}
}



var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var feld = new FeldClass(72, 47, 400);




function draw(){
	
	ctx.fillStyle = "#aaaaaa"; 
	ctx.fillRect(0, 0, goption.bbreit, goption.bhoch);
	
	feld.draw();
	
	
	
	window.requestAnimationFrame(draw);
}
draw();




window.addEventListener( 'resize', function ( event ) {
	goption.bbreit = window.innerWidth;
	goption.bhoch  = window.innerHeight;
	
	
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
	
}, false );



window.addEventListener("mouseup",function ( e ) {
	
	feld.ckick(e.clientX, e.clientY, e);
	
}, false);



