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
		//Checks so that correct object can be destroyed after if-statements finish
		var destroy1 = false;
		var destroy2 = false;
		
		for(var i =0; i< 3; i ++) {
			tempP[i] = this.loc[i];
			tempP[i] += this.velocity[i];
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
								if(m.Solid[so].name == "Enemy") {
									m.DestroyObject(this.id);
									m.DestroyObject(m.Solid[so].id);
									return;
								}
								if(m.Solid[so].name == "Wall") {
									m.DestroyObject(this.id);
									return;
								}
								else {
								clear = true;	
								}
							}
							
							if(this.name == "Player" && m.Solid[so].name == "Coin") {
								m.DestroyObject(m.Solid[so].id);
								m.CollectCoin();
								return;
							}
							
							if(this.name == "Player" && m.Solid[so].name == "Enemy" || this.name == "Enemy" && m.Solid[so].name == "Player") {
								m.DestroyObject(m.Solid[0].id);
								m.GameOver();
								return;
							}
							
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
				//console.log("moving");
				//console.log(this.loc);
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
	//	console.log(this.loc[0]);
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

class BorderWall extends GameObject {
	constructor() {
			super();
			this.name = "Wall";
			this.collisionRadius = 1;	
			this.buffer=gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
			this.vertices =
		 /*[	
		 0,-1,0,		1,0,1,
		 0,1,0,		1,0,1,
		 0.05,1,0,		1,0,1,
		 0.05,-1,0,	1,0,1,
		];*/
		[	
		 -1,-1,0,		0,0,0,
		 -1,1,0,		0,0,0,
		 1,1,0,		0,0,0,
		 1,-1,0,	0,0,0,
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	}
	Update() {
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
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
	}
}

class MazeWall extends GameObject {
	constructor() {
			super();
			this.name = "Wall";
			this.collisionRadius = 0.1;	
			this.buffer=gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
			this.vertices =
		 /*[	
		 0,-1,0,		1,0,1,
		 0,1,0,		1,0,1,
		 0.05,1,0,		1,0,1,
		 0.05,-1,0,	1,0,1,
		];*/
		[	
		 -0.1,-0.1,0,		0,0,0,
		 -0.1,0.1,0,		0,0,0,
		 0.1,0.1,0,		0,0,0,
		 0.1,-0.1,0,	0,0,0,
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	}
	Update() {
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
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
	}
}

class Player extends GameObject
{
	constructor()
	{
		super();
		this.name = "Player";
		this.collisionRadius = 0.04;
		//this.scale = [0.3, 0.3, 0];
		
		this.buffer=gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		this.vertices =
		 [	
		 //Center
		 -0.025,0,0,	0,1,0,
		 0,0.15,0,		0,1,0,
		 0.025,0,0,		0,1,0,
		 0,-0.15,0,		0,1,0,
		 -0.025,0,0,	0,1,0,
		 
		 //Left
		 -0.025,0,0,		0,0,1,
		 -0.035,0.15,0,		0,0,1,
		 -0.05,0,0,			0,0,1,
		 -0.035,-0.15,0,	0,0,1,
		 -0.025,0,0,		0,0,1,
		 
		 //Right
		 0.025,0,0,		0,0,1,
		 0.035,0.15,0,	0,0,1,
		 0.05,0,0,		0,0,1,
		 0.035,-0.15,0,	0,0,1,
		 0.025,0,0,		0,0,1,
		
		//Left Wing
		 0.05,0.035,0,	0,1,0,
		 0.15,-0.035,0,	0,1,0,
		 0.05,-0.035,0,	0,1,0,
		 
		 //Right Wing
		 -0.05,0.035,0,		0,1,0,
		 -0.15,-0.035,0,	0,1,0,
		 -0.05,-0.035,0,	0,1,0,
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	}
	
	
	Update() {
		var horizontal = 0;
		var vertical = 0;
		if("A" in m.Keys && m.Keys["A"]) {
			this.rot[2] += 0.03;
		}
		if("D" in m.Keys && m.Keys["D"]) {
			this.rot[2] -= 0.03;
		}
		if("W" in m.Keys && m.Keys["W"]) {
			//console.log(Math.sin(this.rot[2])*.1);
			horizontal -= Math.sin(this.rot[2])*.01;
			vertical = Math.cos(this.rot[2])*.01;
		}
		if("S" in m.Keys && m.Keys["S"]) {
			horizontal = Math.sin(this.rot[2])*.01;
			vertical -= Math.cos(this.rot[2])*.01;
		}
		//Move the Object
		this.velocity[0] = horizontal;
		this.velocity[1] = vertical;
		//console.log(this.velocity);
		//console.log(vertical);
		this.Move();
		if(" " in m.Keys && m.Keys[" "]) {
			var loc1 = this.loc;
			var loc2 = this.rot;
			m.CreateObject(2,Bullet,[this.loc[0],this.loc[1],this.loc[0]],[this.rot[0],this.rot[1],this.rot[2]]);
			m.Keys[" "] = false;
			//console.log("Bullet made");
		}
		if("P" in m.Keys && m.Keys["P"]) {
			//console.log(this.velocity);
		}
		
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
		//Added to scale down player -Left out for now
		//var scaleLoc = gl.getUniformLocation(program,'scale');
		//gl.uniform3fv(scaleLoc,new Float32Array(this.scale));
		
		
		var primitiveType = gl.TRIANGLE_STRIP;
		offset = 0;
		var count = 5;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 5;
		var count = 5;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 10;
		var count = 5;
		gl.drawArrays(primitiveType, offset, count);
		
		var primitiveType = gl.TRIANGLES;
		offset = 15;
		var count = 3;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 18;
		var count = 3;
		gl.drawArrays(primitiveType, offset, count);
	}
	
}

class Enemy extends GameObject
{
	constructor()
	{
		super();
		this.name = "Enemy";
		this.collisionRadius = 0.04;
		this.dir = 0;
		//this.scale = [0.3, 0.3, 0];
		
		this.buffer=gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		this.vertices =
		 [	
		 //Center
		 -0.025,0,0,	0,0,0,
		 0,0.15,0,		0,0,0,
		 0.025,0,0,		0,0,0,
		 0,-0.15,0,		0,0,0,
		 -0.025,0,0,	0,0,0,
		 
		 //Left
		 -0.025,0,0,		1,0,0,
		 -0.035,0.15,0,		1,0,0,
		 -0.05,0,0,			1,0,0,
		 -0.035,-0.15,0,	1,0,0,
		 -0.025,0,0,		1,0,0,
		 
		 //Right
		 0.025,0,0,		1,0,0,
		 0.035,0.15,0,	1,0,0,
		 0.05,0,0,		1,0,0,
		 0.035,-0.15,0,	1,0,0,
		 0.025,0,0,		1,0,0,
		
		//Left Wing
		 0.05,0.035,0,	0,0,0,
		 0.15,-0.035,0,	0,0,0,
		 0.05,-0.035,0,	0,0,0,
		 
		 //Right Wing
		 -0.05,0.035,0,		0,0,0,
		 -0.15,-0.035,0,	0,0,0,
		 -0.05,-0.035,0,	0,0,0,
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	}
	
	
	Update() {
		switch(true) {
			case this.rot[2] == 0:
			this.dir = 0;
			break;
			
			case this.rot[2] == 1.57:
			this.dir = 2;
			break;
			
			default:
			break;
		}
		var horizontal = 0;
		var vertical = 0;
		horizontal -= Math.sin(this.rot[2])*.01;
		vertical = Math.cos(this.rot[2])*.01;
		//Move the Object
		this.velocity[0] = horizontal;
		this.velocity[1] = vertical;
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
		//Added to scale down player -Left out for now
		//var scaleLoc = gl.getUniformLocation(program,'scale');
		//gl.uniform3fv(scaleLoc,new Float32Array(this.scale));
		
		
		var primitiveType = gl.TRIANGLE_STRIP;
		offset = 0;
		var count = 5;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 5;
		var count = 5;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 10;
		var count = 5;
		gl.drawArrays(primitiveType, offset, count);
		
		var primitiveType = gl.TRIANGLES;
		offset = 15;
		var count = 3;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 18;
		var count = 3;
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
		//this.isTrigger = true;
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
			this.velocity[0] = -Math.sin(this.rot[2])*.02;
			this.velocity[1] = Math.cos(this.rot[2])*.02;
			this.Move();
			//console.log(this.loc);
			//Check if out of bounds then destroy;
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

class Coin extends GameObject {
	constructor() {
			super();
			this.name = "Coin";
			this.collisionRadius = 0.03;	
			this.buffer=gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
			this.vertices =
		 /*[	
		 0,-1,0,		1,0,1,
		 0,1,0,		1,0,1,
		 0.05,1,0,		1,0,1,
		 0.05,-1,0,	1,0,1,
		];*/
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
		this.rot[1]+=0.01;
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






