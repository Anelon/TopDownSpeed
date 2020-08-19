import Vec2 from "./vec2.js";
import Entity from "./entity.js";
import { Circle } from "./shapes.js";
import Ability from "./ability.js";

//class for handling the current player
class PlayerController extends Entity {
    constructor(location, name, imgSrc, speed, bounds) {
        //create hitbox
        let image = new Image();
        image.src = imgSrc;
        let hitbox = new Circle(location, image.width/2);
        super(location, imgSrc, hitbox, speed);
        this.name = name;
        this.image = image;

        //create default abilities
        this.abilities = {
            [keyBinds.MELEE]: new Ability("Melee",imgSrc, 100, 100, 100),
            [keyBinds.RANGE]: new Ability("Arrow",imgSrc, 200, 100, 200),
        };
        //set up mouse object
        this.mouse = {
            x: null,
            y: null,
            changed: false,
            changeCount: 0,
        };
        this.bounds = bounds;

        //bind the mouse event to the document to control player aiming
        document.addEventListener("mousemove", this.mouseEvent.bind(this));
    }
    //gets a Vec2 that is the look direction and updates lookDirection
    get look() {
        this.lookDirection = new Vec2(this.mouse.x, this.mouse.y).subS(this.location);
        return this.lookDirection;
    }
    update(time, step, map) {
        this.moved = false;
        //console.log(step);
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
            this.move(step, direction, map);
            this.moved = true;
        }

        //abilities
        if(keyPress[keyBinds.MELEE]) {

        }
        if(keyPress[keyBinds.RANGE]) {
            //attempt to use the ability
            let arrow = this.abilities[keyBinds.RANGE].use(time.now, this.location, this.look);
            //if the ability was successful
            if (arrow) {
                //add projectile to the map
                map.addProjectile(arrow);
            } else {
                console.log("On CoolDown");
            }
        }
    }
    updateInfo(newInfo) {
        console.log(newInfo);
        console.log(this.location);
        this.location.x = newInfo.location.x;
        this.location.y = newInfo.location.y;
    }
    draw(canvas) {
        this.mouse.changed = false; // flag that the mouse coords have been rendered
        // get mouse canvas coordinate correcting for page scroll
        let target = new Vec2(this.mouse.x, this.mouse.y);
        canvas.drawImageLookat(this.image, this.location, this.look);
        // Draw mouse at its canvas position
        canvas.drawCrossHair(target, "black");
        // draw mouse event client coordinates on canvas
        //canvas.drawCrossHair(new Vec2(this.mouse.cx,this.mouse.cy),"rgba(255,100,100,0.2)");

        // draw line from you center to mouse to check alignment is perfect
        canvas.drawLine(this.location, target, "black", 0.2);
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
