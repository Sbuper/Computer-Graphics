class Transform
		{
			constructor()
			{
				this.forward = [0,0,1];
				this.right = [1,0,0];
				this.up = [0,1,0];
			}
		
			doRotations(RotAngles)
			{
				this.xRot = [
							[1,0,0,0],
							[0,Math.cos(RotAngles[0]),-1*Math.sin(RotAngles[0]),0],
							[0,Math.sin(RotAngles[0]),Math.cos(RotAngles[0]),0],
							[0,0,0,1]
						];		
				this.yRot = [
						[Math.cos(RotAngles[1]),0,Math.sin(RotAngles[1]),0],
						[0,1,0,0],
						[-1*Math.sin(RotAngles[1]),0,Math.cos(RotAngles[1]),0],
						[0,0,0,1]	
						];
				this.zRot = [
							[Math.cos(RotAngles[2]),-1*Math.sin(RotAngles[2]),0,0],
							[Math.sin(RotAngles[2]),Math.cos(RotAngles[2]),0,0],
							[0,0,1,0],
							[0,0,0,1]
						]
				//this.forward = this.crossMultiply(xRot,[0,0,1,0]);		
				this.forward = this.crossMultiply(this.zRot,this.crossMultiply(this.yRot,this.crossMultiply(this.xRot,[0,0,1,0])))
				this.right = this.crossMultiply(this.zRot,this.crossMultiply(this.yRot,this.crossMultiply(this.xRot,[1,0,0,0])))
				this.up = this.crossMultiply(this.zRot,this.crossMultiply(this.yRot,this.crossMultiply(this.xRot,[0,1,0,0])))
			}			
			crossMultiply(M,V)
			{
			console.log(M[0][3]);
			console.log(V[3]);
			var temp = [
						M[0][0]*V[0]+M[0][1]*V[1]+M[0][2] * V[2]+ M[0][3]*V[3],
						M[1][0]*V[0]+M[1][1]*V[1]+M[1][2] * V[2]+ M[1][3]*V[3],
						M[2][0]*V[0]+M[2][1]*V[1]+M[2][2] * V[2]+ M[2][3]*V[3],
						M[3][0]*V[0]+M[3][1]*V[1]+M[3][2] * V[2]+ M[3][3]*V[3]
						]
				return temp;
			}
			
		}
		
class GameObject
{
	constructor() 
	{
		this.loc = [0,0,0];
		this.rot = [0,0,0];
		this.isTrigger = false;
		this.collisionRadius = 1.0;
		this.velocity = [0,0,0];
		this.angVelocity = [0,0,0];
		this.name = "Default";
		this.id = 0;
		this.transform = new Transform();
		this.prefab;
	}
	
	Move() {
		
		var tempP = [0,0,0];
		var tempC = [0,0,0];
		//Checks so that correct object can be destroyed after if-statements finish
		var destroy1 = false;
		var destroy2 = false;
		
		for(var i =0; i< 3; i ++) {
			tempP[i] = this.loc[i];
			tempP[i] += this.velocity[i];
		}
		
		//Change
		if(this.name == "Player") {
			for(var i =0; i< 3; i ++) {
				tempC[i] = m.camLoc[i];
				tempC[i] += this.camVelocity[i];
			}
		}
		
		if(this.name == "Bullet") {
			this.loc = tempP;
		}
		
		//if(this.name == "Reaper") {
		//	for(var i =0; i< 3; i ++) {
		//		tempC[i] = m.reapLoc[i];
		//		tempC[i] += this.reapVelocity[i];
		//	}
		//}
		
			//this.rot[i] += this.velocity[i];
			if(!this.isTrigger) {
				var clear = true;
				for(var so in m.Solid) {
					if(m.Solid[so] != this) {
						if(m.CheckCollision(this, m.Solid[so], tempP)) {
							clear = false;
							
							//Collision logic goes here
							
							
							if(this.name == "Player" && m.Solid[so].name == "Exit") {
							//Put win screen here;
							WinGame();
							console.log("Win!");
							return;
							}
		
							if(this.name == "Player" && m.Solid[so].name == "Reaper" 
								|| this.name == "Player" && m.Solid[so].name == "Skelly" 
								|| this.name == "Player" && m.Solid[so].name == "Slime"
								|| this.name == "Reaper" && m.Solid[so].name == "Player" 
								|| this.name == "Skelly" && m.Solid[so].name == "Player" 
								|| this.name == "Slime" && m.Solid[so].name == "Player") {
								ResetGame();
								return;
							}
							
							if(this.name == "Reaper" || this.name == "Skelly") {
								this.move = (Math.floor((Math.random() * 2)-1)*.01);
								this.moveDir1 = Math.floor((Math.random() * 2));
								this.moveDir2 = Math.floor((Math.random() * 2));
								
								while(this.move == 0) {
									//console.log("0 move speed after collision...readjusting");
									this.move = (Math.floor((Math.random() * 2)-1)*.01);
								}
								return;
							}
							
							if(this.name == "Slime") {
								
								switch(this.moveDir) {
									case 0:
										this.moveDir = 1;
									break;
									
									case 1:
										this.moveDir = 0;
									break;
								}
								return;
							}
							
							if(this.name == "Bullet" || this.name == "BadBullet") {
								if(m.Solid[so].name == "WallOne" || m.Solid[so].name == "WallTwo") {
									m.DestroyObject(this.id);
								}
							}
							
							if(this.name == "Bullet" && m.Solid[so].name == "Reaper" 
								|| this.name == "Bullet" && m.Solid[so].name == "Skelly" 
								|| this.name == "Bullet" && m.Solid[so].name == "Slime") {
								m.Solid[so].hp -= 1;
								m.DestroyObject(this.id);
								if(m.Solid[so].hp < 1) {
									m.DestroyObject(m.Solid[so].id);
								}
							}
							
							if(this.name == "BadBullet" && m.Solid[so].name == "Player") {
								m.Solid[so].hp -= 1;
								m.DestroyObject(this.id);
								if(m.Solid[so].hp < 1) {
									ResetGame();
								}
							}
						}
					}
				}

				if(clear) {
				this.loc = tempP;
				
				
				//Change
				if(this.name == "Player") {
					m.camLoc = tempC;
				}
				
				
				
				}
				if(!clear) {
					//console.log("Collision!");
				}
				if(destroy1) {
					m.DestroyObject(this.id);
					destroy1 = false;
				}
				if(destroy2) {
					m.DestroyObject(m.Solid[so].id);
					destroy2 = false;
				}

			}
	}
	
	Update()
	{
		console.error(this.name +" update() is NOT IMPLEMENTED!");
	}
	Render(program)
	{
		console.error(this.name + " render() is NOT IMPLEMENTED!");
	}	
}

class Camera extends GameObject {
	constructor() {
			super();
			this.hp = 5;
			this.name = "Player";
			this.collisionRadius = 0.1;	
			this.velocity = [0,0,0];
			this.camVelocity = [0,0,0];
			this.buffer=gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

			this.vertices =
		[	
		 0.03*Math.cos(0.62831853),0.03*Math.sin(0.62831853),0,		1,0.5,0,
		 0.03*Math.cos(1.25663706),0.03*Math.sin(1.25663706),0,		1,0.5,0,
		 0.03*Math.cos(1.88495559),0.03*Math.sin(1.88495559),0,		1,0.5,0,
		 0.03*Math.cos(2.51327412),0.03*Math.sin(2.51327412),0,		1,0.5,0,
		 0.03*Math.cos(3.14159265),0.03*Math.sin(3.14159265),0,		1,0.5,0,
		 0.03*Math.cos(3.76991118),0.03*Math.sin(3.76991118),0,		1,0.5,0,
		 0.03*Math.cos(4.39822971),0.03*Math.sin(4.39822971),0,		1,0.5,0,
		 0.03*Math.cos(5.02654824),0.03*Math.sin(5.02654824),0,		1,0.5,0,
		 0.03*Math.cos(5.65486677),0.03*Math.sin(5.65486677),0,		1,0.5,0,
		 0.03*Math.cos(6.28318529),0.03*Math.sin(6.28318529),0,		1,0.5,0,
		 0.03*Math.cos(6.91150382),0.03*Math.sin(6.91150382),0,		1,0.5,0,
		 0.03*Math.cos(0.62831853),0.03*Math.sin(0.62831853),0,		1,0.5,0,
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	}
	
	Update() {
		var tempX = 0;
		var tempY = 0;
		var tempZ = 0;
		var camX = 0;
		var camY = 0;
		var camZ = 0;
		
		//console.log("Inside key press?")
		if("A" in m.Keys && m.Keys["A"]) {
			m.camRot[1]-=.03;
			
			this.rot[1]+=.03;
		}
		if("D" in m.Keys && m.Keys["D"]) {
			m.camRot[1]+=.03;
			
			this.rot[1]-=.03;
		}
		if("W" in m.Keys && m.Keys["W"]) {
			//console.log(Math.cos(m.camRot[1])+","+Math.sin(m.camRot[1]));
			camX += Math.sin(m.camRot[1])*.05;
			camZ += Math.cos(m.camRot[1])*.05;
			
			tempX += Math.sin(m.camRot[1])*.05;
			tempZ -= Math.cos(m.camRot[1])*.05;
		}
		if("S" in m.Keys && m.Keys["S"]) {
			camX -= Math.sin(m.camRot[1])*.02;
			camZ -= Math.cos(m.camRot[1])*.02;
			
			tempX -= Math.sin(m.camRot[1])*.02;
			tempZ += Math.cos(m.camRot[1])*.02;
		}
		
		/*
		if("Z" in m.Keys && m.Keys["X"]) {
			camY -=.05;
			
			tempY -=.05;
		}
		if("X" in m.Keys && m.Keys["Z"]) {
			camY +=.05;
			
			tempY +=.05;
		}
		*/
		
		if(" " in m.Keys && m.Keys[" "]) {
			
			var loc1 = this.loc;
			var loc2 = this.rot;
			m.CreateObject(2,Bullet,[this.loc[0],this.loc[1],this.loc[2]],[this.rot[0],this.rot[1],this.rot[2]]);
			console.log("Bullet spawn at: "+this.loc+"  -  "+this.rot[1]);
			m.Keys[" "] = false;
			console.log("Bullet made");
			
		}
	
		this.velocity[0] = tempX;
		this.velocity[1] = tempY;
		this.velocity[2] = tempZ;
		this.camVelocity[0] = camX;
		this.camVelocity[1] = camY;
		this.camVelocity[2] = camZ;
		this.Move();
		var camLock  = gl.getUniformLocation(m.myWEBGL.program,'worldLoc');
		gl.uniform3fv(camLock,new Float32Array(m.camLoc));
		var camRotoation  = gl.getUniformLocation(m.myWEBGL.program,'worldRotation');
		gl.uniform3fv(camRotoation,new Float32Array(m.camRot));
	}
	
	Render(program) {
		//Billboarding control
		this.bill = 0.0;
		var billB = gl.getUniformLocation(m.myWEBGL.program,'IsBillboard');
		gl.uniform1f(billB,this.bill);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		
		//First we bind the buffer for triangle 1
		var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
		var size = 3;          // 2 components per iteration
		var type = gl.FLOAT;   // the data is 32bit floats
		var normalize = false; // don't normalize the data
		var stride = 6*Float32Array.BYTES_PER_ELEMENT;	//Size in bytes of each element     // 0 = move forward size * sizeof(type) each iteration to get the next position
		var offset = 0;        // start at the beginning of the buffer
		gl.enableVertexAttribArray(positionAttributeLocation);
		gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
		
		//Now we have to do this for color
		var colorAttributeLocation = gl.getAttribLocation(program,"vert_color");
		//We don't have to bind because we already have the correct buffer bound.
		size = 3;
		type = gl.FLOAT;
		normalize = false;
		stride = 6*Float32Array.BYTES_PER_ELEMENT;	//Size in bytes of each element
		offset = 3*Float32Array.BYTES_PER_ELEMENT;									//size of the offset
		gl.enableVertexAttribArray(colorAttributeLocation);
		gl.vertexAttribPointer(colorAttributeLocation, size, type, normalize, stride, offset);
				
		var tranLoc  = gl.getUniformLocation(program,'transform');
		gl.uniform3fv(tranLoc,new Float32Array(this.loc));
		var thetaLoc = gl.getUniformLocation(program,'rotation');
		gl.uniform3fv(thetaLoc,new Float32Array(this.rot));
		
		
		var primitiveType = gl.TRIANGLE_FAN;
		offset = 0;
		var count = 12;
		gl.drawArrays(primitiveType, offset, count);
		
		
	}
}

class Reaper extends GameObject
{
	constructor()
	{
			super();
			this.hp = 3;
			this.tex = createReaper();
			this.name = "Reaper";
			this.collisionRadius = 0.2;	
			this.velocity = [0,0,0];
			
			this.moveCount = 50;
			this.move = 0.02;
			this.moveDir1 = (Math.floor((Math.random() * 2)-1));
			this.moveDir2 = Math.floor((Math.random() * 2)-1);
			this.buffer=gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		this.vertices =
		 [	
			-0.2,0.0,0.0,0,0,
			-0.2,0.6,0.0,0,1,
			 0.2,0.0,0.0,1,0,
			 0.2,0.6,0.0,1,1,
			
		];
		this.myTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.myTexture);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,16,16,0,gl.RGBA,
		gl.UNSIGNED_BYTE,new Uint8Array(this.tex));
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	}
	
	
	Update() {
		if(this.moveCount == 60) {
			//Fire bullet at player (broken)
			m.CreateObject(2,BadBullet,[this.loc[0],0,this.loc[2]],[0, (-(this.loc[0] - m.camLoc[0]) * (this.loc[2] - m.camLoc[2])), 0]);
		}
		
		while(this.move == 0) {
			//console.log("0 move speed...readjusting");
			this.move = (Math.floor((Math.random() * 2)-1)*.01);
		}
		this.velocity = [0,0,0];
		if(this.moveCount > 0) {
			switch(this.moveDir1) {
					case 0:
						this.velocity[0] += this.move;
					break;
					
					case 1:
						this.velocity[0] -= this.move;
					break;
			}
			switch(this.moveDir2) {
					case 0:
						this.velocity[2] += this.move;
					break;
					
					case 1:
						this.velocity[2] -= this.move;
					break;
			}

			this.Move();
			this.moveCount -= 1;
		}
		else {
			this.move = (Math.floor((Math.random() * 2)-1)*.01);
			this.moveCount = 120;
			this.moveDir1 = Math.floor((Math.random() * 2));
			this.moveDir2 = Math.floor((Math.random() * 2));
		}
	}
	
	Render(program) {
		//Billboarding control
		this.bill = 1.0;
		var billB = gl.getUniformLocation(m.myWEBGL.program,'IsBillboard');
		gl.uniform1f(billB,this.bill);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		
		var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		var size = 3;          // 2 components per iteration
		var type = gl.FLOAT;   // the data is 32bit floats
		var normalize = false; // don't normalize the data
		var stride = 5*Float32Array.BYTES_PER_ELEMENT;	//Size in bytes of each element     // 0 = move forward size * sizeof(type) each iteration to get the next position
		var offset = 0;        // start at the beginning of the buffer
		gl.enableVertexAttribArray(positionAttributeLocation);
		gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
		
		var texCoordAttributeLocation = gl.getAttribLocation(program,"texcord");	
		gl.vertexAttribPointer(
		texCoordAttributeLocation, //ATTRIBUTE LOCATION
		2, //NUMBER of elements per attribute
		gl.FLOAT, //TYPES OF ELEMENTS
		gl.FALSE,
		5*Float32Array.BYTES_PER_ELEMENT, //SIZE OF AN INDIVIDUAL VERTEX
		3*Float32Array.BYTES_PER_ELEMENT //OFFSET
		);					
		gl.enableVertexAttribArray(texCoordAttributeLocation);
				
		var tranLoc  = gl.getUniformLocation(program,'transform');
		gl.uniform3fv(tranLoc,new Float32Array(this.loc));
		var thetaLoc = gl.getUniformLocation(program,'rotation');
		gl.uniform3fv(thetaLoc,new Float32Array(this.rot));
		gl.bindTexture(gl.TEXTURE_2D, this.myTexture);
		//setup S
		gl.texParameteri(gl.TEXTURE_2D,	gl.TEXTURE_WRAP_S,gl.REPEAT); //gl.MIRRORED_REPEAT//gl.CLAMP_TO_EDGE//gl.REPEAT
		//Sets up our T
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT); //gl.MIRRORED_REPEAT//gl.CLAMP_TO_EDGE //gl.REPEAT                  
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
		
		
		var primitiveType = gl.TRIANGLE_STRIP;
		offset = 0;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
		

	}
	
}

class Skelly extends GameObject
{
	constructor()
	{
		super();
		this.hp = 3;
			this.tex = createSkelly();
			this.name = "Skelly";
			this.collisionRadius = 0.2;	
			this.velocity = [0,0,0];
			this.move = 0.02;
			this.moveDir1 = (Math.floor((Math.random() * 2)-1));
			this.moveDir2 = Math.floor((Math.random() * 2)-1);
			this.buffer=gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		this.vertices =
		 [	
			-0.2,0.0,0.0,0,0,
			-0.2,0.5,0.0,0,1,
			 0.2,0.0,0.0,1,0,
			 0.2,0.5,0.0,0,1,
			
		];
		this.myTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.myTexture);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,16,16,0,gl.RGBA,
		gl.UNSIGNED_BYTE,new Uint8Array(this.tex));
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	}
	
	
	Update() {
		
		while(this.move == 0) {
			console.log("0 move speed...readjusting");
			this.move = (Math.floor((Math.random() * 2)-1)*.01);
		}
		this.velocity = [0,0,0];
			switch(this.moveDir1) {
					case 0:
						this.velocity[0] += this.move;
					break;
					
					case 1:
						this.velocity[0] -= this.move;
					break;
			}
			switch(this.moveDir2) {
					case 0:
						this.velocity[2] += this.move;
					break;
					
					case 1:
						this.velocity[2] -= this.move;
					break;
			}

			this.Move();
	}
	
	Render(program) {
		//Billboarding control
		this.bill = 1.0;
		var billB = gl.getUniformLocation(m.myWEBGL.program,'IsBillboard');
		gl.uniform1f(billB,this.bill);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		
		//First we bind the buffer for triangle 1
		var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		var size = 3;          // 2 components per iteration
		var type = gl.FLOAT;   // the data is 32bit floats
		var normalize = false; // don't normalize the data
		var stride = 5*Float32Array.BYTES_PER_ELEMENT;	//Size in bytes of each element     // 0 = move forward size * sizeof(type) each iteration to get the next position
		var offset = 0;        // start at the beginning of the buffer
		gl.enableVertexAttribArray(positionAttributeLocation);
		gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
		
		var texCoordAttributeLocation = gl.getAttribLocation(program,"texcord");	
		gl.vertexAttribPointer(
		texCoordAttributeLocation, //ATTRIBUTE LOCATION
		2, //NUMBER of elements per attribute
		gl.FLOAT, //TYPES OF ELEMENTS
		gl.FALSE,
		5*Float32Array.BYTES_PER_ELEMENT, //SIZE OF AN INDIVIDUAL VERTEX
		3*Float32Array.BYTES_PER_ELEMENT //OFFSET
		);					
		gl.enableVertexAttribArray(texCoordAttributeLocation);
				
		var tranLoc  = gl.getUniformLocation(program,'transform');
		gl.uniform3fv(tranLoc,new Float32Array(this.loc));
		var thetaLoc = gl.getUniformLocation(program,'rotation');
		gl.uniform3fv(thetaLoc,new Float32Array(this.rot));
		gl.bindTexture(gl.TEXTURE_2D, this.myTexture);
		//setup S
		gl.texParameteri(gl.TEXTURE_2D,	gl.TEXTURE_WRAP_S,gl.REPEAT); //gl.MIRRORED_REPEAT//gl.CLAMP_TO_EDGE//gl.REPEAT
		//Sets up our T
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT); //gl.MIRRORED_REPEAT//gl.CLAMP_TO_EDGE //gl.REPEAT                  
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
		gl.uniform3fv(thetaLoc,new Float32Array(this.rot));
		//Added to scale down player -Left out for now
		//var scaleLoc = gl.getUniformLocation(program,'scale');
		//gl.uniform3fv(scaleLoc,new Float32Array(this.scale));
		
		
		var primitiveType = gl.TRIANGLE_STRIP;
		offset = 0;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);

		}

}


class Slime extends GameObject
{
	constructor()
	{
			super();
			this.hp = 3;
			this.tex = createSlime();
			this.name = "Slime";
			this.collisionRadius = 0.2;	
			this.velocity = [0,0,0];
			
			this.move = 0.04;
			this.moveDir = 0;
			this.buffer=gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		this.vertices =
		 [	
			-0.2,0.0,0.0,0,0,
			-0.2,0.3,0.0,0,1,
			0.2,0.0,0.0,1,0,
			0.2,0.3,0.0,1,1,
			
		];
		this.myTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.myTexture);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,16,16,0,gl.RGBA,
		gl.UNSIGNED_BYTE,new Uint8Array(this.tex));
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	}
	
	
	Update() {
		this.velocity = [0,0,0];
		//console.log(this.moveDir1);
			//console.log(this.moveDir1);
			switch(this.moveDir) {
					case 0:
						this.velocity[0] += this.move;
					break;
					
					case 1:
						this.velocity[0] -= this.move;
					break;
			}
			this.Move();

	}
	
	Render(program) {
		//Billboarding control
		this.bill = 1.0;
		var billB = gl.getUniformLocation(m.myWEBGL.program,'IsBillboard');
		gl.uniform1f(billB,this.bill);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		
		var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		var size = 3;          // 2 components per iteration
		var type = gl.FLOAT;   // the data is 32bit floats
		var normalize = false; // don't normalize the data
		var stride = 5*Float32Array.BYTES_PER_ELEMENT;	//Size in bytes of each element     // 0 = move forward size * sizeof(type) each iteration to get the next position
		var offset = 0;        // start at the beginning of the buffer
		gl.enableVertexAttribArray(positionAttributeLocation);
		gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
		
		var texCoordAttributeLocation = gl.getAttribLocation(program,"texcord");	
		gl.vertexAttribPointer(
		texCoordAttributeLocation, //ATTRIBUTE LOCATION
		2, //NUMBER of elements per attribute
		gl.FLOAT, //TYPES OF ELEMENTS
		gl.FALSE,
		5*Float32Array.BYTES_PER_ELEMENT, //SIZE OF AN INDIVIDUAL VERTEX
		3*Float32Array.BYTES_PER_ELEMENT //OFFSET
		);					
		gl.enableVertexAttribArray(texCoordAttributeLocation);
				
		var tranLoc  = gl.getUniformLocation(program,'transform');
		gl.uniform3fv(tranLoc,new Float32Array(this.loc));
		var thetaLoc = gl.getUniformLocation(program,'rotation');
		gl.uniform3fv(thetaLoc,new Float32Array(this.rot));
		gl.bindTexture(gl.TEXTURE_2D, this.myTexture);
		//setup S
		gl.texParameteri(gl.TEXTURE_2D,	gl.TEXTURE_WRAP_S,gl.REPEAT); //gl.MIRRORED_REPEAT//gl.CLAMP_TO_EDGE//gl.REPEAT
		//Sets up our T
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT); //gl.MIRRORED_REPEAT//gl.CLAMP_TO_EDGE //gl.REPEAT                  
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
		
		
		var primitiveType = gl.TRIANGLE_STRIP;
		offset = 0;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
		

	}
	
}


class Floor extends GameObject {
	constructor() {
			super();
			this.tex = createFloor();
			this.name = "Floor";
			this.collisionRadius = 0;	
			this.buffer=gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
			this.vertices =
		[
			-16,0,-16,0,0,
			-16,0, 16,0,1,
			 16,0,-16,1,0,
			 16,0, 16,1,1,
		];
		this.myTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.myTexture);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,16,16,0,gl.RGBA,
		gl.UNSIGNED_BYTE,new Uint8Array(this.tex));
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	}
	
	Update() {
		
	}
	
	Render(program)
	 {
		//Billboarding control
		this.bill = 0.0;
		var billB = gl.getUniformLocation(m.myWEBGL.program,'IsBillboard');
		gl.uniform1f(billB,this.bill);
		 
		var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		var size = 3;          // 2 components per iteration
		var type = gl.FLOAT;   // the data is 32bit floats
		var normalize = false; // don't normalize the data
		var stride = 5*Float32Array.BYTES_PER_ELEMENT;	//Size in bytes of each element     // 0 = move forward size * sizeof(type) each iteration to get the next position
		var offset = 0;        // start at the beginning of the buffer
		gl.enableVertexAttribArray(positionAttributeLocation);
		gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
		
		var texCoordAttributeLocation = gl.getAttribLocation(program,"texcord");	
		gl.vertexAttribPointer(
		texCoordAttributeLocation, //ATTRIBUTE LOCATION
		2, //NUMBER of elements per attribute
		gl.FLOAT, //TYPES OF ELEMENTS
		gl.FALSE,
		5*Float32Array.BYTES_PER_ELEMENT, //SIZE OF AN INDIVIDUAL VERTEX
		3*Float32Array.BYTES_PER_ELEMENT //OFFSET
		);					
		gl.enableVertexAttribArray(texCoordAttributeLocation);
				
		var tranLoc  = gl.getUniformLocation(program,'transform');
		gl.uniform3fv(tranLoc,new Float32Array(this.loc));
		var thetaLoc = gl.getUniformLocation(program,'rotation');
		gl.uniform3fv(thetaLoc,new Float32Array(this.rot));
		gl.bindTexture(gl.TEXTURE_2D, this.myTexture);
		//setup S
		gl.texParameteri(gl.TEXTURE_2D,	gl.TEXTURE_WRAP_S,gl.REPEAT); //gl.MIRRORED_REPEAT//gl.CLAMP_TO_EDGE//gl.REPEAT
		//Sets up our T
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT); //gl.MIRRORED_REPEAT//gl.CLAMP_TO_EDGE //gl.REPEAT                  
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
	 
	 gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

	 }
}

class Bullet extends GameObject
{
	constructor()
	{
		super();
		this.tex = createGreen();
		this.name = "Bullet";
		this.collisionRadius = 0.2;
		this.buffer=gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		this.vertices =
		 [	
		 0.01,0,0,0,0,
		 0.02,0.03,0,0,1,
		 0.02,-0.03,0,1,0,
		 0.03,0,0,1,1,
		 
		 -0.01,0,0,0,0,
		 -0.02,0.03,0,0,1,
		 -0.02,-0.03,0,1,0,
		 -0.03,0,0,1,1,
		 
		];
		this.myTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.myTexture);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,16,16,0,gl.RGBA,
		gl.UNSIGNED_BYTE,new Uint8Array(this.tex));
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	}
	
	
	Update() {
			this.velocity[0] = -Math.sin(this.rot[1])*.06;
			this.velocity[2] = -Math.cos(this.rot[1])*.06;
			this.Move();
	}
	
	Render(program) {
		//Billboarding control
		this.bill = 1.0;
		var billB = gl.getUniformLocation(m.myWEBGL.program,'IsBillboard');
		gl.uniform1f(billB,this.bill);
			
		var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		var size = 3;          // 2 components per iteration
		var type = gl.FLOAT;   // the data is 32bit floats
		var normalize = false; // don't normalize the data
		var stride = 5*Float32Array.BYTES_PER_ELEMENT;	//Size in bytes of each element     // 0 = move forward size * sizeof(type) each iteration to get the next position
		var offset = 0;        // start at the beginning of the buffer
		gl.enableVertexAttribArray(positionAttributeLocation);
		gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
		

		var texCoordAttributeLocation = gl.getAttribLocation(program,'texcord');
		gl.vertexAttribPointer(
		texCoordAttributeLocation, //ATTRIBUTE LOCATION
		2, //NUMBER of elements per attribute
		gl.FLOAT, //TYPES OF ELEMENTS
		gl.FALSE,
		5*Float32Array.BYTES_PER_ELEMENT, //SIZE OF AN INDIVIDUAL VERTEX
		3*Float32Array.BYTES_PER_ELEMENT //OFFSET
		);		
			
		gl.enableVertexAttribArray(texCoordAttributeLocation);
				
		var tranLoc  = gl.getUniformLocation(program,'transform');
		gl.uniform3fv(tranLoc,new Float32Array(this.loc));
		var thetaLoc = gl.getUniformLocation(program,'rotation');
		gl.uniform3fv(thetaLoc,new Float32Array(this.rot));
		
		
		
		gl.bindTexture(gl.TEXTURE_2D, this.myTexture);
		//setup S
		gl.texParameteri(gl.TEXTURE_2D,	gl.TEXTURE_WRAP_S,gl.REPEAT); //gl.MIRRORED_REPEAT//gl.CLAMP_TO_EDGE
		//Sets up our T
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT); //gl.MIRRORED_REPEAT//gl.CLAMP_TO_EDGE                   
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
		
		
		var primitiveType = gl.TRIANGLE_STRIP;
		offset = 0;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 4;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
		
	}
}

class BadBullet extends GameObject
{
	constructor()
	{
		super();
		this.tex = createGreen();
		this.name = "BadBullet";
		this.collisionRadius = 0.2;
		this.f = 0;
		this.buffer=gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		this.vertices =
		 [	
		 0.01,0,0,0,0,
		 0.02,0.03,0,0,1,
		 0.02,-0.03,0,1,0,
		 0.03,0,0,1,1,
		 
		 -0.01,0,0,0,0,
		 -0.02,0.03,0,0,1,
		 -0.02,-0.03,0,1,0,
		 -0.03,0,0,1,1,
		 
		];
		this.myTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.myTexture);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,16,16,0,gl.RGBA,
		gl.UNSIGNED_BYTE,new Uint8Array(this.tex));
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	}
	
	
	Update() {
		

			//this.velocity = this.rot;
			this.velocity[0] = -Math.sin(this.rot[1])*.02;
			this.velocity[2] = -Math.cos(this.rot[1])*.02;
			this.Move();
	}
	
	Render(program) {
		//Billboarding control
		this.bill = 1.0;
		var billB = gl.getUniformLocation(m.myWEBGL.program,'IsBillboard');
		gl.uniform1f(billB,this.bill);
			
		var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		var size = 3;          // 2 components per iteration
		var type = gl.FLOAT;   // the data is 32bit floats
		var normalize = false; // don't normalize the data
		var stride = 5*Float32Array.BYTES_PER_ELEMENT;	//Size in bytes of each element     // 0 = move forward size * sizeof(type) each iteration to get the next position
		var offset = 0;        // start at the beginning of the buffer
		gl.enableVertexAttribArray(positionAttributeLocation);
		gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
		

		var texCoordAttributeLocation = gl.getAttribLocation(program,'texcord');
		gl.vertexAttribPointer(
		texCoordAttributeLocation, //ATTRIBUTE LOCATION
		2, //NUMBER of elements per attribute
		gl.FLOAT, //TYPES OF ELEMENTS
		gl.FALSE,
		5*Float32Array.BYTES_PER_ELEMENT, //SIZE OF AN INDIVIDUAL VERTEX
		3*Float32Array.BYTES_PER_ELEMENT //OFFSET
		);		
			
		gl.enableVertexAttribArray(texCoordAttributeLocation);
				
		var tranLoc  = gl.getUniformLocation(program,'transform');
		gl.uniform3fv(tranLoc,new Float32Array(this.loc));
		var thetaLoc = gl.getUniformLocation(program,'rotation');
		gl.uniform3fv(thetaLoc,new Float32Array(this.rot));
		
		
		
		gl.bindTexture(gl.TEXTURE_2D, this.myTexture);
		//setup S
		gl.texParameteri(gl.TEXTURE_2D,	gl.TEXTURE_WRAP_S,gl.REPEAT); //gl.MIRRORED_REPEAT//gl.CLAMP_TO_EDGE
		//Sets up our T
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT); //gl.MIRRORED_REPEAT//gl.CLAMP_TO_EDGE                   
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
		
		
		var primitiveType = gl.TRIANGLE_STRIP;
		offset = 0;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 4;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
		
	}
}

class WallOne extends GameObject {
	constructor() {
			super();
			this.tex = createWallOne();
			this.name = "WallOne";
			this.collisionRadius = 0.5;	
			this.buffer=gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
			this.vertices =
		[
			//Back
			-0.4, 0, -0.4,		0,0,
			-0.4, 0.8, -0.4,	0,1,
			0.4, 0, -0.4,		1,0,
			0.4, 0.8, -0.4,		1,1,
			
			//Front
			-0.4, 0, 0.4,		0,0,
			-0.4, 0.8, 0.4,		0,1,
			0.4, 0, 0.4,		1,0,
			0.4, 0.8, 0.4,		1,1,
			
			//Left
			-0.4, 0, -0.4,		0,0,
			-0.4, 0.8, -0.4,	0,1,
			-0.4, 0, 0.4,		1,0,
			-0.4, 0.8, 0.4,		1,1,
			
			//Right
			0.4, 0, -0.4,		0,0,
			0.4, 0.8, -0.4,		0,1,
			0.4, 0, 0.4,		1,0,
			0.4, 0.8, 0.4,		1,1,
			
			//Top
			-0.4, 0.8, -0.4,	0,0,
			0.4, 0.8, -0.4,		0,1,
			-0.4, 0.8, 0.4,		1,0,
			0.4, 0.8, 0.4,		1,1,
			
			//Bottom
			-0.4, 0, -0.4,		0,0,
			0.4, 0, -0.4,		0,1,
			-0.4, 0, 0.4,		1,0,
			0.4, 0, 0.4,		1,1,
			
		];
		this.myTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.myTexture);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,16,16,0,gl.RGBA,
		gl.UNSIGNED_BYTE,new Uint8Array(this.tex));
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	}
	
	Update() {
	}
	
	Render(program)
	 {
		//Billboarding control
		this.bill = 0.0;
		var billB = gl.getUniformLocation(m.myWEBGL.program,'IsBillboard');
		gl.uniform1f(billB,this.bill);
			
		var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		var size = 3;          // 2 components per iteration
		var type = gl.FLOAT;   // the data is 32bit floats
		var normalize = false; // don't normalize the data
		var stride = 5*Float32Array.BYTES_PER_ELEMENT;	//Size in bytes of each element     // 0 = move forward size * sizeof(type) each iteration to get the next position
		var offset = 0;        // start at the beginning of the buffer
		gl.enableVertexAttribArray(positionAttributeLocation);
		gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
		

		var texCoordAttributeLocation = gl.getAttribLocation(program,'texcord');
		gl.vertexAttribPointer(
		texCoordAttributeLocation, //ATTRIBUTE LOCATION
		2, //NUMBER of elements per attribute
		gl.FLOAT, //TYPES OF ELEMENTS
		gl.FALSE,
		5*Float32Array.BYTES_PER_ELEMENT, //SIZE OF AN INDIVIDUAL VERTEX
		3*Float32Array.BYTES_PER_ELEMENT //OFFSET
		);		
			
		gl.enableVertexAttribArray(texCoordAttributeLocation);
				
		var tranLoc  = gl.getUniformLocation(program,'transform');
		gl.uniform3fv(tranLoc,new Float32Array(this.loc));
		var thetaLoc = gl.getUniformLocation(program,'rotation');
		gl.uniform3fv(thetaLoc,new Float32Array(this.rot));
		
		
		
		gl.bindTexture(gl.TEXTURE_2D, this.myTexture);
		//setup S
		gl.texParameteri(gl.TEXTURE_2D,	gl.TEXTURE_WRAP_S,gl.REPEAT); //gl.MIRRORED_REPEAT//gl.CLAMP_TO_EDGE
		//Sets up our T
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT); //gl.MIRRORED_REPEAT//gl.CLAMP_TO_EDGE                   
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);

		
		var primitiveType = gl.TRIANGLE_STRIP;
		offset = 0;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 4;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 8;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 12;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 16;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 20;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);

	 }
}

class WallTwo extends GameObject {
	constructor() {
			super();
			this.tex = createWallTwo();
			this.name = "WallTwo";
			this.collisionRadius = 0.5;	
			this.buffer=gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
			this.vertices =
		[
			//Back
			-0.4, 0, -0.4,0,0,
			-0.4, 0.8, -0.4,0,1,
			0.4, 0, -0.4,1,0,
			0.4, 0.8, -0.4,1,1,
			
			//Front
			-0.4, 0, 0.4,0,0,
			-0.4, 0.8, 0.4,0,1,
			0.4, 0, 0.4,1,0,
			0.4, 0.8, 0.4,1,1,
			
			//Left
			-0.4, 0, -0.4,0,0,
			-0.4, 0.8, -0.4,0,1,
			-0.4, 0, 0.4,1,0,
			-0.4, 0.8, 0.4,1,1,
			
			//Right
			0.4, 0, -0.4,0,0,
			0.4, 0.8, -0.4,0,1,
			0.4, 0, 0.4,1,0,
			0.4, 0.8, 0.4,1,1,
			
			//Top
			-0.4, 0.8, -0.4,0,0,
			0.4, 0.8, -0.4,0,1,
			-0.4, 0.8, 0.4,1,0,
			0.4, 0.8, 0.4,1,1,
			
			//Bottom
			-0.4, 0, -0.4,0,0,
			0.4, 0, -0.4,0,1,
			-0.4, 0, 0.4,1,0,
			0.4, 0, 0.4,1,1	
		];
		this.myTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.myTexture);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,16,16,0,gl.RGBA,
		gl.UNSIGNED_BYTE,new Uint8Array(this.tex));
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	}
	
	Update() {
	}
	
	Render(program)
	 {
		//Billboarding control
		this.bill = 0.0;
		var billB = gl.getUniformLocation(m.myWEBGL.program,'IsBillboard');
		gl.uniform1f(billB,this.bill);
			
		var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		var size = 3;          // 2 components per iteration
		var type = gl.FLOAT;   // the data is 32bit floats
		var normalize = false; // don't normalize the data
		var stride = 5*Float32Array.BYTES_PER_ELEMENT;	//Size in bytes of each element     // 0 = move forward size * sizeof(type) each iteration to get the next position
		var offset = 0;        // start at the beginning of the buffer
		gl.enableVertexAttribArray(positionAttributeLocation);
		gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
		

		var texCoordAttributeLocation = gl.getAttribLocation(program,'texcord');
		gl.vertexAttribPointer(
		texCoordAttributeLocation, //ATTRIBUTE LOCATION
		2, //NUMBER of elements per attribute
		gl.FLOAT, //TYPES OF ELEMENTS
		gl.FALSE,
		5*Float32Array.BYTES_PER_ELEMENT, //SIZE OF AN INDIVIDUAL VERTEX
		3*Float32Array.BYTES_PER_ELEMENT //OFFSET
		);		
			
		gl.enableVertexAttribArray(texCoordAttributeLocation);
				
		var tranLoc  = gl.getUniformLocation(program,'transform');
		gl.uniform3fv(tranLoc,new Float32Array(this.loc));
		var thetaLoc = gl.getUniformLocation(program,'rotation');
		gl.uniform3fv(thetaLoc,new Float32Array(this.rot));
		
		
		
		gl.bindTexture(gl.TEXTURE_2D, this.myTexture);
		//setup S
		gl.texParameteri(gl.TEXTURE_2D,	gl.TEXTURE_WRAP_S,gl.REPEAT); //gl.MIRRORED_REPEAT//gl.CLAMP_TO_EDGE
		//Sets up our T
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT); //gl.MIRRORED_REPEAT//gl.CLAMP_TO_EDGE                   
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);

		
		var primitiveType = gl.TRIANGLE_STRIP;
		offset = 0;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 4;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 8;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 12;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 16;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 20;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);

	 }
}

class Exit extends GameObject {
	constructor() {
			super();
			this.name = "Exit";
			this.collisionRadius = 0.5;	
			this.buffer=gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
			this.vertices =
		[
			//Back
			-0.4, 0, -0.4,		1,1,1,
			-0.4, 0.8, -0.4,	1,1,1,
			0.4, 0, -0.4,		1,1,1,
			0.4, 0.8, -0.4,	1,1,1,
			
			//Front
			-0.4, 0, 0.4,		1,1,1,
			-0.4, 0.8, 0.4,	1,1,1,
			0.4, 0, 0.4,		1,1,1,
			0.4, 0.8, 0.4,	1,1,1,
			
			//Left
			-0.4, 0, -0.4,		1,1,1,
			-0.4, 0.8, -0.4,	1,1,1,
			-0.4, 0, 0.4,		1,1,1,
			-0.4, 0.8, 0.4,	1,1,1,
			
			//Right
			0.4, 0, -0.4,		1,1,1,
			0.4, 0.8, -0.4,	1,1,1,
			0.4, 0, 0.4,		1,1,1,
			0.4, 0.8, 0.4,	1,1,1,
			
			//Top
			-0.4, 0.8, -0.4,	1,1,1,
			0.4, 0.8, -0.4,	1,1,1,
			-0.4, 0.8, 0.4,	1,1,1,
			0.4, 0.8, 0.4,	1,1,1,
			
			//Bottom
			-0.4, 0, -0.4,		1,1,1,
			0.4, 0, -0.4,		1,1,1,
			-0.4, 0, 0.4,		1,1,1,
			0.4, 0, 0.4,		1,1,1,
			
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	}
	
	Update() {
	}
	
	Render(program)
	 {
		//Billboarding control
		this.bill = 0.0;
		var billB = gl.getUniformLocation(m.myWEBGL.program,'IsBillboard');
		gl.uniform1f(billB,this.bill);
			
		var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		var size = 3;          // 2 components per iteration
		var type = gl.FLOAT;   // the data is 32bit floats
		var normalize = false; // don't normalize the data
		var stride = 6*Float32Array.BYTES_PER_ELEMENT;	//Size in bytes of each element     // 0 = move forward size * sizeof(type) each iteration to get the next position
		var offset = 0;        // start at the beginning of the buffer
		gl.enableVertexAttribArray(positionAttributeLocation);
		gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
		
		//Now we have to do this for color
		var colorAttributeLocation = gl.getAttribLocation(program,"vert_color");
		//We don't have to bind because we already have the correct buffer bound.
		size = 3;
		type = gl.FLOAT;
		normalize = false;
		stride = 6*Float32Array.BYTES_PER_ELEMENT;	//Size in bytes of each element
		offset = 3*Float32Array.BYTES_PER_ELEMENT;									//size of the offset
		gl.enableVertexAttribArray(colorAttributeLocation);
		gl.vertexAttribPointer(colorAttributeLocation, size, type, normalize, stride, offset);
				
		var tranLoc  = gl.getUniformLocation(program,'transform');
		gl.uniform3fv(tranLoc,new Float32Array(this.loc));
		var thetaLoc = gl.getUniformLocation(program,'rotation');
		gl.uniform3fv(thetaLoc,new Float32Array(this.rot));
	 
		var primitiveType = gl.TRIANGLE_STRIP;
		offset = 0;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 4;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 8;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 12;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 16;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 20;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);

	 }
}
