import Map from "./map.mjs";
import Vec2 from "./vec2.mjs";

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
    }
    get x() {
        return this.location.x;
    }
    get y() {
        return this.location.y;
    }
}
class Moveable extends Entity {
    constructor(map, location, imgSrc, speed) {
        super(map,location,imgSrc);
        this.speed = speed;
        this.moved = true; //true so it hopefully gets drawn frame it spawns
        this.lookDirection = new Vec2(1,0);
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
}

export { Entity, Moveable };