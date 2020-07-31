import Vec2 from "./vec2.mjs";
import Point from "./point.mjs";

class Circle {
    constructor(center, radius) {
        console.assert(center instanceof Vec2, "Rectangle center not a Vec2");
        this.center = center;
        this.radius = radius;
    }
    contains(point) {
        if (!(point instanceof Point))
            throw TypeError("Contains point not a Point");
        //A^2 + B^2 <= C^2
        return (
            Math.pow((point.x - this.center.x), 2) + Math.pow((point.y - this.center.y), 2) <= this.radius * this.radius
        );
    }
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
    contains(point) {
        if (!(point instanceof Point))
            throw TypeError("Contains point not a Point");
        //hmm I feel like widht and height should be / 2
        return (
            point.x >= this.left &&
            point.x <= this.right &&
            point.y >= this.top &&
            point.y <= this.bottom
        );
    }
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