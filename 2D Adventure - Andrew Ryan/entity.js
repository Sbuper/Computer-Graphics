//Generic entity class for use with inheritance
class Entity
{
	constructor()
	{
		this.health = 100;	
		this.maxHealth = 100;
		this.attackBonus = 10;
		this.defenseBonus = 10;
		this.pic = "NA";
		this.x;
		this.y;
	}	
	
	//The other half of the combat handling. This part does all the calculations.
	combat(atkbon){
		var dmg = (Math.floor(atkbon-this.defenseBonus) + 1);
		if (dmg <= 0) {
			dmg = 1;
		}
		this.health -= dmg;
		console.log("Current health of "+this.pic+" is "+this.health);
		if(this.health < 1) {
			console.log(this.pic+" was defeated!");
		}
	}
	//This function is what lets the potions heal. Changing the trigger condition in moveLogic would allow monsters to heal too! 
	heal() {
		this.health = this.maxHealth;
	}
	
	render()
	{	
			if(this.health > 0) {
				ctx.drawImage(document.getElementById(this.pic),this.x,this.y);
				ctx.beginPath();
				ctx.lineWidth = 2;
				ctx.strokeStyle = "#FF0000";
				ctx.moveTo(this.x+10, this.y+64);
				ctx.lineTo(this.x+(Math.floor(this.health)), this.y+64);
				ctx.stroke();
			}
			//console.log("Entity type "+this.pic+" rendered");
	}
}

//This class is shared by all 3 enemy types
class Enemy extends Entity
{
	constructor(h, atk, def, pic, x, y)
	{
		super();
		this.health = h;	
		this.maxHealth = h;
		this.attackBonus = atk;
		this.defenseBonus = def;
		this.pic = pic;
		this.x= x;
		this.y= y;
	}
	
}

//This class is unique to the hero. They deserve something special.
class Player extends Entity
{
	constructor(h, atk, def, pic, x, y)
	{
		super();
		this.health = h;	
		this.maxHealth = h;
		this.attackBonus = atk;
		this.defenseBonus = def;
		this.pic = pic;
		this.x= x;
		this.y= y;
	}
}