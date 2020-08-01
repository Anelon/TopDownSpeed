import Vec2 from "./vec2.mjs";
import Entity from "./entity.mjs";

//class for handling the current player
class PlayerController extends Entity {
    constructor(location, name, imgSrc, speed, bounds) {
        super(location, name, imgSrc, speed);
        this.image = new Image();
        this.image.src = imgSrc;

        /*dd
        this.abilities = {
            [LEFT_STR]: new Ability("Melee",imgSrc, 100, 100, 100),
            [RIGHT_STR]: new Ability("Arrow",imgSrc, 200, 100, 200),
        };
        */
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
    update(time, map) {
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
            this.move(time.dt, direction, map);
            this.moved = true;
            //this.location.addS(direction.makeUnit());
            console.log(this.location.log());
        }

        //abilities
        if(keyPress[LEFT_STR]) {

        }
        if(keyPress[RIGHT_STR]) {
            let arrow = this.abilities[RIGHT_STR].use(time.now, map, this.location, this.look);
            if (arrow) {
                map.projectiles.push(arrow);
            } else {
                console.log("On CoolDown");
            }
        }
    }
    draw(canvas) {
        this.mouse.changed = false; // flag that the mouse coords have been rendered
        // get mouse canvas coordinate correcting for page scroll
        let location = new Vec2(this.mouse.x, this.mouse.y);
        canvas.drawImageLookat(this.image, this.location, this.look);
        // Draw mouse at its canvas position
        canvas.drawCrossHair(location, "black");
        // draw mouse event client coordinates on canvas
        //canvas.drawCrossHair(new Vec2(this.mouse.cx,this.mouse.cy),"rgba(255,100,100,0.2)");

        // draw line from you center to mouse to check alignment is perfect
        canvas.ctx.strokeStyle = "black";
        canvas.ctx.beginPath();
        canvas.ctx.globalAlpha = 0.2;
        canvas.ctx.moveTo(this.x, this.y);
        canvas.ctx.lineTo(location.x, location.y);
        canvas.ctx.stroke();
        canvas.ctx.globalAlpha = 1;
    }
    mouseEvent(e) {  // get the mouse coordinates relative to the canvas top left
        //let bounds = map.canvas.getBoundingClientRect();
        this.mouse.x = e.pageX - this.bounds.left;
        this.mouse.y = e.pageY - this.bounds.top;
        this.mouse.cx = e.clientX - this.bounds.left; // to compare the difference between client and page coordinates
        this.mouse.cy = e.clienY - this.bounds.top;
        this.mouse.changed = true;
        this.mouse.changeCount += 1;
    }
}

export default PlayerController;