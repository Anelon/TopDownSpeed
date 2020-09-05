import Vec2 from "../sharedJS/vec2.js";
import Drawable from "./drawable.js";
import Entity from "../sharedJS/entity.js";
import Player from "../sharedJS/player.js";
import Projectile from "../sharedJS/projectile.js";
/** @typedef { import("./playerController.js").default } PlayerController; */

//TODO figure out resizing
//https://stackoverflow.com/questions/1664785/resize-html5-canvas-to-fit-window

//this handles all canvas drawing and holding the canvas
class CanvasWrapper {
	/**
	 * 
	 * @param {Object} [params] 
	 * @property {string} [id="game"]
	 * @property {Vec2} [canvasSize=null]
	 * @property {Vec2} [tileSize=new Vec2(16,16)]
	 * @property {number} [scale=1]
	 */
	constructor(params = {}) {
		const id = params.id || "game";
		const canvasSize = params.canvasSize || null;
		const tileSize = params.tileSize || new Vec2(16, 16);
		this.scale = params.scale || 1;

		/** @type {HTMLCanvasElement} */
		this.canvas = (document.getElementById(id));
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
		this.drawables = new Map();
	}
	/**
	 * @returns {number} Canvas width
	 */
	get width() {
		return this.canvas.width;
	}
	/**
	 * @returns {number} Canvas height
	 */
	get height() {
		return this.canvas.height;
	}
	/**
	 * Adds a drawable to drawables
	 * @param {Drawable|Entity|Player|Projectile} drawable 
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
			//if drawable has an id use it for the delete
			if (drawable.id)
				this.drawables.delete(drawable.id);
			else //else assume drawable is the id
				this.drawables.delete(drawable);
		}
	}
	//basic clear the canvas
	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	/**
	 * Draws all drawables to the canvas
	 * @param {PlayerController|Player|Entity} [skip] Optional object to skip
	 */
	render(skip) {
		for (let draw of this.drawables.values()) {
			if (draw.owner !== skip)
				draw.draw(this);
		}
	}
	/**
	 * Draws an image with a vec2 origin, vec2 look direction, bool if you want to have an outline around the image
	 * @param {CanvasImageSource} img Image to be drawn
	 * @param {Vec2} origin Center of image
	 * @param {Vec2} look Direction the image is looking at
	 * @param {boolean} withOutline If an outline should be drawn
	 */
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
			// @ts-ignore image.width and height will be a number
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
	 * @param {CanvasImageSource} img Image to draw
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

	/**
	 * Draws the player's crosshair with vec2 origin and string color
	 * @param {Vec2} origin Location of the crosshair
	 * @param {string} color Color string
	 */
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

	/**
	 * Draws a line from origin to destination
	 * @param {Vec2} origin Start of line
	 * @param {Vec2} destination End of line
	 * @param {string} [color="black"] Color of line
	 * @param {number} [alpha=0.2] Transparency of line
	 */
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

	/**
	 * Draws a health bar centered at origin with dimentions according to value
	 * @param {Vec2} origin Center of health bar
	 * @param {Vec2} dimentions Width and Height of bar
	 * @param {number} value Current value that the bar represents
	 * @param {number} maxValue Max value that the bar can have
	 * @param {string} [fillColor="red"] Color of the inside of the bar
	 * @param {string} [strokeColor="black"] Color of the boarder of the bar
	 * @param {number} [alpha=0.7] How transparent the bar is
	 * @param {number} [strokeWeight=2] Width of the boarder around bar
	 */
	drawHealthBar(origin, dimentions, value, maxValue, fillColor = "red", strokeColor = "black", alpha = 0.7, strokeWeight = 2) {
		this.ctx.save();

        //multiply by 0.5 to get half dimentions so thhat it puts in the top left
		const topLeft = origin.sub(dimentions.multiplyScalar(0.5));
		const barDimentions = dimentions.clone();
		barDimentions.x *= value / maxValue;

		this.ctx.globalAlpha = alpha;
		this.ctx.fillStyle = fillColor;
		this.ctx.fillRect(topLeft.x, topLeft.y, barDimentions.x, barDimentions.y);

		this.ctx.lineWidth = strokeWeight;
		this.ctx.strokeStyle = strokeColor;
		this.ctx.strokeRect(topLeft.x, topLeft.y, dimentions.x, dimentions.y);

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
