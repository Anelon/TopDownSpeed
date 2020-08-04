import Vec2 from "./vec2.mjs";
import Entity from "./entity.mjs";
import { Circle } from "./shapes.mjs";
import Ability from "./ability.mjs";

//class for handling the current player
class PlayerController extends Entity {
    constructor(location, name, imgSrc, speed, bounds) {
        let image = new Image();
        image.src = imgSrc;
        let hitbox = new Circle(location, image.width/2);
        super(location, imgSrc, hitbox, new Vec2(1,0), speed);
        this.name = name;
        this.image = image;

        this.abilities = {
            [keyBinds.MELEE]: new Ability("Melee",imgSrc, 100, 100, 100),
            [keyBinds.RANGE]: new Ability("Arrow",imgSrc, 200, 100, 200),
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
    update(time, map, canvas) {
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
        }

        //abilities
        if(keyPress[keyBinds.MELEE]) {

        }
        if(keyPress[keyBinds.RANGE]) {
            //attempt to use the ability
            let arrow = this.abilities[keyBinds.RANGE].use(time.now, this.location, this.look);
            //if the ability was successful
            if (arrow) {
                console.log(arrow);
                //add projectile to the map
                map.projectiles.push(arrow);
                //add it to the canvas' drawable
                canvas.addDrawable(arrow);
            } else {
                console.log("On CoolDown");
            }
        }
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
