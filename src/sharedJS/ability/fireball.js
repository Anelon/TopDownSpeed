import Vec2 from "../vec2.js";
import Projectile from "./projectile.js";
import { TYPES, CATEGORY } from "../utils/enums.js";
import Sprite from "../../clientJS/sprite.js";
/** @typedef {import("../player").default} Player */
/** @typedef {import("../entity.js").default} Entity */
/** @typedef {import("../map/tile.js").default} Tile */

export default class Fireball extends Projectile {
    static get FRAMES() {return 6;} //Number of frames of animation
    static get ANIMSPEED() {return 3;} //Number of renders before next frame
    static get SPRITEDIMS() {return new Vec2(32,32);} //Dimentions of each Sprite
    static get IMAGE() { return "fireball"; }
    /**
     * @param {Vec2} origin
     * @param {string} name
     * @param {number} speed
     * @param {Vec2} look
     * @param {number} range
     * @param {number} damage
     * @param {string} ownerID
     * @param {number} scale
     * @param {import("../shapes.js").Circle} hitbox
     */
    constructor(origin, name, speed, scale, look, range, damage, hitbox, ownerID) {
        super(origin, name, speed, scale, look, range, damage, hitbox, ownerID, Fireball.IMAGE);

        this.type = TYPES.fire;
    }

    makeSprite() {
        return new Sprite(this, Fireball.FRAMES, Fireball.ANIMSPEED, this.scale, Fireball.SPRITEDIMS);
    }

    /**
     * Basic projecile just hits players
     * @param {Player|Projectile|Entity|Tile} other 
     */
    hit(other) {
        if (/** @type {Player} */(other).id === this.ownerID) {
            return false;
        }
        let remove = false;
        if (other.type === this.type) {
            //Same type do nothing
        } else if (other.type === TYPES.plant) {
            //if projectile add their damage to this
            if (other.category === CATEGORY.projectile)
                this.damage += /** @type {Projectile} */(other).damage;

            //check if hitting a damagable
            if (other.category === CATEGORY.damageable || other.category === CATEGORY.player || other.category === CATEGORY.dragon) {
                /** @type {Player} */(other).hurt(this.damage, this.id);
                remove = true;
            }
            return remove;
        } else if (other.type === TYPES.water) {
            //delete me
            remove = true;
        }

        return remove || super.hit(other);
    }
}