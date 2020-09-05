import Vec2 from "./vec2.js";
import Entity from "./entity.js";
import { Circle } from "./shapes.js";
import { TYPES, CATEGORY } from "./enums.js";
import Player from "./player.js";

class Projectile extends Entity {
    /**
     * Constructs a new Projectile
     * @param {Vec2} origin Location of Projectile
     * @param {string} name 
     * @param {string} imgSrc Image sprite path
     * @param {number} speed How fast the projectile movies
     * @param {Vec2} look 
     * @param {number} range How far the projectile can go
     * @param {number} damage How much damage the projectile does
     */
    constructor(origin, name, imgSrc, speed, look, range, damage=0) {
        //temporary hitbox, need to find better place for this at somepoint (probably when we make specific abilities)
        let hitbox = new Circle(origin, 8);
        super(origin, imgSrc, hitbox, speed, look);
        //save the origin to do distance calculations?
        this.origin = origin.clone();
        this.name = name;
        this.distance = 0;
        //how far the projectile can go
        this.range = range;
        this.damage = damage;
        
        this.type = TYPES.basic;
    }
    /**
     * Makes a Projectile based on json sent to it
     * @param {Projectile} json 
     */
    static makeFromJSON(json) {
        const {
            location, name, imgSrc, speed, lookDirection, range, hitbox, damage
        } = json;
        //console.log("look", lookDirection);
        //construct projectile
        return new Projectile(
            new Vec2(location.x, location.y), name, imgSrc, speed, new Vec2(lookDirection.x, lookDirection.y), range, damage
        );
    }
    /**
     * Basic projecile just hits players
     * @param {Player|Projectile|Entity} other 
     */
    hit(other) {
        if(other.type === TYPES.player) {
            /** @type {Player} */(other).currHealth -= this.damage;
            console.log(/** @type {Player} */(other).currHealth, this.damage);
            return true;
        } else if (other.type === this.type) {
            //do nothing
            return false;
        } else {
            //flag to be deleted
            return true;
        }
    }
}

export default Projectile;
