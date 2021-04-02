class Shape {
	constructor()
	{
		//Now we have to explain to GLSL how to interperate our data
		//Find the position location in the program
		//2nd create a position bufffer
		//3rd create a
		//this.inputs = 0;
		this.primitiveType = gl.TRIANGLES;
		this.isFinished = false;
		this.positions = [];
		this.count = 0;
		this.color = [0, 1, 0];
		this.poly=false;
	}
	/*
	addPoint(x,y) {
		//Reduces remaining inputs
		this.inputs -= 1;
		
		//Adds the new points
		this.positions.push(x);
		this.positions.push(y);
		this.positions.push(0);
		
		//Adds the color
		this.positions.push(1);
		this.positions.push(0);
		this.positions.push(0);
		
		//console.log(this.positions);
		
		//Tracks remaining inputs
		if(this.inputs == 0) {
			this.isFinished = true;
		}
				
	}
	
	addCursor(x,y){
		var a = this.color[0];
		var b = this.color[1];
		var c = this.color[2];
		this.positions.push(x);
		this.positions.push(y);
		this.positions.push(0);
		this.positions.push(a);
		this.positions.push(b);
		this.positions.push(c);	
		
		
	}
	
	
	remPoints() {
		for(var k = 0; k < 6; k++) {
			this.positions.pop();
		}
	}
	*/
			
	render(program)
	{
				
		//Create a position buffer;
		this.positionBuffer = gl.createBuffer();
		//Bind "ARRAY_BUFFER type to the position buffer";
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		//load the points.
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
		
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		//Now we have to find the attribute position in the program --- think of this as a pointer.
		
		var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
		//Now we specify HOW TO read our vertics
		gl.enableVertexAttribArray(positionAttributeLocation);
		//Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
		var size = 3;										//2 components per iteration
		var type = gl.FLOAT									//the data is 32bit floats
		var normalize = false;								//don't normalize the data
		var stride = 6*Float32Array.BYTES_PER_ELEMENT;		//0 = move forward size * sizeof(type) each iteration
		var offset = 0;										//start at the beginning of the buffer
		gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
				
				
				
		var colorAttributeLocation = gl.getAttribLocation(program, "a_color");
		//Now we specify HOW TO read our vertics
		gl.enableVertexAttribArray(colorAttributeLocation);
		//Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
		var size = 3;										//2 components per iteration
		var type = gl.FLOAT									//the data is 32bit floats
		var normalize = false;								//don't normalize the data
		var stride = 6*Float32Array.BYTES_PER_ELEMENT;		//0 = move forward size * sizeof(type) each iteration
		var offset = 3*Float32Array.BYTES_PER_ELEMENT;		//start at the beginning of the buffer
		gl.vertexAttribPointer(colorAttributeLocation, size, type, normalize, stride, offset);
		var offset = 0;
		//gl.drawArrays(primitiveType, offset, count);
		gl.drawArrays(this.primitiveType,offset,this.count);
		
		//console.log("Rendered in shape.js");
	}
}

class Box extends Shape {
	constructor()
	{
		super();
		this.inputs = 2;
		this.primitiveType = gl.LINE_STRIP;
		this.isFinished = false;
		this.count = 5;
		this.oldX;
		this.oldY;
	}
	
	addPoint(x,y) {
		//Reduces remaining inputs
		this.inputs -= 1;

		//console.log(this.positions);
		//console.log(this.inputs);
		
		switch(this.inputs) {
			case 1:
				this.oldX = x;
				this.oldY = y;
				this.positions.push(x);
				this.positions.push(y);
				this.positions.push(0);
				this.positions.push(this.a);
				this.positions.push(this.b);
				this.positions.push(this.c);	
			break;
			
			case 0:
				this.positions.push(x);
				this.positions.push(this.oldY);
				this.positions.push(0);
				this.positions.push(this.a);
				this.positions.push(this.b);
				this.positions.push(this.c);
				
				this.positions.push(x);
				this.positions.push(y);
				this.positions.push(0);
				this.positions.push(this.a);
				this.positions.push(this.b);
				this.positions.push(this.c);
				
				this.positions.push(this.oldX);
				this.positions.push(y);
				this.positions.push(0);
				this.positions.push(this.a);
				this.positions.push(this.b);
				this.positions.push(this.c);
				this.isFinished = true;
				
				this.positions.push(this.oldX);
				this.positions.push(this.oldY);
				this.positions.push(0);
				this.positions.push(this.a);
				this.positions.push(this.b);
				this.positions.push(this.c);
				this.isFinished = true;
			break;
			
		}
		//console.log(this.positions);	
		//console.log(this.positions.length);		
	}
	
	addCursor(x,y){
				this.positions.push(x);
				this.positions.push(this.oldY);
				this.positions.push(0);
				this.positions.push(this.a);
				this.positions.push(this.b);
				this.positions.push(this.c);
				
				this.positions.push(x);
				this.positions.push(y);
				this.positions.push(0);
				this.positions.push(this.a);
				this.positions.push(this.b);
				this.positions.push(this.c);
				
				this.positions.push(this.oldX);
				this.positions.push(y);
				this.positions.push(0);
				this.positions.push(this.a);
				this.positions.push(this.b);
				this.positions.push(this.c);
				
				this.positions.push(this.oldX);
				this.positions.push(this.oldY);
				this.positions.push(0);
				this.positions.push(this.a);
				this.positions.push(this.b);
				this.positions.push(this.c);
				//console.log(this.positions);
				//console.log(this.positions.length);	
		
		
	}
	
	
	remPoints() {
		for(var k = 0; k < 24; k++) {
			this.positions.pop();
		}
		//console.log(this.positions.length);	
	}
	
	setColor() {
		this.a = this.color[0];
		this.b = this.color[1];
		this.c = this.color[2];
	}
	
	
}

class Line extends Shape {
	constructor()
	{
		super();
		this.inputs = 2;
		this.primitiveType = gl.LINE_STRIP;
		this.isFinished = false;
		this.count = 2;
	}
	
	addPoint(x,y) {
		//Reduces remaining inputs
		this.inputs -= 1;
		
		//console.log(this.positions);
		
		
		switch(this.inputs) {
			case 1:
				this.positions.push(x);
				this.positions.push(y);
				this.positions.push(0);
				this.positions.push(this.a);
				this.positions.push(this.b);
				this.positions.push(this.c);	
			break;
			
			case 0:
				this.positions.push(x);
				this.positions.push(y);
				this.positions.push(0);
				this.positions.push(this.a);
				this.positions.push(this.b);
				this.positions.push(this.c);	
				this.isFinished = true;
			break;
		}
		
	}
	
	addCursor(x,y){
		this.positions.push(x);
		this.positions.push(y);
		this.positions.push(0);
		this.positions.push(this.a);
		this.positions.push(this.b);
		this.positions.push(this.c);	
		
		
	}
	
	
	remPoints() {
		for(var k = 0; k < 6; k++) {
			this.positions.pop();
		}
	}
	
	setColor() {
		this.a = this.color[0];
		this.b = this.color[1];
		this.c = this.color[2];
	}
	
}

class Circle extends Shape {
	constructor()
	{
		super();
		this.inputs = 2;
		this.primitiveType = gl.TRIANGLE_FAN;
		this.isFinished = false;
		this.count = 21;
		this.oldX;
		this.oldY;
	}
	
	addPoint(x,y) {
		//Reduces remaining inputs
		this.inputs -= 1;
		
		//console.log(this.positions);
		
		switch(this.inputs) {
			case 1:
				this.oldX = x;
				this.oldY = y;
			break;
			
			case 0:
				var r = Math.sqrt((this.oldX-x)*(this.oldX-x)+((this.oldY-y)*(this.oldY-y)));
				
				var z = 0.314159266; //One twentieth of 360 degrees, in radians.
				for(var i = 0; i < 21; i++) {
					//console.log(z);
					this.positions.push(this.oldX+(r*Math.cos(z)));
					this.positions.push(this.oldY+(r*Math.sin(z)));
					this.positions.push(0);
					this.positions.push(this.a);
					this.positions.push(this.b);
					this.positions.push(this.c);	
					z+=0.314159266;
					}
				this.isFinished = true;
			break;
		}	
	}
	
	addCursor(x,y){
		var r = Math.sqrt((this.oldX-x)*(this.oldX-x)+((this.oldY-y)*(this.oldY-y)));		
		var z = 0.314159266; //One twentieth of 360 degrees, in radians.
		for(var i = 0; i < 21; i++) {
			//console.log(z);
			this.positions.push(this.oldX+(r*Math.cos(z)));
			this.positions.push(this.oldY+(r*Math.sin(z)));
			this.positions.push(0);
			this.positions.push(this.a);
			this.positions.push(this.b);
			this.positions.push(this.c);	
			z+=0.314159266;
			}
	}
	
	
	remPoints() {
		for(var k = 0; k < 126; k++) {
			this.positions.pop();
		}
	}
	
	setColor() {
		this.a = this.color[0];
		this.b = this.color[1];
		this.c = this.color[2];
	}
}

class Triangle extends Shape {
	constructor()
	{
		super();
		this.inputs = 3;
		this.primitiveType = gl.TRIANGLES;
		this.isFinished = false;
		this.count = 3;
	}
	
	addPoint(x,y) {
		//Reduces remaining inputs
		this.inputs -= 1;
		
		switch(this.inputs) {
			case 2:
				
				this.positions.push(x);
				this.positions.push(y);
				this.positions.push(0);
				this.positions.push(this.a);
				this.positions.push(this.b);
				this.positions.push(this.c);	
			break;
			
			case 1:
				this.positions.push(x);
				this.positions.push(y);
				this.positions.push(0);
				this.positions.push(this.a);
				this.positions.push(this.b);
				this.positions.push(this.c);	
			break;
			
			case 0:
				this.positions.push(x);
				this.positions.push(y);
				this.positions.push(0);
				this.positions.push(this.a);
				this.positions.push(this.b);
				this.positions.push(this.c);	
				//console.log(this.positions);
				this.isFinished = true;
			break;
		}			
	}
	
	addCursor(x,y){
		if(this.positions.length < 7) {
			this.primitiveType = gl.LINE_STRIP;
			this.count = 2;
		}
		else {
			this.count = 3;
		}
		this.positions.push(x);
		this.positions.push(y);
		this.positions.push(0);
		this.positions.push(this.a);
		this.positions.push(this.b);
		this.positions.push(this.c);	
	}
	
	
	remPoints() {
		for(var k = 0; k < 6; k++) {
			this.positions.pop();
		}
	}
	
	setColor() {
		this.a = this.color[0];
		this.b = this.color[1];
		this.c = this.color[2];
	}
}

class NPoly extends Shape {
	constructor()
	{
		super();
		this.primitiveType = gl.LINE_STRIP;
		this.isFinished = false;
		this.count = 0;
		this.poly = true;
	}
	
	addPoint(x,y) {
		//console.log(this.positions);
		this.positions.push(x);
		this.positions.push(y);
		this.positions.push(0);
		this.positions.push(this.a);
		this.positions.push(this.b);
		this.positions.push(this.c);	
		this.count +=1;
	}
	
	addCursor(x,y){
		this.primitiveType = gl.LINE_STRIP;
		this.positions.push(x);
		this.positions.push(y);
		this.positions.push(0);
		this.positions.push(this.a);
		this.positions.push(this.b);
		this.positions.push(this.c);	
		this.count +=1;
	}
	
	
	remPoints() {
		for(var k = 0; k < 6; k++) {
			this.positions.pop();
		}
		this.count -=1;
	}
	
	setColor() {
		this.a = this.color[0];
		this.b = this.color[1];
		this.c = this.color[2];
	}
}















