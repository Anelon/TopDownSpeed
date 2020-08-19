import Vec2 from "./vec2.js";
import Point from "./point.js";
import { Circle } from "./shapes.js";

let idGen = 0;
class Entity {
    constructor(location, imgSrc, hitbox, speed = 0, lookDirection = new Vec2(1,0)) {
        if(!(location instanceof Vec2)) {
            throw TypeError("Entity: Location not Vec2");
        }
        this.id = idGen++;
        this.location = location.clone();
        this.oldLocation = location.clone();
        //this.image = new Image();
        this.imgSrc = imgSrc;
        this.hitbox = hitbox.clone();
        this.lookDirection = lookDirection;
        this.speed = speed;
        //mostly for debugging now
        this.overlapping = false;
    }
    updateInfo(infoJSON) {
    }
    get x() {
        return this.location.x;
    }
    get y() {
        return this.location.y;
    }
    makePoint() {
        return new Point(this.location, this, this.hitbox.halfWidth);
    }
    makeShape(scale = 1) {
        return new Circle(this.location, (this.hitbox.halfWidth) * scale);
    }
    makeObject() {
        let objectType = this.constructor.name;
        let objectJson = JSON.stringify(this);
        return {type: objectType, json: objectJson};
    }
    update(time, step, map) {
        if(this.speed > 0) {
            this.move(step, this.lookDirection, map);
        }
    }
    move(dt, direction, map) {
        if(!(direction instanceof Vec2)) {
            throw TypeError("Moveable move: Direction not Vec2");
        }
        this.oldLocation = this.location.clone();

        let dist = this.speed * dt;
        this.location.addS(direction.getUnit().multiplyScalar(dist));
        /*
        //handle this with collision detection
        if(this.location.x < 0 || this.location.x >= map.canvas.width) {
            this.location.x = oldLocation.x;
        }
        if(this.location.y < 0 || this.location.y >= map.canvas.height) {
            this.location.y = oldLocation.y;
        }
        */
    }
}

export default Entity;