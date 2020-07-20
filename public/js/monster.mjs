import Vec2 from "./vec2.mjs";
import { Moveable } from "./entity.mjs";

class Monster extends Moveable {
    constructor(map, location, imgSrc, speed) {
        super(map, location, imgSrc, speed);
    }
    update(dt, players) {
        /* TODO Look for players target the nearest one
        for(let player in players) {

        }
        */
    }
}

export default Monster;