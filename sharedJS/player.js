import Vec2 from "./vec2.js";
import Entity from "./entity.js";
import { Circle } from "./shapes.js";
import { TYPES, CATEGORY } from "./utils/enums.js";
import Projectile from "./ability/projectile.js";
//import Ability from "../../sharedJS/ability.js";

//class for holding the other players and as a parent to PlayerController
export default class Player extends Entity {
    static get WIDTH() {return 16;}
    /**
     * @param {Vec2} location 
     * @param {string} name 
     * @param {string} imgSrc Client Path to image
     * @param {number} speed 
     * @param {number} health 
     * @param {Circle} hitbox
     * @param {number} scale 
     */
    constructor(location, name, imgSrc, speed, health, hitbox, scale) {
        let newHitbox = hitbox;
        super(location, imgSrc, newHitbox, speed, scale);
        this.name = name;
        this.maxHealth = health;
        this.currHealth = health;
        this.spawnLocation = location.clone();

        this.objectives = new Set();
        
        this.type = TYPES.basic;
        this.category = CATEGORY.player;
    }
    /**
     * Updates where the player is based on the json data given
     * @param {Player} json 
     * @returns reference to this
     */
    updateInfo(json) {
        if (json.currHealth)
            this.currHealth = json.currHealth;
        if (json.maxHealth)
            this.maxHealth = json.maxHealth;
        //call entity's updateFromJSON
        super.updateInfo(json);
        if(json.spawnLocation) {
            this.spawnLocation = new Vec2(json.spawnLocation.x, json.spawnLocation.y);
        }
        return this;
    }

    kill() {
        //clear the objectives
        this.objectives.clear();
        //move back to spawn
        this.location = this.spawnLocation.clone();
        //reset health
        this.currHealth = this.maxHealth;
    }

    /**
     * 
     * @param {Player|Projectile|Entity} other 
     */
    hit(other) {
        if (other.category === CATEGORY.projectile) {
            return true;
        }
        return false;
    }
    setSpawn(spawnLocation) {
        this.spawnLocation = spawnLocation.clone();
    }
}
