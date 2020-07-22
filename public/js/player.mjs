import Vec2 from "./vec2.mjs";
import { Moveable } from "./entity.mjs";

//class for holding the other players and as a parent to PlayerController
class Player extends Moveable {
    constructor(map, location, name, imgSrc, speed) {
        super(map, location, imgSrc, speed);
    }
    update(dt) {
        //TODO figure out how to move other players (probably just set their x and y)
    }
}

//class for handling the current player
class PlayerController extends Player {
    constructor(map, location, name, imgSrc, speed) {
        super(map, location, name, imgSrc, speed);
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
    draw(map, mouse) {
        mouse.changed = false; // flag that the mouse coords have been rendered
        map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
        // get mouse canvas coordinate correcting for page scroll
        let location = new Vec2(mouse.x, mouse.y);
        map.drawImageLookat(this.image, this.location, location);
        // Draw mouse at its canvas position
        map.drawCrossHair(location, "black");
        // draw mouse event client coordinates on canvas
        map.drawCrossHair(new Vec2(mouse.cx,mouse.cy),"rgba(255,100,100,0.2)");

        // draw line from you center to mouse to check alignment is perfect
        map.ctx.strokeStyle = "black";
        map.ctx.beginPath();
        map.ctx.globalAlpha = 0.2;
        map.ctx.moveTo(this.x, this.y);
        map.ctx.lineTo(location.x, location.y);
        map.ctx.stroke();
        map.ctx.globalAlpha = 1;
    }
}
export { Player, PlayerController };
