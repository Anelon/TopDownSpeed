import Vec2 from "./vec2.js";
import Entity from "./entity.js";
import { Circle } from "./shapes.js";
import CanvasWrapper from "../clientJS/canvasWrapper.js";
//import Ability from "../../sharedJS/ability.js";

//class for holding the other players and as a parent to PlayerController
class Player extends Entity {
    /**
     * @param {Vec2} location 
     * @param {string} name 
     * @param {string} imgSrc Client Path to image
     * @param {number} speed 
     * @param {number} health 
     * @param {Circle} [hitbox=new Circle(location, 16)]
     */
    constructor(location, name, imgSrc, speed, health, hitbox=new Circle(location,16)) {
        console.assert(typeof health === "number");
        let newHitbox = hitbox;
        super(location, imgSrc, newHitbox, speed);
        this.name = name;
        this.maxHealth = health;
        this.currHealth = health;
    }
    /*
    update(now, dt) {
        //TODO figure out how to move other players (probably just set their x and y)
    }
    */
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
}

export default Player;
