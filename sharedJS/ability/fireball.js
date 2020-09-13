import Projectile from "./projectile.js";
import { TYPES, CATEGORY } from "../utils/enums.js";
import Player from "../player.js";
import Entity from "../entity.js";
import Sprite from "../../clientJS/sprite.js";
import Vec2 from "../vec2.js";

export default class Fireball extends Projectile {
    static get FRAMES() {return 6;} //Number of frames of animation
    static get ANIMSPEED() {return 3;} //Number of renders before next frame
    static get SPRITEDIMS() {return new Vec2(32,32);} //Dimentions of each Sprite
    static get IMAGE() { return "./img/abilities/fireball/fireball.png"; }
    /**
     * @param {import("../vec2").default} origin
     * @param {string} name
     * @param {number} speed
     * @param {import("../vec2").default} look
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
        } else if (other.type === TYPES.plant) {
            //double the damage
            this.damage *= 2;
            //TODO make a damage cap
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