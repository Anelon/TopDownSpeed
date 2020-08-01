import Vec2 from "./vec2.mjs";
import Entity from "../sharedJS/entity.mjs";
//import Ability from "../../sharedJS/ability.mjs";

//class for holding the other players and as a parent to PlayerController
class Player extends Entity {
    constructor(location, name, imgSrc, speed, health) {
        super(location, imgSrc, speed);
        this.maxHealth = health;
        this.currHealth = health;
    }
    update(now, dt) {
        //TODO figure out how to move other players (probably just set their x and y)
    }
}

export default Player;
