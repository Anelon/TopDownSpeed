import Vec2 from "./vec2.mjs";
import { Moveable } from "./entity.mjs";
import Projectile from "./projectile.mjs";
import Ability from "./ability.mjs";

//class for holding the other players and as a parent to PlayerController
class Player extends Moveable {
    constructor(location, name, imgSrc, speed) {
        super(location, imgSrc, speed);
    }
    update(now, dt) {
        //TODO figure out how to move other players (probably just set their x and y)
    }
}

//class for handling the current player
class PlayerController extends Player {
    constructor(location, name, imgSrc, speed, bounds) {
        super(location, name, imgSrc, speed);

        this.abilities = {
            [LEFT_STR]: new Ability("Melee",imgSrc, 100, 100, 100),
            [RIGHT_STR]: new Ability("Arrow",imgSrc, 200, 100, 200),

        };
        this.mouse = {
            x: null,
            y: null,
            changed: false,
            changeCount: 0,
        };
        //bind the mouse event to the document to control player aiming
        this.bounds = bounds;
        document.addEventListener("mousemove", this.mouseEvent.bind(this));
    }
    //gets a Vec2 that is the look direction and updates lookDirection
    get look() {
        this.lookDirection = new Vec2(this.mouse.x, this.mouse.y).subS(this.location);
        return this.lookDirection;
    }
    update(now, dt, map) {
        this.moved = false;
        let direction = new Vec2();
        //check all of the different movement keybindings
        if(keyPress[keyBinds.UP]) {
            direction.y -= 1;
        }
        if(keyPress[keyBinds.DOWN]) {
            direction.y += 1;
        }
        if(keyPress[keyBinds.LEFT]) {
            direction.x -= 1;
        }
        if(keyPress[keyBinds.RIGHT]) {
            direction.x += 1;
        }
        if(direction.x || direction.y) {
            this.move(dt, direction, map);
            this.moved = true;
            //this.location.addS(direction.makeUnit());
        }

        //abilities
        if(keyPress[LEFT_STR]) {

        }
        if(keyPress[RIGHT_STR]) {
            let arrow = this.abilities[RIGHT_STR].use(now, map, this.location, this.look);
            if (arrow) {
                map.projectiles.push(arrow);
            } else {
                console.log("On CoolDown");
            }
        }
    }
    draw(map) {
        this.mouse.changed = false; // flag that the mouse coords have been rendered
        // get mouse canvas coordinate correcting for page scroll
        let location = new Vec2(this.mouse.x, this.mouse.y);
        map.drawImageLookat(this.image, this.location, this.look);
        // Draw mouse at its canvas position
        map.drawCrossHair(location, "black");
        // draw mouse event client coordinates on canvas
        map.drawCrossHair(new Vec2(this.mouse.cx,this.mouse.cy),"rgba(255,100,100,0.2)");

        // draw line from you center to mouse to check alignment is perfect
        map.ctx.strokeStyle = "black";
        map.ctx.beginPath();
        map.ctx.globalAlpha = 0.2;
        map.ctx.moveTo(this.x, this.y);
        map.ctx.lineTo(location.x, location.y);
        map.ctx.stroke();
        map.ctx.globalAlpha = 1;
    }
    mouseEvent(e, map) {  // get the mouse coordinates relative to the canvas top left
        //let bounds = map.canvas.getBoundingClientRect();
        this.mouse.x = e.pageX - this.bounds.left;
        this.mouse.y = e.pageY - this.bounds.top;
        this.mouse.cx = e.clientX - this.bounds.left; // to compare the difference between client and page coordinates
        this.mouse.cy = e.clienY - this.bounds.top;
        this.mouse.changed = true;
        this.mouse.changeCount += 1;
    }
}
export { Player, PlayerController };
