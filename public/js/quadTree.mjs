import { Rectangle } from "./shapes.mjs";

class QuadTree {
    constructor(boundary, capacity = 10) {
        if (!(boundary instanceof Rectangle))
            throw TypeError("QuadTree boundary not a Rectange");

        this.boundary = boundary;
        this.capacity = capacity;
        this.particles = [];
        this.devided = false;
    }

    //function to create a new quadTree
    static create() {
        const DEFAULT_CAPACITY = 8;
        if (arguments.length === 0) {
            if (typeof width === "undefined") {
                throw new TypeError("No global width defined");
            }
            if (typeof height === "undefined") {
                throw new TypeError("No global height defined");
            }
            let bounds = new Rectangle(width / 2, height / 2, width, height);
            return new QuadTree(bounds, DEFAULT_CAPACITY);
        }
        if (arguments[0] instanceof Rectangle) {
            let capacity = arguments[1] || DEFAULT_CAPACITY;
            return new QuadTree(arguments[0], capacity);
        }
        if (typeof arguments[0] === "number" &&
            typeof arguments[1] === "number" &&
            typeof arguments[2] === "number" &&
            typeof arguments[3] === "number") {
            let capacity = arguments[4] || DEFAULT_CAPACITY;
            return new QuadTree(new Rectangle(arguments[0], arguments[1], arguments[2], arguments[3]), capacity);
        }
        throw new TypeError('Invalid parameters');
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

        //move all the particles to their new home in those subdivisions
        for (let particle of this.particles) {
            if (this.northeast.push(particle)) continue;
            if (this.northwest.push(particle)) continue;
            if (this.southeast.push(particle)) continue;
            if (this.southwest.push(particle)) continue;
        }
        this.particles = []; //empty this.particles

        this.divided = true;
    }
    //add a point to the quad tree 
    push(point) {
        //TODO make this work with other things
        if (!(point instanceof Particle))
            throw TypeError("Point is not a Particle");

        if (!this.boundary.contains(point)) {
            return false;
        }

        //if this quad has subdivisions push into those
        if (this.divided) {
            return (this.northeast.push(point) || this.northwest.push(point) ||
                this.southeast.push(point) || this.southwest.push(point));
        }

        //check if quad can fit another particle
        if (this.particles.length < this.capacity) {
            this.particles.push(point);
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

    //query the quad tree to get if anything is in a range
    query(range, found) {
        if (!found) {
            found = [];
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
            for (let p of this.particles) {
                if (range.contains(p)) {
                    found.push(p);
                }
            }
        }
        return found;
    }

    //for debugging
    draw(ctx, color = "#211A1E") {
        ctx.beginPath();
        ctx.lineWidth = "4";
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.rect(this.boundary.left, this.boundary.top, this.boundary.width, this.boundary.height);
        ctx.fill();
        ctx.stroke();
        //drawCircle(this.boundary.center.x, this.boundary.center.y, 5, "red");
        if (this.divided) {
            this.northwest.draw("#5BC0EB");
            this.northeast.draw("#FDE74C");
            this.southwest.draw("#9BC53D");
            this.southeast.draw("#C3423F");
        }
    }
}

export default QuadTree;