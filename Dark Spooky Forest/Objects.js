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

							if(this.name == "Player" && m.Solid[so].name == "Reaper") {
								m.camLoc = [0,0,0];
								var camLock  = gl.getUniformLocation(m.myWEBGL.program,'worldLoc');
								gl.uniform3fv(camLock,new Float32Array(m.camLoc));
								m.camRot = [0,0,0];
								var camRotoation  = gl.getUniformLocation(m.myWEBGL.program,'worldRotation');
								gl.uniform3fv(camRotoation,new Float32Array(m.camRot));
								
								this.loc = [0,0,0];
								this.rot = [0,0,0];
								return;
							}
							
							if(this.name == "Reaper" && m.Solid[so].name == "Player") {
								m.camLoc = [0,0,0];
								var camLock  = gl.getUniformLocation(m.myWEBGL.program,'worldLoc');
								gl.uniform3fv(camLock,new Float32Array(m.camLoc));
								m.camRot = [0,0,0];
								var camRotoation  = gl.getUniformLocation(m.myWEBGL.program,'worldRotation');
								gl.uniform3fv(camRotoation,new Float32Array(m.camRot));
								
								m.Solid[so].loc = [0,0,0];
								m.Solid[so].rot = [0,0,0];
								return;
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
			m.camRot[1]-=.03;
			
			this.rot[1]+=.03;
		}
		if("D" in m.Keys && m.Keys["D"]) {
			m.camRot[1]+=.03;
			
			this.rot[1]-=.03;
		}
		if("W" in m.Keys && m.Keys["W"]) {
			console.log(Math.cos(m.camRot[1])+","+Math.sin(m.camRot[1]));
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
		
		if(" " in m.Keys && m.Keys[" "]) {
			
			var loc1 = this.loc;
			var loc2 = this.rot;
			m.CreateObject(2,Bullet,[this.loc[0],this.loc[1],this.loc[2]],[this.rot[0],this.rot[1],this.rot[2]]);
			console.log("Bullet spawn at: "+this.loc+"  -  "+this.rot[1]);
			m.Keys[" "] = false;
			//console.log("Bullet made");
			
		}*/
	
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

class Reaper extends GameObject
{
	constructor()
	{
		super();
			this.name = "Reaper";
			this.collisionRadius = 1.8;	
			this.velocity = [0,0,0];
			this.velocity2 = [0,0,0];
			this.moveCount = 50;
			this.first = true;
			this.move = (Math.floor((Math.random() * 2)-1)*.01);
			this.moveDir1 = (Math.floor((Math.random() * 2)-1));
			this.moveDir2 = Math.floor((Math.random() * 2)-1);
			this.buffer=gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		this.vertices =
		 [	
			1*Math.cos(0.62831853),0,1*Math.sin(0.62831853),		0.3,0.3,0.3,
			1*Math.cos(1.25663706),0,1*Math.sin(1.25663706),		0.3,0.3,0.3,
			1*Math.cos(1.88495559),0,1*Math.sin(1.88495559),		0.3,0.3,0.3,
			1*Math.cos(2.51327412),0,1*Math.sin(2.51327412),		0.3,0.3,0.3,
			1*Math.cos(3.14159265),0,1*Math.sin(3.14159265),		0.3,0.3,0.3,
			1*Math.cos(3.76991118),0,1*Math.sin(3.76991118),		0.3,0.3,0.3,
			1*Math.cos(4.39822971),0,1*Math.sin(4.39822971),		0.3,0.3,0.3,
			1*Math.cos(5.02654824),0,1*Math.sin(5.02654824),		0.3,0.3,0.3,
			1*Math.cos(5.65486677),0,1*Math.sin(5.65486677),		0.3,0.3,0.3,
			1*Math.cos(6.28318529),0,1*Math.sin(6.28318529),		0.3,0.3,0.3,
			1*Math.cos(6.91150382),0,1*Math.sin(6.91150382),		0.3,0.3,0.3,
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	}
	
	
	Update() {
		if(this.first == true) {
			this.loc[2] = -2;
			this.velocity2 = [0,0.1,-2];
			m.reapLoc = this.velocity2;
			var reapLoc  = gl.getUniformLocation(m.myWEBGL.program,'reapLoc');
			gl.uniform3fv(reapLoc,new Float32Array(m.reapLoc));
			this.first = false;
		}
		this.velocity = [0,0,0];
		//console.log(this.moveDir1);
		if(this.moveCount > 0) {
			//console.log(this.moveDir1);
			switch(this.moveDir1) {
					case 0:
						this.velocity[0] += this.move;
						this.velocity2[0] += this.move;
					break;
					
					case 1:
						this.velocity[0] -= this.move;
						this.velocity2[0] -= this.move;
					break;
			}
			switch(this.moveDir2) {
					case 0:
						this.velocity[2] += this.move;
						this.velocity2[2] += this.move;
					break;
					
					case 1:
						this.velocity[2] -= this.move;
						this.velocity2[2] -= this.move;
					break;
			}

			for(var i =0; i< 3; i ++) {
			console.log(this.velocity);
			this.loc[i] += this.velocity[i];
			}
			m.reapLoc = this.velocity2;
			var reapLoc  = gl.getUniformLocation(m.myWEBGL.program,'reapLoc');
			gl.uniform3fv(reapLoc,new Float32Array(m.reapLoc));
			this.moveCount -= 1;
		}
		else {
			this.move = (Math.floor((Math.random() * 2)-1)*.01);
			this.moveCount = 50;
			this.moveDir1 = Math.floor((Math.random() * 2));
			this.moveDir2 = Math.floor((Math.random() * 2));
		}
		/*
		m.reapLoc[2] += 0.3;
			var reapLoc  = gl.getUniformLocation(m.myWEBGL.program,'reapLoc');
			gl.uniform3fv(reapLoc,new Float32Array(m.reapLoc));
		*/
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
		
		
		var primitiveType = gl.TRIANGLE_FAN;
		offset = 0;
		var count = 11;
		gl.drawArrays(primitiveType, offset, count);
	}
	
}

class Tree extends GameObject {
	constructor() {
			super();
			this.name = "Tree";
			this.collisionRadius = 0.25;	
			this.buffer=gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
			this.vertices =
		[
		//Tree
			//Bottom
			-0.2,-1,-0.2,	0.4,0.2,0,
			0.2,-1,-0.2,	0.4,0.2,0,
			-0.2,-1,0.2,	0.4,0.2,0,
			0.2,-1,0.2,		0.4,0.2,0,
			
			//Front
			-0.2,0.3,0.2,		0.4,0.2,0,
			0.2,0.3,0.2,		0.4,0.2,0,
			
			//Top
			-0.2,0.3,-0.2,	0.4,0.2,0,
			0.2,0.3,-0.2,		0.4,0.2,0,
			
			//Back
			-0.2,-1,-0.2,	0.4,0.2,0,
			0.2,-1,-0.2,	0.4,0.2,0,
			
			//Right
			0.2,-1,-0.2,	0.4,0.2,0,
			0.2,-1,0.2,		0.4,0.2,0,
			0.2,0.3,-0.2,		0.4,0.2,0,
			0.2,0.3,0.2,		0.4,0.2,0,
			
			//Left
			-0.2,-1,-0.2,	0.4,0.2,0,
			-0.2,-1,0.2,	0.4,0.2,0,
			-0.2,0.3,-0.2,	0.4,0.2,0,
			-0.2,0.3,0.2,		0.4,0.2,0,
			
		//Leaves
			0.8*Math.cos(0.62831853),0.2,0.8*Math.sin(0.62831853),		0,0.5,0,
			0.8*Math.cos(0.62831853),0.8,0.8*Math.sin(0.62831853),		0,0.5,0,
			0.8*Math.cos(1.25663706),0.2,0.8*Math.sin(1.25663706),		0,0.5,0,
			0.8*Math.cos(1.25663706),0.8,0.8*Math.sin(1.25663706),		0,0.5,0,
			0.8*Math.cos(1.88495559),0.2,0.8*Math.sin(1.88495559),		0,0.5,0,
			0.8*Math.cos(1.88495559),0.8,0.8*Math.sin(1.88495559),		0,0.5,0,
			0.8*Math.cos(2.51327412),0.2,0.8*Math.sin(2.51327412),		0,0.5,0,
			0.8*Math.cos(2.51327412),0.8,0.8*Math.sin(2.51327412),		0,0.5,0,
			0.8*Math.cos(3.14159265),0.2,0.8*Math.sin(3.14159265),		0,0.5,0,
			0.8*Math.cos(3.14159265),0.8,0.8*Math.sin(3.14159265),		0,0.5,0,
			0.8*Math.cos(3.76991118),0.2,0.8*Math.sin(3.76991118),		0,0.5,0,
			0.8*Math.cos(3.76991118),0.8,0.8*Math.sin(3.76991118),		0,0.5,0,
			0.8*Math.cos(4.39822971),0.2,0.8*Math.sin(4.39822971),		0,0.5,0,
			0.8*Math.cos(4.39822971),0.8,0.8*Math.sin(4.39822971),		0,0.5,0,
			0.8*Math.cos(5.02654824),0.2,0.8*Math.sin(5.02654824),		0,0.5,0,
			0.8*Math.cos(5.02654824),0.8,0.8*Math.sin(5.02654824),		0,0.5,0,
			0.8*Math.cos(5.65486677),0.2,0.8*Math.sin(5.65486677),		0,0.5,0,
			0.8*Math.cos(5.65486677),0.8,0.8*Math.sin(5.65486677),		0,0.5,0,
			0.8*Math.cos(6.28318529),0.2,0.8*Math.sin(6.28318529),		0,0.5,0,
			0.8*Math.cos(6.28318529),0.8,0.8*Math.sin(6.28318529),		0,0.5,0,
			0.8*Math.cos(6.91150382),0.2,0.8*Math.sin(6.91150382),		0,0.5,0,
			0.8*Math.cos(6.91150382),0.8,0.8*Math.sin(6.91150382),		0,0.5,0,
			
			
			0,1,0, 0,0.5,0,
			0.8*Math.cos(0.62831853),0.8,0.8*Math.sin(0.62831853),		0,0.5,0,
			0.8*Math.cos(1.25663706),0.8,0.8*Math.sin(1.25663706),		0,0.5,0,
			0.8*Math.cos(1.88495559),0.8,0.8*Math.sin(1.88495559),		0,0.5,0,
			0.8*Math.cos(2.51327412),0.8,0.8*Math.sin(2.51327412),		0,0.5,0,
			0.8*Math.cos(3.14159265),0.8,0.8*Math.sin(3.14159265),		0,0.5,0,
			0.8*Math.cos(3.76991118),0.8,0.8*Math.sin(3.76991118),		0,0.5,0,
			0.8*Math.cos(4.39822971),0.8,0.8*Math.sin(4.39822971),		0,0.5,0,
			0.8*Math.cos(5.02654824),0.8,0.8*Math.sin(5.02654824),		0,0.5,0,
			0.8*Math.cos(5.65486677),0.8,0.8*Math.sin(5.65486677),		0,0.5,0,
			0.8*Math.cos(6.28318529),0.8,0.8*Math.sin(6.28318529),		0,0.5,0,
			0.8*Math.cos(6.91150382),0.8,0.8*Math.sin(6.91150382),		0,0.5,0,
			
			0,0,0, 0,0.5,0,
			0.8*Math.cos(0.62831853),0.2,0.8*Math.sin(0.62831853),		0,0.5,0,
			0.8*Math.cos(1.25663706),0.2,0.8*Math.sin(1.25663706),		0,0.5,0,
			0.8*Math.cos(1.88495559),0.2,0.8*Math.sin(1.88495559),		0,0.5,0,
			0.8*Math.cos(2.51327412),0.2,0.8*Math.sin(2.51327412),		0,0.5,0,
			0.8*Math.cos(3.14159265),0.2,0.8*Math.sin(3.14159265),		0,0.5,0,
			0.8*Math.cos(3.76991118),0.2,0.8*Math.sin(3.76991118),		0,0.5,0,
			0.8*Math.cos(4.39822971),0.2,0.8*Math.sin(4.39822971),		0,0.5,0,
			0.8*Math.cos(5.02654824),0.2,0.8*Math.sin(5.02654824),		0,0.5,0,
			0.8*Math.cos(5.65486677),0.2,0.8*Math.sin(5.65486677),		0,0.5,0,
			0.8*Math.cos(6.28318529),0.2,0.8*Math.sin(6.28318529),		0,0.5,0,
			0.8*Math.cos(6.91150382),0.2,0.8*Math.sin(6.91150382),		0,0.5,0,
			
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	}
	
	Update() {
	}
	
	Render(program)
	 {
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
		var count = 10;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 10;
		count = 4;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 14;
		count = 4;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 18
		count = 22;
		gl.drawArrays(primitiveType, offset, count);
		
		primitiveType = gl.TRIANGLE_FAN;
		offset = 40;
		count = 12;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 52;
		count = 12;
		gl.drawArrays(primitiveType, offset, count);
		

	 }
}

class Rock extends GameObject {
	constructor() {
			super();
			this.name = "Rock";
			this.collisionRadius = 0.35;	
			this.buffer=gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
			this.vertices =
		[
			//back
			-0.2,-0.1,-0.2,	0.6,0.2,0,
			0.2,-0.1,-0.2,	0.6,0.2,0,
			-0.2,0.1,-0.2,	0.6,0.2,0,
			0.2,0.1,-0.2,	0.6,0.2,0,
			
			//left
			-0.2,-0.1,-0.2,	0.6,0.2,0,
			-0.2,-0.1,0.2,	0.6,0.2,0,
			-0.2,0.1,-0.2,	0.6,0.2,0,
			-0.2,0.1,0.2,	0.6,0.2,0,
			
			//front
			-0.2,0.1,0.2,	0.6,0.2,0,
			-0.2,-0.1,0.2,	0.6,0.2,0,
			0.2,0.1,0.2,	0.6,0.2,0,
			0.2,-0.1,0.2,	0.6,0.2,0,
			
			//right
			0.2,0.1,0.2,	0.6,0.2,0,
			0.2,-0.1,0.2,	0.6,0.2,0,
			0.2,0.1,-0.2,	0.6,0.2,0,
			0.2,-0.1,-0.2,	0.6,0.2,0,
			
			//top
			0.2,0.1,0.2,	0.6,0.2,0,
			-0.2,0.1,0.2,	0.6,0.2,0,
			0.2,0.1,-0.2,	0.6,0.2,0,
			-0.2,0.1,-0.2,	0.6,0.2,0,
			
			
			//Back
			-0.3,-0.3,-0.3,	0.6,0.2,0,
			0.3,-0.3,-0.3,	0.6,0.2,0,
			-0.3,-0.1,-0.3,	0.6,0.2,0,
			0.3,-0.1,-0.3,	0.6,0.2,0,
			
			//Left
			-0.3,-0.3,-0.3,	0.6,0.2,0,
			-0.3,-0.3,0.3,	0.6,0.2,0,
			-0.3,-0.1,-0.3,	0.6,0.2,0,
			-0.3,-0.1,0.3,	0.6,0.2,0,
			
			//Front
			-0.3,-0.1,0.3,	0.6,0.2,0,
			-0.3,-0.3,0.3,	0.6,0.2,0,
			0.3,-0.1,0.3,	0.6,0.2,0,
			0.3,-0.3,0.3,	0.6,0.2,0,
			
			//Right
			0.3,-0.1,0.3,	0.6,0.2,0,
			0.3,-0.3,0.3,	0.6,0.2,0,
			0.3,-0.1,-0.3,	0.6,0.2,0,
			0.3,-0.3,-0.3,	0.6,0.2,0,
			
			//Top
			0.3,-0.1,0.3,	0.6,0.2,0,
			-0.3,-0.1,0.3,	0.6,0.2,0,
			0.3,-0.1,-0.3,	0.6,0.2,0,
			-0.3,-0.1,-0.3,	0.6,0.2,0,

		
			//-0.2,-0.3,-0.2,	0.4,0.2,0,
			//-0.2,0,-0.2,	0.4,0.2,0,
			//0.2,-0.3,-0.2,	0.4,0.2,0,
			//0.2,-0.13,-0.2,	0.4,0.2,0,
			
			//0.2,-0.13,-0.2,	0.4,0.2,0,
			//0.2,-0.3,-0.2,	0.4,0.2,0,
			//0.2,-0.1,-0.2,	0.4,0.2,0,
			//0.2,-0.1,-0.2,	0.4,0.2,0,
			
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			-0.1,-0.3,-0.1,	0.4,0.2,0,
			
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	}
	
	Update() {
	}
	
	Render(program)
	 {
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
		
		offset = 24;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 28;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 32;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 36;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 40;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);
		
		offset = 44;
		var count = 4;
		gl.drawArrays(primitiveType, offset, count);

	 }
}

class Floor extends GameObject {
	constructor() {
			super();
			this.name = "Floor";
			this.collisionRadius = 0;	
			this.buffer=gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
			this.vertices =
		[
			-1000,0,-1000,	0,0.5,0,
			-1000,0,1000,	0,0.5,0,
			1000,0,-1000,	0,0.5,0,
			1000,0,1000,	0,0.5,0
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	}
	
	Update() {
		
	}
	
	Render(program)
	 {
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
	 
	 gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
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

