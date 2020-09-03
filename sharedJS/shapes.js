import Vec2 from "./vec2.js";
import Point from "./point.js";

class Circle {
    /**
     * Makes a new Circle
     * @constructor
     * @param {Vec2} center Location of the center of the cirlce
     * @param {number} radius Radius of the circle
     */
    constructor(center, radius) {
		if(!(center instanceof Vec2))
			throw TypeError("Circle center needs to be Vec2");
        this.center = center;
        this.radius = radius;
    }
    clone() {
        return new Circle(this.center, this.radius);
    }
    get width() {
        return this.radius * 2;
    }
    get halfWidth() {
        return this.radius;
    }

    /**
     * Check if value of this is equal to other
     * @param {Circle} other 
     * @returns {boolean}
     */
    equals(other) {
        if(!(other instanceof Circle)) return false;
        return (this.center.equals(other.center) && this.radius === other.radius);
    }
    contains(point) {
        if (!(point instanceof Point))
            throw TypeError("Contains point not a Point");
        //A^2 + B^2 <= C^2
        return (
            Math.pow((point.x - this.center.x), 2) + Math.pow((point.y - this.center.y), 2) <= this.radius * this.radius
        );
    }

    /**
     * Check if circle or rectangle overlaps with this
     * @param {Circle|Rectangle} range 
     * @returns {boolean}
     */
    intersects(range) {
        if (range instanceof Circle) {
            //A^2 + B^2 <= C^2
            return (
                Math.pow((range.center.x - this.center.x), 2) + Math.pow((range.center.y - this.center.y), 2) <= (range.radius + this.radius) * (range.radius + this.radius)
            );
        }
        let xDist = Math.abs(range.center.x - this.center.x);
        let yDist = Math.abs(range.center.y - this.center.y);


        let r = this.radius;
        let w = range.width;
        let h = range.height;

        if (xDist > (r + w) || yDist > (r + h)) return false;
        if (xDist <= w || yDist <= h) return true;

        let edges = Math.pow((xDist - w), 2) + Math.pow((yDist - h), 2);

        return edges <= this.radius * this.radius;
    }
}

class Rectangle {
    constructor(center, width, height) {
        console.assert(center instanceof Vec2, "Rectangle center not a Vec2");
        this.center = center;
        this.width = width;
        this.height = height;
    }
    clone() {
        return new Rectangle(this.center, this.width, this.height);
    }
    get left() {
        return this.center.x - (this.width / 2);
    }
    get right() {
        return this.center.x + (this.width / 2);
    }
    get top() {
        return this.center.y - (this.height / 2);
    }
    get bottom() {
        return this.center.y + (this.height / 2);
    }
    get halfWidth() {
        return this.width / 2;
    }

    /**
     * Check if value of this is equal to other
     * @param {Rectangle} other 
     * @returns {boolean}
     */
    equals(other) {
        if(!(other instanceof Rectangle)) return false;
        return (this.center.equals(other.center) && this.width === other.width && this.height === other .height);
    }

    /**
     * Check if rectangle contains a point
     * @param {Point} point The point to be checked
     * @returns {boolean}
     */
    contains(point) {
        if (!(point instanceof Point))
            throw TypeError("Contains point not a Point");
        return (
            point.x >= this.left &&
            point.x <= this.right &&
            point.y >= this.top &&
            point.y <= this.bottom
        );
    }

    /**
     * Check if circle or rectangle overlaps with this
     * @param {Circle|Rectangle} range 
     * @returns {boolean}
     */
    intersects(range) {
        if (range instanceof Circle) {
            //if its a circle flip the order
            return range.intersects(this);
        }
        return !(
            range.left > this.right ||
            range.right < this.left ||
            range.top > this.bottom ||
            range.bottom < this.top
        );
    }
}

export { Circle, Rectangle };
