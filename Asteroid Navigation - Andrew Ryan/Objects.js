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
			console.log(temp);
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
		
			//this.rot[i] += this.velocity[i];
			if(!this.isTrigger) {
				var clear = true;
				for(var so in m.Solid) {
					if(m.Solid[so] != this) {
						if(m.CheckCollision(this, m.Solid[so], tempP)) {
							clear = false;
							//Collision logic goes here
							
							//if(this.name == "Player" && m.Solid[so].name == "Wall") {
								//m.DestroyObject(m.Solid[so].id);
							//}
							if(this.name == "Bullet") {
								/*
								if(m.Solid[so].name == "Enemy") {
									m.DestroyObject(this.id);
									m.DestroyObject(m.Solid[so].id);
									return;
								}
								*/
								if(m.Solid[so].name == "Asteroid") {
									m.DestroyObject(this.id);
									m.Solid[so].hp -= 1;
									return;
								}
								else {
								clear = true;	
								}
							}
							
							/*
							if(this.name == "Player" && m.Solid[so].name == "Coin") {
								m.DestroyObject(m.Solid[so].id);
								m.CollectCoin();
								return;
							}
							*/
							
							/*
							if(this.name == "Player" && m.Solid[so].name == "Enemy" || this.name == "Enemy" && m.Solid[so].name == "Player") {
								m.DestroyObject(m.Solid[0].id);
								m.GameOver();
								return;
							}
							*/
							
							
							if(this.name == "Enemy") {
								
								switch(true) {
									case this.dir == 0:
										this.rot[2] = 3.14;
										//console.log("down");
										this.dir = 1;
									break;
									
									case this.dir == 1:
										this.rot[2] = 0;
										//console.log("up");
										this.dir = 0;
									break;
									
									case this.dir == 2:
										this.rot[2] = 4.71;
										//console.log("Right");
										this.dir = 3;
									break;
									
									case this.dir == 3:
										this.rot[2] = 1.57;
										//console.log("Left");
										this.dir = 2;
									break;
									
									defaukl:
									break;
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
			m.camRot[1]-=.05;
			
			this.rot[1]+=.05;
		}
		if("D" in m.Keys && m.Keys["D"]) {
			m.camRot[1]+=.05;
			
			this.rot[1]-=.05;
		}
		if("W" in m.Keys && m.Keys["W"]) {
			console.log(Math.cos(m.camRot[1])+","+Math.sin(m.camRot[1]));
			camX += Math.sin(m.camRot[1])*.1;
			camZ += Math.cos(m.camRot[1])*.1;
			
			tempX += Math.sin(m.camRot[1])*.1;
			tempZ -= Math.cos(m.camRot[1])*.1;
		}
		if("S" in m.Keys && m.Keys["S"]) {
			camX -= Math.sin(m.camRot[1])*.1;
			camZ -= Math.cos(m.camRot[1])*.1;
			
			tempX -= Math.sin(m.camRot[1])*.1;
			tempZ += Math.cos(m.camRot[1])*.1;
		}
		if("Z" in m.Keys && m.Keys["X"]) {
			camY -=.05;
			
			tempY -=.05;
		}
		if("X" in m.Keys && m.Keys["Z"]) {
			camY +=.05;
			
			tempY +=.05;
		}
		
		if(" " in m.Keys && m.Keys[" "]) {
			var loc1 = this.loc;
			var loc2 = this.rot;
			m.CreateObject(2,Bullet,[this.loc[0],this.loc[1],this.loc[2]],[this.rot[0],this.rot[1],this.rot[2]]);
			console.log("Bullet spawn at: "+this.loc+"  -  "+this.rot[1]);
			m.Keys[" "] = false;
			//console.log("Bullet made");
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

class Asteroid extends GameObject {
	constructor() {
			super();
			this.name = "Asteroid";
			this.hp = 3;
			this.collisionRadius = 0.3;	
			this.rotX = (Math.floor((Math.random() * 5)+1) *0.01);
			this.rotY = (Math.floor((Math.random() * 5)+1) *0.01);
			this.rotZ = (Math.floor((Math.random() * 5)+1) *0.01);
			this.buffer=gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
			this.vertices =
		[	
		 0,0.3,0,	0.5,0,0,
		 0,0,0.3,	0.5,0,0,
		 0.3,0,0,	0.5,0,0,
		 
		 0.0,0.3,0,	0.5,0,0,
		 0,0,0.3,	0.5,0,0,
		 -0.3,0,0,	0.5,0,0,
		 
		 0,-0.3,0,	0,0.5,0,
		 0,0,0.3,	0,0.5,0,
		 0.3,0,0,	0,0.5,0,
		 
		 0,-0.3,0,	0,0.5,0,
		 0,0,0.3,	0,0.5,0,
		 -0.3,0,0,	0,0.5,0,
		 
		 0,0.3,0,	0,0,0.5,
		 0,0,-0.3,	0,0,0.5,
		 0.3,0,0,	0,0,0.5,
		 
		 0,0.3,0,	0,0,0.5,
		 0,0,-0.3,	0,0,0.5,
		 -0.3,0,0,	0,0,0.5,
		 
		 0,-0.3,0,	0.5,0.5,0.5,
		 0,0,-0.3,	0.5,0.5,0.5,
		 0.3,0,0,	0.5,0.5,0.5,
		 
		 0,-0.3,0,	0.5,0.5,0.5,
		 0,0,-0.3,	0.5,0.5,0.5,
		 -0.3,0,0,	0.5,0.5,0.5,
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	}
	Update() {
		if(this.hp < 1) {
			m.DestroyObject(this.id);
		}
		this.rot[0] += 0.01//this.rotX;
		this.rot[1] += 0.01//this.rotY;
		//this.rot[2] += this.rotZ;
		
	}
	Render(program) {
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
		
		
		var primitiveType = gl.TRIANGLES;
		offset = 0;
		var count = 24;
		gl.drawArrays(primitiveType, offset, count);
	}
}

class Bullet extends GameObject
{
	constructor()
	{
		super();
		this.name = "Bullet";
		this.collisionRadius = 0.05;
		this.buffer=gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		this.vertices =
		 [	
		 0.01,0,0,	0,1,0,
		 0.02,0.03,0,		0,1,0,
		 0.02,-0.03,0,		0,1,0,
		 0.03,0,0,		0,1,0,
		 
		 -0.01,0,0,	0,1,0,
		 -0.02,0.03,0,		0,1,0,
		 -0.02,-0.03,0,		0,1,0,
		 -0.03,0,0,		0,1,0,
		 
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	}
	
	
	Update() {
			this.velocity[0] = -Math.sin(this.rot[1])*.02;
			this.velocity[2] = -Math.cos(this.rot[1])*.02;
			this.Move();
	}
	
	Render(program) {
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
		
		
		var primitiveType = gl.TRIANGLE_STRIP;
		offset = 0;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 4;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
	}
}

