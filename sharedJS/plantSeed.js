import Projectile from "./projectile.js";
import { TYPES, CATEGORY } from "./enums.js";
//TODO: Find unneccisary imports and replace with typedefs
/** @typedef {import("./vec2").default} Vec2 */
/** @typedef {import("./player").default} Player */
/** @typedef {import("./entity").default} Entity */

export default class PlantSeed extends Projectile {
    /**
     * @param {Vec2} origin
     * @param {string} name
     * @param {string} imgSrc
     * @param {number} speed
     * @param {number} scale
     * @param {Vec2} look
     * @param {number} range
     * @param {number} damage
     * @param {import("./shapes.js").Circle} hitbox
     * @param {Player} owner
     */
    constructor(origin, name, imgSrc, speed, scale, look, range, damage, hitbox, owner) {
        super(origin, name, imgSrc, speed, scale, look, range, damage, hitbox, owner);

        this.type = TYPES.plant;
    }

    /**
     * Basic projecile just hits players
     * @param {Player|Projectile|Entity} other 
     */
    hit(other) {
        //if hitting a player deal damage
        if(other.category === CATEGORY.damageable || other.category === CATEGORY.player) {
            /** @type {Player} */(other).currHealth -= this.damage;
            //console.log(/** @type {Player} */(other).currHealth, this.damage);
            return true;
        } else if (other.type === this.type) {
            //Same type do nothing
            return false;
        } else if (other.type === TYPES.water) {
            //TODO figure out what plants do when they hit water
            return false;
        } else if (other.type === TYPES.fire) {
            //delete me
            return true;
        } else if (other.category === CATEGORY.void) {
            //Projectiles go over void
            return false;
        } else {
            //flag to be deleted
            return true;
        }
    }
}