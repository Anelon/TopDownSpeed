import Vec2 from "./vec2.mjs";
import Point from "./point.mjs";
import { Circle } from "./shapes.mjs";

let idGen = 0;
class Entity {
    constructor(map, location, imgSrc) {
        if(!(location instanceof Vec2)) {
            throw TypeError("Entity: Location not Vec2");
        }
        this.id = idGen++;
        this.location = location;
        this.image = new Image();
        this.image.src = imgSrc;
        this.map = map;
        //mostly for debugging now
        this.overlapping = false;
    }
    get x() {
        return this.location.x;
    }
    get y() {
        return this.location.y;
    }
    makePoint() {
        return new Point(this.location, this, this.image.width/2);
    }
    makeShape(scale = 1) {
        return new Circle(this.location, (this.image.width/2) * scale);
    }
}
class Moveable extends Entity {
    constructor(map, location, imgSrc, speed, lookDirection) {
        super(map,location,imgSrc);
        this.speed = speed;
        this.moved = true; //true so it hopefully gets drawn frame it spawns
        //if lookDirection isn't set default to looking left
        this.lookDirection = lookDirection || new Vec2(1,0);
    }
    update(dt) {
        this.move(dt, this.lookDirection);
    }
    move(dt, direction) {
        if(!(direction instanceof Vec2)) {
            throw TypeError("Moveable move: Direction not Vec2");
        }
        let oldLocation = this.location.clone();

        let dist = this.speed * dt;
        this.location.addS(direction.getUnit().multiplyScalar(dist));
        if(this.location.x < 0 || this.location.x >= this.map.canvas.width) {
            this.location.x = oldLocation.x;
        }
        if(this.location.y < 0 || this.location.y >= this.map.canvas.height) {
            this.location.y = oldLocation.y;
        }
    }
    draw() {
        //this.map.drawImageLookat(this.image, this.location, this.lookDirection);
        this.map.drawImageLookat(this.image, this.location, this.lookDirection, this.overlapping);
    }
}

export { Entity, Moveable };