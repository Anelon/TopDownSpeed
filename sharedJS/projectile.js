import Entity from "./entity.js";
import { Circle } from "./shapes.js";

class Projectile extends Entity {
    constructor(origin, name, imgSrc, speed, look, range) {
        //temporary hitbox, need to find better place for this at somepoint (probably when we make specific abilities)
        let hitbox = new Circle(origin, 8);
        super(origin, imgSrc, hitbox, speed, look);
        //save the origin to do distance calculations?
        this.origin = origin.clone();
        this.name = name;
        this.distance = 0;
        //how far the projectile can go
        this.range = range;
    }
    //placeholder for the colision to call when hit
    //might want to return a bool saying if this should be deleted from the hit
    hit(other) {
    }
    //should be called when projectile hits max range
    think(world) {

    }
}

export default Projectile;