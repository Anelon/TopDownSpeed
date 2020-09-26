import Vec2 from "./vec2.js";
import Entity from "./entity.js";
import { Circle } from "./shapes.js";
import { TYPES, CATEGORY } from "./utils/enums.js";
import Projectile from "./ability/projectile.js";
//import Ability from "../../sharedJS/ability.js";

//class for holding the other players and as a parent to PlayerController
class Player extends Entity {
    static get WIDTH() {return 32;}
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
        this.spawnLocation = location;

        this.objectives = new Array();
        
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
        return this;
    }

    kill() {
        //clear the objectives
        this.objectives = new Array();
        //move back to spawn
        this.location = this.spawnLocation;
        //reset health
        this.currHealth = this.maxHealth;
    }

    /**
     * 
     * @param {Player|Projectile|Entity} other 
     */
    hit(other) {
        if(other.category === CATEGORY.projectile)
            if(this.currHealth - other.damage <= 0) {
                console.log(other.damage, this.currHealth);
                return true;
            }
        return false;
    }
    setSpawn(spawnLocation) {
        this.spawnLocation = spawnLocation;
    }
}

export default Player;
