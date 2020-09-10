import Projectile from "./projectile.js";
import { TYPES, CATEGORY } from "./enums.js";
import Player from "./player.js";
import Entity from "./entity.js";

export default class Waterball extends Projectile {
    /**
     * @param {import("./vec2").default} origin
     * @param {string} name
     * @param {string} imgSrc
     * @param {number} speed
     * @param {import("./vec2").default} look
     * @param {number} range
     * @param {number} damage
     * @param {import("./player").default} owner
     */
    constructor(origin, name, imgSrc, speed, look, range, damage, owner) {
        super(origin, name, imgSrc, speed, look, range, damage, owner);

        this.type = TYPES.water;
    }

    /**
     * Basic projecile just hits players
     * @param {Player|Projectile|Entity} other 
     */
    hit(other) {
        //if hitting a player deal damage
        if(other.category === CATEGORY.damageable) {
            /** @type {Player} */(other).currHealth -= this.damage;
            //console.log(/** @type {Player} */(other).currHealth, this.damage);
            return true;
        } else if (other.type === this.type) {
            //Same type do nothing
            return false;
        } else if (other.type === TYPES.fire) {
            return false;
        } else if (other.category === CATEGORY.void) {
            //Projectiles go over void
            return false;
        } else {
            //flag to be deleted
            return true;
        }
    }
}