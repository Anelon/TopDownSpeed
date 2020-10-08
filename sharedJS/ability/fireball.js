import Projectile from "./projectile.js";
import { TYPES, CATEGORY } from "../utils/enums.js";
import Player from "../player.js";
import Sprite from "../../clientJS/sprite.js";
import Vec2 from "../vec2.js";
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
     * @param {import("../player").default} owner
     * @param {number} scale
     * @param {import("../shapes.js").Circle} hitbox
     */
    constructor(origin, name, speed, scale, look, range, damage, hitbox, owner) {
        super(origin, name, speed, scale, look, range, damage, hitbox, owner, Fireball.IMAGE);

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
        //if hitting a player deal damage
        if(other.category === CATEGORY.damageable || other.category === CATEGORY.player) {
            /** @type {Player} */(other).hurt(this.damage);
            return true;
        } else if (other.type === this.type) {
            //Same type do nothing
            return false;
        } else if (other.type === TYPES.plant) {
            //double the damage
            this.damage *= 2;
            //TODO make a damage cap
            return false;
        } else {
            //fall back on projectile defaults
            return super.hit(other);
        }
    }
}