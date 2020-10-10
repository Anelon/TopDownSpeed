class Vec2 {
    /**
     * Constructs a 2d vector
     * @constructor
     * @param {number} [x=0] horizontal value
     * @param {number} [y=0] vertical value
     */
    constructor(x=0,y=0) {
        this.x = x;
        this.y = y;
    }
    /**
     * @returns {Array} x, y
     */
    getXY() {
        return [this.x, this.y];
    }
    /**
     * Creates a new Vec2 with same elements as this
     * @returns {Vec2}
     */
    clone() {
        return new Vec2(this.x, this.y);
    }
    /**
     * Creates a String from easy logging
     * @returns {string}
     */
    log() {
        return "{" + this.x + "," + this.y + "}";
    }
    /**
     * Check if value of this is equal to other
     * @param {Vec2} other 
     * @returns {boolean}
     */
    equals(other) {
        return (this.x === other.x && this.y === other.y);
    }
    //const methods
    /**
     * Gets the length of the Vec2
     * @returns {number}
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    /**
     * Gets the length squared of the Vec2
     * @returns {number}
     */
    lengthSq() {
        return this.x * this.x + this.y * this.y;
    }
    //makes new Vec2 and does operation
    /**
     * Makes new Vec2 with this?s x and y added to other?s x and y
     * @param {Vec2} other 
     * @returns {Vec2}
     */
    add(other) {
        return new Vec2(this.x + other.x, this.y + other.y);
    }
    /**
     * Makes new Vec2 with this?s x and y subtracted by other?s x and y
     * @param {Vec2} other 
     * @returns {Vec2}
     */
    sub(other) {
        return new Vec2(this.x - other.x, this.y - other.y);
    }
    /**
     * Makes new Vec2 with this?s x and y multiplied by scalar
     * @param {number} scalar 
     * @returns {Vec2}
     */
    multiplyScalar(scalar) {
        return new Vec2(this.x * scalar, this.y * scalar);
    }
    /**
     * Makes new Vec2 with this's x and y multiplied by other's x and y
     * @param {Vec2} other 
     * @returns {Vec2}
     */
    multiplyVec(other) {
        return new Vec2(this.x * other.x, this.y * other.y);
    }
    //does operation on this
    /**
     * Adds other?s x and y to this?s x and y
     * @param {Vec2} other 
     * @returns {Vec2} reference to this
     */
    addS(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }
    /**
     * Subtracts other?s x and y to this?s x and y
     * @param {Vec2} other 
     * @returns {Vec2} reference to this
     */
    subS(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }
    /**
     * Multiplies this?s x and y by scalar
     * @param {number} scalar 
     * @returns {Vec2} reference to this
     */
    multiplyScalarS(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    /**
     * Converts this to a unit length Vec2
     * @returns {Vec2} reference to this
     */
    /**
     * Multiplies this's x and y multiplied by other's x and y
     * @param {Vec2} other 
     * @returns {Vec2}
     */
    multiplyVecS(other) {
        this.x *= other.x;
        this.y *= other.y;
        return this;
    }
    makeUnit() {
        let len = this.length();
        this.x /= len;
        this.y /= len;
        return this;
    }
    /**
     * Makes a new Vec2 that is a unit length vector of this
     * @returns {Vec2}
     */
    getUnit() {
        let len = this.length();
        return new Vec2(this.x /= len, this.y /= len);
    }
    /**
     * Does the dot product of this and other
     * @param {Vec2} other 
     * @returns {number}
     */
    dot(other) {
        return this.x * other.x + this.y * other.y;
    }
    /**
     * Calls Math.floor on both x and y
     */
    floorS() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    }
    /**
     * Makes new Vec2 with the the floor of x and y
     */
    floor() {
        return new Vec2(Math.floor(this.x), Math.floor(this.y));
    }
    /**
     * Makes new Vec2 with inverted x and y
     */
    invert() {
        return new Vec2(1/this.x, 1/this.y);
    }
    /**
     * Gives Abs of x and y
     */
    absS() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        return this;
    }
    /**
     * Gives Abs of x and y
     */
    abs() {
        return new Vec2(Math.abs(this.x), Math.abs(this.y));
    }
}

export default Vec2;