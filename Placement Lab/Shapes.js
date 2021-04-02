
  class ShapeRot
 {
	 constructor()
	 {
		 this.buffer=gl.createBuffer();
		 gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		 //Now we want to add color to our vertices information.
		 this.vertices =
		 [	
		 0,0.3,0,1,0,0,
		 0,0,0.3,1,0,0,
		 0.3,0,0,1,0,0,
		 
		 0.0,0.3,0,0,1,0,
		 0,0,0.3,0,1,0,
		 -0.3,0,0,0,1,0,
		 
		 0,-0.3,0,1,0,0,
		 0,0,0.3,1,0,0,
		 0.3,0,0,1,0,0,
		 
		 0.0,-0.3,0,0,1,0,
		 0,0,0.3,0,1,0,
		 -0.3,0,0,0,1,0,
		 
		 0,0.3,0,0,0,1,
		 0,0,-0.3,0,0,1,
		 0.3,0,0,0,0,1,
		 
		 0.0,0.3,0,1,0,1,
		 0,0,-0.3,1,0,1,
		 -0.3,0,0,1,0,1,
		 
		 0,-0.3,0,0,0,1,
		 0,0,-0.3,0,0,1,
		 0.3,0,0,0,0,1,
		 
		 0.0,-0.3,0,1,0,1,
		 0,0,-0.3,1,0,1,
		 -0.3,0,0,1,0,1,
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
		this.loc = [0.0,0.0,0.0];
		this.rot = [0.0,0.0,0.0];
	 }
	 //Again this could be inherited ... but not always...not all objects
	 
	 render(program)
	 {
		 
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
 class ShapeMove
 {
	 constructor()
	 {
		this.buffer=gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		this.vertices =
		 [	
		 0,0.3,0,1,0,0,
		 0,0,0.3,1,0,0,
		 0.3,0,0,1,0,0,
		 
		 0.0,0.3,0,0,1,0,
		 0,0,0.3,0,1,0,
		 -0.3,0,0,0,1,0,
		 
		 0,-0.3,0,1,0,0,
		 0,0,0.3,1,0,0,
		 0.3,0,0,1,0,0,
		 
		 0.0,-0.3,0,0,1,0,
		 0,0,0.3,0,1,0,
		 -0.3,0,0,0,1,0,
		 
		 0,0.3,0,0,0,1,
		 0,0,-0.3,0,0,1,
		 0.3,0,0,0,0,1,
		 
		 0.0,0.3,0,1,0,1,
		 0,0,-0.3,1,0,1,
		 -0.3,0,0,1,0,1,
		 
		 0,-0.3,0,0,0,1,
		 0,0,-0.3,0,0,1,
		 0.3,0,0,0,0,1,
		 
		 0.0,-0.3,0,1,0,1,
		 0,0,-0.3,1,0,1,
		 -0.3,0,0,1,0,1,
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

		
		this.loc=[0,0,0];
		this.rot=[0,0,0];
		this.locDir= Math.floor((Math.random() * 8));
	 }
	 
	 render(program)
	 {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
				
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
 