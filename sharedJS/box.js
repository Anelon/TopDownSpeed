import Vec2 from "./vec2.js";
import { Rectangle } from "./shapes.js";
/** @typedef {import("./entity.js").default} Entity */
/** @typedef {import("./map/region.js").default} Region */
/** @typedef {import("./map/tile.js").default} Tile */

export default class Box extends Rectangle {
	/**
	 * Point is a circle with an owner.
     * @constructor
	 * @param {Vec2} center center of the center of the point
	 * @param {Vec2} dimentions center of the center of the point
	 * @param {Entity|Region|Tile} [owner] Who owns this point
	 * @param {string} [color="#aaaaaa"] Hex color string for drawing to canvas when debugging
	 */
	constructor(center, dimentions, owner = null, color = "red") {
		super(center, dimentions.x, dimentions.y);

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
	 */
	draw(canvas, color) {
		super.draw(canvas, color);
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