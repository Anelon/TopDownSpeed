import Vec2 from "./vec2.js";
import Entity from "./entity.js";
import { Circle } from "./shapes.js";
//import Ability from "../../sharedJS/ability.js";

//class for holding the other players and as a parent to PlayerController
class Player extends Entity {
    /**
     * @param {Vec2} location 
     * @param {string} name 
     * @param {string} imgSrc Client Path to image
     * @param {number} speed 
     * @param {number} health 
     */
    constructor(location, name, imgSrc, speed, health) {
        let hitbox = new Circle(location, 8);
        super(location, imgSrc, hitbox, speed);
        this.name = name;
        this.maxHealth = health;
        this.currHealth = health;
    }
    update(now, dt) {
        //TODO figure out how to move other players (probably just set their x and y)
    }
    /**
     * Updates where the player is based on the json data given
     * @param {JSON} json 
     * @returns reference to this
     */
    updateInfo(json) {
        if (json.health)
            this.health = json.health;
        //call entity's updateFromJSON
        super.updateInfo(json);
        return this;
    }
}

export default Player;
