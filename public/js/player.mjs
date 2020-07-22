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

        this.mouse = {
            x: null,
            y: null,
            changed: false,
            changeCount: 0,
        }
        //bind the mouse event to the document to control player aiming
        document.addEventListener("mousemove", this.mouseEvent.bind(this));
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
    draw() {
        this.mouse.changed = false; // flag that the mouse coords have been rendered
        this.map.ctx.clearRect(0, 0, this.map.canvas.width, this.map.canvas.height);
        // get mouse canvas coordinate correcting for page scroll
        let location = new Vec2(this.mouse.x, this.mouse.y);
        this.map.drawImageLookat(this.image, this.location, location);
        // Draw mouse at its canvas position
        this.map.drawCrossHair(location, "black");
        // draw mouse event client coordinates on canvas
        this.map.drawCrossHair(new Vec2(this.mouse.cx,this.mouse.cy),"rgba(255,100,100,0.2)");

        // draw line from you center to mouse to check alignment is perfect
        this.map.ctx.strokeStyle = "black";
        this.map.ctx.beginPath();
        this.map.ctx.globalAlpha = 0.2;
        this.map.ctx.moveTo(this.x, this.y);
        this.map.ctx.lineTo(location.x, location.y);
        this.map.ctx.stroke();
        this.map.ctx.globalAlpha = 1;
    }
    mouseEvent(e) {  // get the mouse coordinates relative to the canvas top left
        let bounds = this.map.canvas.getBoundingClientRect();
        this.mouse.x = e.pageX - bounds.left;
        this.mouse.y = e.pageY - bounds.top;
        this.mouse.cx = e.clientX - bounds.left; // to compare the difference between client and page coordinates
        this.mouse.cy = e.clienY - bounds.top;
        this.mouse.changed = true;
        this.mouse.changeCount += 1;
    }
}
export { Player, PlayerController };
