import { Moveable } from "./entity.mjs";

class Projectile extends Moveable {
    constructor(origin, name, imgSrc, speed, look, range) {
        super(origin, imgSrc, speed, look);
        //save the origin to do distance calculations?
        this.origin = origin;
        this.name = name;
        this.distance = 0;
        //how far the projectile can go
        this.range = range;
    }
    //placeholder for the colision to call when hit
    hit(other) {
    }
    //should be called when projectile hits max range
    think() {
    }
}

export default Projectile;