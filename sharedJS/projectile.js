import Vec2 from "./vec2.js";
import Entity from "./entity.js";
import { Circle } from "./shapes.js";

class Projectile extends Entity {
    /**
     * Constructs a new Projectile
     * @param {Vec2} origin Location of Projectile
     * @param {string} name 
     * @param {string} imgSrc Image sprite path
     * @param {number} speed How fast the projectile movies
     * @param {Vec2} look 
     * @param {number} range How far the projectile can go
     */
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
}

export default Projectile;
