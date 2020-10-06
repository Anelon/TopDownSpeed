import Vec2 from "./vec2.js";
import { Circle } from "./shapes.js";
/** @typedef {import("./entity.js").default} Entity */
/** @typedef {import("./dragon.js").default} Dragon */
/** @typedef {import("./map/region.js").default} Region */
/** @typedef {import("./map/tile.js").default} Tile */

//Might have this extend Circle
class Point extends Circle {
	/**
	 * Point is a circle with an owner.
     * @constructor
	 * @param {Vec2} center center of the center of the point
	 * @param {number} [radius=2] Radius of the cirlce
	 * @param {Entity|Dragon|Region|Tile} [owner] Who owns this point
	 * @param {string} [color="#aaaaaa"] Hex color string for drawing to canvas when debugging
	 */
	constructor(center, radius = 2, owner = null, color = "#aaaaaa") {
		super(center, radius);

        //this is what this point is attached to
        this.owner = owner;
		//for debugging
		this.color = color;
	}

	/**
	 * Pass the hit to the owner
	 * @param {Entity} other
	 */
	hit(other) {
		this.owner.hit(other);
	}

	//leaving in for debugging
	/**
	 * Draws the Point onto the canvas
	 * @param {string} color Hex color string
	 * @param {{ beginPath: () => void; arc: (arg0: number, arg1: number, arg2: number, arg3: number, arg4: number) => void; fillStyle: string; fill: () => void; }} ctx
	 */
	draw(ctx, color) {
		ctx.beginPath();
		ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
		ctx.fillStyle = color || this.color;
		ctx.fill();
	}

	/**
	 * @returns {Vec2} Copy of point's center
	 */
	getCenter() {
		return this.center.clone();
	}

	/**
	 * @returns the y center of the point
	 */
	get y() {
		return this.center.y;
	}
	/**
	 * @returns the x center of the point
	 */
	get x() {
		return this.center.x;
	}
}

export default Point;
