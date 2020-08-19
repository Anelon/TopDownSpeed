import Vec2 from "./vec2.js";
import { Moveable } from "./entity.js";

class Monster extends Moveable {
    constructor(map, location, imgSrc, speed) {
        super(map, location, imgSrc, speed);
    }
    update(now, dt, players) {
        /* TODO Look for players target the nearest one
        for(let player in players) {

        }
        */
    }
}

export default Monster;