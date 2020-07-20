import Vec2 from "./vec2.mjs";
import { Moveable } from "./entity.mjs";

//class for holding the other players and as a parent to PlayerController
class Player extends Moveable {
    constructor(map, location, imgSrc, speed) {
        super(map, location, imgSrc, speed);
    }
    update(dt) {
        //TODO figure out how to move other players (probably just set their x and y)
    }
}

//class for handling the current player
class PlayerController extends Player {
    constructor(map, location, imgSrc, speed) {
        super(map, location, imgSrc, speed);
    }
    update(dt) {
        this.moved = false;
        let direction = new Vec2();
        //check all of the different movement keybindings
        if(keyBinds.w) {
            direction.y -= 1;
        }
        if(keyBinds.s) {
            direction.y += 1;
        }
        if(keyBinds.a) {
            direction.x -= 1;
        }
        if(keyBinds.d) {
            direction.x += 1;
        }
        if(direction.x || direction.y) {
            this.move(dt, direction);
            this.moved = true;
            //this.location.addS(direction.makeUnit());
        }

        //abilities
        if(keyBinds[LEFT_STR]) {

        }
        if(keyBinds[RIGHT_STR]) {

        }
    }
}
export { Player, PlayerController };