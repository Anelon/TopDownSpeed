import Vec2 from "../vec2.js";
import Entity from "../entity.js";
import { Circle } from "../shapes.js";
import { TYPES, CATEGORY } from "../utils/enums.js";
import Player from "../player.js";
import Drawable from "../../clientJS/drawable.js";
/** @typedef {import("../map/tile.js").default} Tile */

//TODO add owner to projectile so you can't hit yourself
export default class Projectile extends Entity {
    static get IMAGE() { return "arrow"; }
    /**
     * Constructs a new Projectile
     * @param {Vec2} origin Location of Projectile
     * @param {string} name
     * @param {number} speed How fast the projectile movies
     * @param {number} scale
     * @param {Vec2} look
     * @param {number} range How far the projectile can go
     * @param {number} damage How much damage the projectile does
     * @param {Circle} hitbox
     * @param {Player} owner Who spaned the projectile
     * @param {string} [imgSrc] Image sprite path
     */
    constructor(origin, name, speed, scale, look, range, damage, hitbox, owner, imgSrc) {
        console.assert(hitbox instanceof Circle, "Hitbox not cirlce?");
        //temporary hitbox, need to find better place for this at somepoint (probably when we make specific abilities)
        hitbox = hitbox || new Circle(origin, 8);
        imgSrc = imgSrc || Projectile.IMAGE;
        super(origin, imgSrc, hitbox, speed, scale, look);
        //save the origin to do distance calculations?
        this.origin = origin.clone();
        this.name = name;
        this.distance = 0;
        //how far the projectile can go
        this.range = range;
        this.damage = damage;
        this.owner = owner;
        
        this.type = TYPES.basic;
        this.category = CATEGORY.projectile;
    }
    /**
     * Makes a Projectile based on json sent to it
     * @param {Projectile} json 
     */
    static makeFromJSON(json) {
        const {
            location, name, imgSrc, speed, scale, lookDirection, range, hitbox, damage, owner, type, category
        } = json;
        //construct projectile
        const loc = new Vec2(location.x, location.y);
        return new Projectile(
            loc, name, speed, scale, new Vec2(lookDirection.x, lookDirection.y), range, damage, new Circle(loc, hitbox.radius), owner, imgSrc
        );
    }
    /**
     * Basic projecile just hits players
     * @param {Player|Projectile|Entity|Tile} other 
     */
    hit(other) {
        let remove = false;
        if (other.type === this.type) {
            //Same type do nothing
        } else {
            if (other.category !== CATEGORY.tile)
                remove = true;
        }

        //if hitting a player deal damage
        if (other.category === CATEGORY.damageable || other.category === CATEGORY.player || other.category === CATEGORY.dragon) {
            /** @type {Player} */(other).hurt(this.damage, this.id);
            remove = true;
        } else if (other.category === CATEGORY.tile) {
            //Projectiles go over passable tiles
            if(!/** @type {Tile} */(other).passable) remove = true;
        }

        return remove;
    }

    makeSprite() {
        return new Drawable(this, this.scale);
    }
}
