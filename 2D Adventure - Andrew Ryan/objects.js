//Generic object class for use with inheritence
class Obj
{
	constructor()
	{
		this.x = 0;
		this.y = 0;
	}	
}

//The longest, grossest function of them all, but does the hefty work of lining the entire arena with trees.
class Tree extends Obj
{
	constructor()
	{
		super();
	}
	render()
	{	
		this.x=0;
		this.y=0;
		for(var st = 0; st < 10; st++)
				{
				ctx.beginPath();
				ctx.lineWidth = 5;
				ctx.strokeStyle = "#a6c840";

				ctx.moveTo(this.x+10, this.y+50);
				ctx.lineTo(this.x+54, this.y+50);
				ctx.lineTo(this.x+32, this.y);
				ctx.lineTo(this.x+11, this.y+51);
				ctx.fillStyle = "#a6c840";
				ctx.fill();
				ctx.stroke();
				
				
				ctx.beginPath();
				ctx.lineWidth = 10;
				ctx.strokeStyle = "#825116";
				ctx.moveTo(this.x+32,this.y+52);
				ctx.lineTo(this.x+32,this.y+64);
				ctx.stroke();
				
				this.x += 64;
				}
				
				this.x = 0;
				this.y = 576;
				for(var sr = 0; sr < 10; sr++)
				{
				ctx.beginPath();
				ctx.lineWidth = 5;
				ctx.strokeStyle = "#a6c840";

				ctx.moveTo(this.x+10, this.y+50);
				ctx.lineTo(this.x+54, this.y+50);
				ctx.lineTo(this.x+32, this.y);
				ctx.lineTo(this.x+11, this.y+51);
				ctx.fillStyle = "#a6c840";
				ctx.fill();
				ctx.stroke();
				
				
				ctx.beginPath();
				ctx.lineWidth = 10;
				ctx.strokeStyle = "#825116";
				ctx.moveTo(this.x+32,this.y+52);
				ctx.lineTo(this.x+32,this.y+64);
				ctx.stroke();
				
				this.x += 64;
				}
				
				this.x = 576;
				this.y = 64;
				for(var sa = 0; sa < 10; sa++)
				{
				ctx.beginPath();
				ctx.lineWidth = 5;
				ctx.strokeStyle = "#a6c840";

				ctx.moveTo(this.x+10, this.y+50);
				ctx.lineTo(this.x+54, this.y+50);
				ctx.lineTo(this.x+32, this.y);
				ctx.lineTo(this.x+11, this.y+51);
				ctx.fillStyle = "#a6c840";
				ctx.fill();
				ctx.stroke();
				
				
				ctx.beginPath();
				ctx.lineWidth = 10;
				ctx.strokeStyle = "#825116";
				ctx.moveTo(this.x+32,this.y+52);
				ctx.lineTo(this.x+32,this.y+64);
				ctx.stroke();
				
				this.y += 64;
				}
				
				 this.x = 0;
				 this.y = 64;
				for(var sb = 0; sb < 10; sb++)
				{
				ctx.beginPath();
				ctx.lineWidth = 5;
				ctx.strokeStyle = "#a6c840";

				ctx.moveTo(this.x+10, this.y+50);
				ctx.lineTo(this.x+54, this.y+50);
				ctx.lineTo(this.x+32, this.y);
				ctx.lineTo(this.x+11, this.y+51);
				ctx.fillStyle = "#a6c840";
				ctx.fill();
				ctx.stroke();
				
				
				ctx.beginPath();
				ctx.lineWidth = 10;
				ctx.strokeStyle = "#825116";
				ctx.moveTo(this.x+32,this.y+52);
				ctx.lineTo(this.x+32,this.y+64);
				ctx.stroke();
				
				this.y += 64;
				}
				//console.log("Trees rendered");
			}
}

//Not as ugly as the trees, this one is responsible for placing those annoying obstacles you get stuck on
//Are they bricks? Rocks? Boulders? Nobody knows.
class Brick extends Obj
{
	constructor()
	{
		super();
		this.x=128;
		this.y=128;
	}
	render()
	{	
		this.x=128;
		this.y=128;
		var done = false;
		var cntrl = 15;
		var rockNum = 0;
		ctx.lineWidth = 2;
		while(done == false) {
			if(cntrl == 0) {
				done = true;
			}
			ctx.beginPath();
			ctx.arc(this.x+32,this.y,32,0,180*Math.PI/180,true); //Clockwise
			ctx.fillStyle = "#763931";
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(this.x,this.y);
			ctx.lineTo(this.x,this.y);
			ctx.stroke();
			
			switch(true) {
				case rockNum == 0:
					this.x = 448;
					//console.log("rock1");
				break;
				
				case rockNum == 1:
					this.x = 512;
				break;
				
				case rockNum == 2:
					this.x = 192;
					this.y = 192;
				break;
				
				case rockNum == 3:
					this.y = 256;
				break;
				
				case rockNum == 4:
					this.x = 256;
					//console.log("rock4");
				break;
				
				case rockNum == 5:
					this.x = 321;
				break;
				
				case rockNum == 6:
					this.x = 320;
					this.y = 384;
				break;
				
				case rockNum == 7:
					this.x = 128;
					this.y = 448;
				break;
				
				case rockNum == 8:
					this.x = 320;
				break;
				
				case rockNum == 9:
					this.x = 384;
					//console.log("rock9");
				break;
				
				case rockNum == 10:
					this.x = 128;
					this.y = 512;
				break;
				
				case rockNum == 11:
					this.x = 192;
				break;
				
				case rockNum == 12:
					this.x = 448;
				break;
				
				case rockNum == 13:
					this.x =512;
					this.y = 576;
				break;
				
				case rockNum == 14:
					done = true;
					//console.log("rock14");
				break;
			}
			cntrl--;
			rockNum++;
			//console.log("Bricks rendered");
		}
			
	
	
}
}

//The humble potion class. You heal us once, then are gone forever. What would we do without you?
class Potion extends Obj
{
	constructor(x,y)
	{
		super();
		this.x=x;
		this.y=y;
		this.used = false;
	}
	update()
	{
		
	}
	render()
	{	
			if(this.used == false) {	
			console.log("Potion rendered");
			ctx.drawImage(document.getElementById("potion"),this.x,this.y);
			}
	}
	
	
}