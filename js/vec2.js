class Vec2 {
    constructor(x=0,y=0) {
        this.x = x;
        this.y = y;
    }
    clone() {
        return new Vec2(this.x, this.y);
    }
    //const methods
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    lengthSq() {
        return this.x * this.x + this.y * this.y;
    }
    //makes new Vec2 and does operation
    add(other) {
        return new Vec2(this.x + other.x, this.y + other.y);
    }
    sub(other) {
        return new Vec2(this.x - other.x, this.y - other.y);
    }
    multiplyScalar(scalar) {
        return new Vec2(this.x * scalar, this.y * scalar);
    }
    //does operation on this
    addS(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }
    subS(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }
    multiplyScalarS(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    //convert vector to unit
    makeUnit() {
        let len = this.length();
        this.x /= len;
        this.y /= len;
        return this;
    }
    getUnit() {
        let len = this.length();
        return new Vec2(this.x /= len, this.y /= len);
    }
    dot(other) {
        return this.x * other.x + this.y * other.y;
    }
}
