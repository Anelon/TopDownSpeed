import Vec2 from "./vec2.js";
import Entity from "./entity.js";

//Might have this extend Circle
class Point {
	/**
	 * Point is a circle with an owner.
     * @constructor
	 * @param {Vec2} location Location of the center of the point
	 * @param {Entity} owner Who owns this point
	 * @param {number} [radius=2] Radius of the cirlce
	 * @param {string} [color="#aaaaaa"] Hex color string for drawing to canvas when debugging
	 */
	constructor(location, owner = null, radius = 2, color = "#aaaaaa") {
		if(!(location instanceof Vec2))
			throw TypeError("Particle Location needs to be Vec2");

        this.location = location;
        //this is what this point is attached to
        this.owner = owner;
		this.radius = radius;
		//for debugging
		this.color = color;
	}

    /**
     * Check if value of this is equal to other
     * @param {Point} other 
     * @returns {boolean}
     */
	equals(other) {
		if(!(other instanceof Point)) return false;
		return (this.location.equals(other.location) && this.owner.equals(other.owner) && this.radius === other.radius);
	}

	//leaving in for debugging
	/**
	 * Draws the Point onto the canvas
	 * @param {Canvas.context} ctx HTML canvas object's context
	 * @param {string} color Hex color string
	 */
	draw(ctx, color) {
		ctx.beginPath();
		ctx.arc(this.location.x, this.location.y, this.radius, 0, 2 * Math.PI);
		ctx.fillStyle = color || this.color;
		ctx.fill();
	}

	/**
	 * @returns {Vec2} Copy of point's location
	 */
	getLocation() {
		return this.location.clone();
	}

	/**
	 * @returns the y location of the point
	 */
	get y() {
		return this.location.y;
	}
	/**
	 * @returns the x location of the point
	 */
	get x() {
		return this.location.x;
	}
}

export default Point;
