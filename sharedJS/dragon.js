import Vec2 from "./vec2.js";
import Entity from "./entity.js";
import { Circle } from "./shapes.js";
import { TYPES, CATEGORY } from "./utils/enums.js";
import Projectile from "./ability/projectile.js";
/** @typedef {import("./map/region.js").default} Region */
//import Ability from "../../sharedJS/ability.js";

//class for holding the other players and as a parent to PlayerController
export default class Dragon extends Entity {
    static get WIDTH() {return 16;}
    static spritePath = "/img/dragon/";
    static animations = ["attack1", "attack2", "death", "hurt", "idle", "idleBattle", "walking"];
    /**
     * @param {Vec2} location 
     * @param {string} name 
     * @param {string} imgSrc Client Path to image
     * @param {number} speed 
     * @param {number} health 
     * @param {Circle} hitbox
     * @param {number} scale 
     * @param {Region} guardedRegion 
     */
    constructor(location, name, imgSrc, speed, health, hitbox, scale, guardedRegion) {
        let newHitbox = hitbox;
        super(location, imgSrc, newHitbox, speed, scale);
        this.name = name;
        this.maxHealth = health;
        this.currHealth = health;
        this.animations = new Array();

        this.type = TYPES.basic;
        this.category = CATEGORY.player;
        this.guardedRegion = guardedRegion;
        //lock the region
        this.guardedRegion.locked = true;
    }
    /**
     * Updates where the player is based on the json data given
     * @param {Dragon} json 
     * @returns reference to this
     */
    updateInfo(json) {
        if (json.currHealth)
            this.currHealth = json.currHealth;
        if (json.maxHealth)
            this.maxHealth = json.maxHealth;
        //call entity's updateFromJSON
        super.updateInfo(json);
        return this;
    }

    kill() {
        this.guardedRegion.locked = false;
    }

    /**
     * 
     * @param {Dragon|Projectile|Entity} other 
     */
    hit(other) {
        if(other.category === CATEGORY.projectile)
            if(this.currHealth - other.damage <= 0) {
                return true;
            }
        return false;
    }
}
