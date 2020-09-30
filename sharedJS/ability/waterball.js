import Projectile from "./projectile.js";
import { TYPES, CATEGORY } from "../utils/enums.js";
import Player from "../player.js";
import Sprite from "../../clientJS/sprite.js";
import Vec2 from "../vec2.js";
/** @typedef {import("../entity.js").default} Entity */
/** @typedef {import("../map/tile.js").default} Tile */

export default class Waterball extends Projectile {
    static get FRAMES() {return 9;} //Number of frames of animation
    static get ANIMSPEED() {return 3;} //Number of renders before next frame
    static get SPRITEDIMS() {return new Vec2(64,64);} //Dimentions of each Sprite
    static get IMAGE() { return "./img/abilities/waterball/waterball64.png"; }
    /**
     * @param {import("../vec2").default} origin
     * @param {string} name
     * @param {number} speed
     * @param {number} scale
     * @param {import("../vec2").default} look
     * @param {number} range
     * @param {number} damage
     * @param {import("../shapes.js").Circle} hitbox
     * @param {import("../player").default} owner
     */
    constructor(origin, name, speed, scale, look, range, damage, hitbox, owner) {
        super(origin, name, speed, scale, look, range, damage, hitbox, owner, Waterball.IMAGE);

        this.type = TYPES.water;
    }

    makeSprite() {
        return new Sprite(this, Waterball.FRAMES, Waterball.ANIMSPEED, this.scale, Waterball.SPRITEDIMS);
    }

    /**
     * Basic projecile just hits players
     * @param {Player|Projectile|Entity|Tile} other 
     */
    hit(other) {
        //if hitting a player deal damage
        if(other.category === CATEGORY.damageable || other.category === CATEGORY.player) {
            /** @type {Player} */(other).currHealth -= this.damage;
            return true;
        } else if (other.type === this.type) {
            //Same type do nothing
            return false;
        } else if (other.type === TYPES.fire) {
            return false;
        } else {
            //flag to be deleted
            return super.hit(other);
        }
    }
}