import Vec2 from "./vec2.js";
import { Rectangle, Circle } from "./shapes.js";
import Point from "./point.js";

class QuadTree {
    /**
     * 
     * @param {Rectangle} boundary Base size of the QuadTree
     * @param {number} [capacity=10] How many object each section can hold
     */
    constructor(boundary, capacity = 10) {
        if (!(boundary instanceof Rectangle))
            throw TypeError("QuadTree boundary not a Rectange");

        this.boundary = boundary;
        this.capacity = capacity;
        this.points = new Array();
        this.devided = false;
    }

    //for breaking up the quadtree when the capacity gets full to smaller quad trees
    subdivide() {
        let x = this.boundary.center.x;
        let y = this.boundary.center.y;
        let w = this.boundary.width / 2;
        let h = this.boundary.height / 2;

        //make all of the new quadrants of this quad 
        let ne = new Rectangle(new Vec2(x + w / 2, y - h / 2), w, h);
        this.northeast = new QuadTree(ne, this.capacity);
        let nw = new Rectangle(new Vec2(x - w / 2, y - h / 2), w, h);
        this.northwest = new QuadTree(nw, this.capacity);
        let se = new Rectangle(new Vec2(x + w / 2, y + h / 2), w, h);
        this.southeast = new QuadTree(se, this.capacity);
        let sw = new Rectangle(new Vec2(x - w / 2, y + h / 2), w, h);
        this.southwest = new QuadTree(sw, this.capacity);

        //move all the points to their new home in those subdivisions
        for (let point of this.points) {
            if (this.northeast.push(point)) continue;
            if (this.northwest.push(point)) continue;
            if (this.southeast.push(point)) continue;
            if (this.southwest.push(point)) continue;
        }
        this.points = []; //empty this.points

        this.divided = true;
    }
    /**
     * Adds a point to the QuadTree
     * @param {Point} point 
     */
    push(point) {
        //TODO make this work with other things
        if (!(point instanceof Point))
            throw TypeError("Point is not a Point");

        if (!this.boundary.contains(point)) {
            return false;
        }

        //if this quad has subdivisions push into those
        if (this.divided) {
            return (this.northeast.push(point) || this.northwest.push(point) ||
                this.southeast.push(point) || this.southwest.push(point));
        }

        //check if quad can fit another point
        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        }

        //this should probably always be true
        if (!this.divided) {
            this.subdivide();
        }

        //push to new subdivisions
        return (this.northeast.push(point) || this.northwest.push(point) ||
            this.southeast.push(point) || this.southwest.push(point));
    }

    /**
     * Query the quad tree to get if anything is in a range
     * @param {Rectangle|Circle} range Shape that you are looking for points in
     * @param {Array<Point>} [found=new Array()] Optional, creates empty array if none 
     * @returns {Array<Point>} Array of objects that overlap range.
     */
    query(range, found) {
        if (!found) {
            found = new Array();
        }

        if (!range.intersects(this.boundary)) {
            return found;
        }

        if (this.divided) {
            this.northwest.query(range, found);
            this.northeast.query(range, found);
            this.southwest.query(range, found);
            this.southeast.query(range, found);
        } else {
            for (let p of this.points) {
                if (range.contains(p)) {
                    found.push(p);
                }
            }
        }
        return found;
    }

    /**
     * For debugging
     * @param {CanvasRenderingContext2D} ctx Canvas context for printing on
     * @param {string} color Hex color string
     */
    draw(ctx, color = "#211A1E") {
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = color;
        //ctx.fillStyle = color;
        ctx.rect(this.boundary.left, this.boundary.top, this.boundary.width, this.boundary.height);
        //ctx.fill();
        ctx.stroke();
        //drawCircle(this.boundary.center.x, this.boundary.center.y, 5, "red");
        if (this.divided) {
            this.northwest.draw(ctx, "#5BC0EB");
            this.northeast.draw(ctx, "#FDE74C");
            this.southwest.draw(ctx, "#9BC53D");
            this.southeast.draw(ctx, "#C3423F");
        }
    }
}

export default QuadTree;