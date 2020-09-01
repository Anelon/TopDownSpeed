import Vec2 from "../sharedJS/vec2.js";
import Drawable from "./drawable.js";


//this handles all canvas drawing and holding the canvas
class CanvasWrapper {
	/**
	 * 
	 * @param {string} [id="game"] Target Canvas ID from HTML
	 * @param {Vec2} [canvasSize] 
	 * @param {Vec2} [tileSize=new Vec2(16,16)] 
	 */
	constructor(id = "game", canvasSize = null, tileSize = new Vec2(16,16)) {
		this.canvas = document.getElementById(id);
		this.ctx = this.canvas.getContext('2d');
		this.borderSize = 40;
		if(canvasSize === null) {
			this.canvas.width = window.innerWidth - this.borderSize;
			this.canvas.height = window.innerHeight - this.borderSize;
		} else {
			this.canvas.width = canvasSize.x;
			this.canvas.height = canvasSize.y;
		}
		this.ctx.font = "18px arial";
		this.ctx.lineWidth = 1;

		this.tileSize = tileSize;
		//TODO: refactor to map
		this.drawables = new Map();
	}
	get width() {
		return this.canvas.width;
	}
	get height() {
		return this.canvas.height;
	}
	/**
	 * Adds a drawable to drawables
	 * @param {Drawable|Entity} drawable 
	 */
	addDrawable(drawable) {
		if(drawable instanceof Drawable) {
			this.drawables.set(drawable.owner.id, drawable);
			//this.drawables.push(drawable);
		} else {
			this.drawables.set(drawable.id, new Drawable(drawable));
		}
	}
	/**
	 * Deletes a drawable from drawables
	 * @param {Drawable|Entity} drawable 
	 */
	removeDrawable(drawable) {
		if(drawable instanceof Drawable) {
			this.drawables.delete(drawable.owner.id);
		} else {
			this.drawables.delete(drawable.id);
		}
	}
	//basic clear the canvas
	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	render(skip) {
		for (let draw of this.drawables.values()) {
			if (draw.owner !== skip)
				draw.draw(this);
		}
	}
	//draws an image with a vec2 origin, vec2 look direction, bool if you want to have an outline around the image
	drawImageLookat(img, origin, look, withOutline = false) {
		//save context 
		this.ctx.save();

		this.ctx.setTransform(1, 0, 0, 1, origin.x, origin.y);
		this.ctx.rotate(Math.atan2(look.y, look.x)); // Adjust image 90 degree anti clockwise (PI/2) because the image  is pointing in the wrong direction.
		if (withOutline) {
			let dArr = [-1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1], // offset array
				s = 2,  // thickness scale
				i = 0,  // iterator
				bx = -img.width / 2,  // image position
				by = -img.height / 2;

			// draw images at offsets from the array scaled by s
			for (; i < dArr.length; i += 2)
				this.ctx.drawImage(img, bx + dArr[i] * s, by + dArr[i + 1] * s);

			// fill with color
			//this.ctx.globalCompositeOperation = "source-in";
			this.ctx.globalCompositeOperation = "source-atop";
			this.ctx.fillStyle = "red";
			this.ctx.fillRect(-img.width / 2 - s, -img.height / 2 - s, img.width + 2 * s, img.height + 2 * s);

			// draw original image in normal mode
			this.ctx.globalCompositeOperation = "source-over";
		}
		this.ctx.drawImage(img, -img.width / 2, -img.height / 2);

		//restore back to previous settings
		this.ctx.restore();
	}
	/**
	 * Draws an image at location x, y. Include sx, sy and width, height if you want to draw part of an image
	 * @param {Image} img Image to draw
	 * @param {number} x X location of top right corner
	 * @param {number} y Y location of top right corner
	 * @param {number} [sx=null] Images X location to start drawing
	 * @param {number} [sy] 
	 * @param {number} [width] Width of image to print
	 * @param {number} [height] Height of image to print
	 */
	drawImage(img, x, y, sx = null, sy, width, height) {
		if(sx !== null) {
			this.ctx.drawImage(img, sx, sy, width, height, x, y, width, height);
		} else {
			this.ctx.drawImage(img, x, y);
		}
	}

	//draws the player's crosshair with vec2 origin and string color
	drawCrossHair(origin, color) {
		const x = origin.x, y = origin.y;
		this.ctx.strokeStyle = color;
		this.ctx.beginPath();
		this.ctx.moveTo(x - 10, y);
		this.ctx.lineTo(x + 10, y);
		this.ctx.moveTo(x, y - 10);
		this.ctx.lineTo(x, y + 10);
		this.ctx.stroke();
	}

	drawLine(origin, destination, color = "black", alpha = 0.2) {
		this.ctx.save();

		this.ctx.strokeStyle = color;
		this.ctx.beginPath();
		this.ctx.globalAlpha = alpha;
		this.ctx.moveTo(origin.x, origin.y);
		this.ctx.lineTo(destination.x, destination.y);
		this.ctx.stroke();

		this.ctx.restore();
	}

	drawGrid(color = "black", alpha = 0.2) {

		this.ctx.strokeStyle = color;
		for(let i = 0; i < this.width; i += this.tileSize.x) {
			this.ctx.save();

			this.ctx.beginPath();
			this.ctx.globalAlpha = alpha;
			this.ctx.moveTo(i, 0);
			this.ctx.lineTo(i, this.height);
			this.ctx.stroke();

			this.ctx.restore();
		}
		for(let j = 0; j < this.height; j += this.tileSize.y) {
			this.ctx.save();

			this.ctx.beginPath();
			this.ctx.globalAlpha = alpha;
			this.ctx.moveTo(0, j);
			this.ctx.lineTo(this.width, j);
			this.ctx.stroke();

			this.ctx.restore();
		}

	}
	getBoundingClientRect() {
		return this.canvas.getBoundingClientRect();
	}
	addEventListener(event, func) {
		console.log(event);
		this.canvas.addEventListener(event, func);
	}
}

export default CanvasWrapper;
