import Vec2 from "../sharedJS/vec2.js";
import Drawable from "./drawable.js";
import Player from "../sharedJS/player.js";
/** @typedef {import("../sharedJS/ability/projectile.js").default} Projectile */
/** @typedef {import("../sharedJS/entity.js").default} Entity */
/** @typedef { import("./playerController.js").default } PlayerController; */
/** @typedef { import("./sprite.js").default } Sprite; */

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
	 * @property {function} [boundsCallback=null]
	 */
	constructor(params = {}) {
		const id = params.id || "game";
		const canvasSize = params.canvasSize || null;
		const tileSize = params.tileSize || new Vec2(16, 16);
		this.scale = params.scale || 1;
		this.boundsCallback = params.boundsCallback || null;

		//using querySelector to garantee a canvas
		/** @type HTMLCanvasElement */
		this.canvas = document.querySelector(`canvas.${id}`);
		//disable context menu on page
		this.canvas.addEventListener('contextmenu', function (e) {
			e.preventDefault();
		}, false);
		this.ctx = this.canvas.getContext('2d');
		//https://stackoverflow.com/questions/195262/can-i-turn-off-antialiasing-on-an-html-canvas-element
		//supposed to fix antialiasing but its not =(
		//TODO just scale all of the images
		this.ctx['imageSmoothingEnabled'] = false;       /* standard */
		this.ctx['mozImageSmoothingEnabled'] = false;    /* Firefox */
		this.ctx['oImageSmoothingEnabled'] = false;      /* Opera */
		this.ctx['webkitImageSmoothingEnabled'] = false; /* Safari */
		this.ctx['msImageSmoothingEnabled'] = false;     /* IE */

		this.canvasSize = canvasSize;
		this.resize();

		this.ctx.font = "18px arial";
		this.ctx.lineWidth = 1;

		this.tileSize = tileSize;
		this.drawables = new Map();
		//center is actually topright
		this.topRight = new Vec2();
		window.addEventListener("resize", this.resize.bind(this));
	}
	resize() {
		console.log("resizing");
		this.borderSize = 40;
		this.canvas.width = window.innerWidth - this.borderSize;
		this.canvas.height = window.innerHeight - this.borderSize;
		if(this.canvasSize) {
			this.mapSize = this.canvasSize.clone();
			this.canvas.width = Math.min(this.canvasSize.x, this.canvas.width);
			this.canvas.height = Math.min(this.canvasSize.y, this.canvas.height);
		} else {
			this.mapSize = new Vec2(this.canvas.width, this.canvas.height);
		}
		if(this.boundsCallback) this.boundsCallback(this.getBoundingClientRect());
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
	 * @param {Drawable|Entity|Player|Projectile|Sprite} drawable 
	 */
	addDrawable(drawable) {
		if(drawable instanceof Drawable) {
			this.drawables.set(drawable.owner.id, drawable);
			//this.drawables.push(drawable);
		} else {
			this.drawables.set(drawable.id, new Drawable(drawable, drawable.scale));
		}
	}
	/**
	 * Deletes a drawable from drawables
	 * @param {Drawable|Entity|Sprite} drawable 
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
		this.ctx.clearRect(0, 0, this.mapSize.x, this.mapSize.y);
	}
	/**
	 * @param {Vec2} newCenter
	 */
	setCenter(newCenter) {
		let [x, y] = newCenter.getXY();
		let [mapx, mapy] = this.mapSize.getXY();
		let [drawx, drawy] = [this.canvas.width, this.canvas.height];
		let halfDrawx = drawx/2;
		let halfDrawy = drawy/2;
		//clamp the values
		if(x - halfDrawx < 0) x = 0;
		else if (x + halfDrawx >= mapx) x = mapx - drawx;
		else x = x - halfDrawx;

		if(y - halfDrawy < 0) y = 0;
		else if (y + halfDrawy >= mapy) y = mapy - drawy;
		else y = y - halfDrawy;

		this.topRight = new Vec2(x,y);
		this.ctx.setTransform(1, 0, 0, 1, -x, -y);
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
	 * @param {boolean} [withOutline] If an outline should be drawn
	 * @param {number} [scale] Image scale
	 * @param {number} [sx]
	 * @param {number} [sy]
	 * @param {number} [width]
	 * @param {number} [height]
	 */
	drawImageLookat(img, origin, look, withOutline = false, scale = 1, sx=null, sy, width, height) {
		//save context 
		this.ctx.save();

		this.ctx.transform(1, 0, 0, 1, origin.x, origin.y);
		this.ctx.rotate(Math.atan2(look.y, look.x)); // Adjust image 90 degree anti clockwise (PI/2) because the image  is pointing in the wrong direction.
		if (withOutline) {
			this.drawOutline(img, scale);
		}
		if (sx !== null) {
			this.drawImage(img, (-width * scale) / 2, (-height * scale) / 2, scale, sx, sy, width, height);
		} else {
			this.drawImage(img, (-img.width * scale) / 2, (-img.height * scale) / 2, scale);
		}

		//restore back to previous settings
		this.ctx.restore();
	}
	/**
	 * Draws an image at location x, y. Include sx, sy and width, height if you want to draw part of an image
	 * @param {CanvasImageSource} img Image to draw
	 * @param {number} x X location of top right corner
	 * @param {number} y Y location of top right corner
	 * @param {number} scale Images X location to start drawing
	 * @param {number} [sx=null] Images X location to start drawing
	 * @param {number} [sy] 
	 * @param {number} [width] Width of image to print
	 * @param {number} [height] Height of image to print
	 */
	drawImage(img, x, y, scale, sx = null, sy, width, height) {
		if(sx !== null) {
			this.ctx.drawImage(img, sx, sy, width, height, x, y, width * scale, height * scale);
		} else {
			// @ts-ignore
			this.ctx.drawImage(img, 0, 0, img.width, img.height, x, y, img.width * scale, img.height * scale);
		}
	}
	/**
	 * Draws an image with a vec2 origin, vec2 look direction, bool if you want to have an outline around the image
	 * @param {CanvasImageSource} img Image to be outlined
	 * @param {number} scale Scale of image
	 * @param {string} color color of outline
	 */
	drawOutline(img, scale, color = "red") {
		const dArr = [-1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1], // offset array
			s = 2 + scale,  // thickness scale
			bx = -img.width * scale / 2,  // image position
			by = -img.height * scale / 2;

		// draw images at offsets from the array scaled by s
		//TODO fix for drawing sprite sheets as well
		for (let i = 0; i < dArr.length; i += 2)
			this.drawImage(img, bx + dArr[i] * s, by + dArr[i + 1] * s, scale);

		// fill with color
		//this.ctx.globalCompositeOperation = "source-in";
		this.ctx.globalCompositeOperation = "source-atop";
		this.ctx.fillStyle = color;
		// @ts-ignore image.width and height will be a number
		this.ctx.fillRect(-img.width * scale / 2 - s, -img.height * scale / 2 - s, img.width * scale + 2 * s, img.height * scale + 2 * s);

		// draw original image in normal mode
		this.ctx.globalCompositeOperation = "source-over";
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
	 * @param {Vec2} topLeft
	 * @param {Vec2} dimentions
	 * @param {string} [color]
	 * @param {number} [strokeWeight]
	 */
	drawRect(topLeft, dimentions, color = "red", strokeWeight = 2) {
		this.ctx.save();
		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = strokeWeight;
		this.ctx.strokeRect(topLeft.x, topLeft.y, dimentions.x, dimentions.y);
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
		for(let i = 0; i < this.mapSize.x; i += this.tileSize.x) {
			this.ctx.save();

			this.ctx.beginPath();
			this.ctx.globalAlpha = alpha;
			this.ctx.moveTo(i, 0);
			this.ctx.lineTo(i, this.mapSize.y);
			this.ctx.stroke();

			this.ctx.restore();
		}
		for(let j = 0; j < this.mapSize.y; j += this.tileSize.y) {
			this.ctx.save();

			this.ctx.beginPath();
			this.ctx.globalAlpha = alpha;
			this.ctx.moveTo(0, j);
			this.ctx.lineTo(this.mapSize.x, j);
			this.ctx.stroke();

			this.ctx.restore();
		}

	}
	getBoundingClientRect() {
		return this.canvas.getBoundingClientRect();
	}
	/**
	 * @param {string} event
	 * @param {{ (e: any): void; (e: any): void; (this: HTMLCanvasElement, ev: any): any; }} func
	 */
	addEventListener(event, func) {
		this.canvas.addEventListener(event, func);
	}
}

export default CanvasWrapper;
