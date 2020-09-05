import Vec2 from "../sharedJS/vec2.js";
import { Circle } from "../sharedJS/shapes.js";
import Ability from "../sharedJS/ability.js";
import CHANNELS from "../sharedJS/channels.js";
import Player from "../sharedJS/player.js";
import { keyBinds, keyPress } from "./keyBinds.js";
import GameMap from "../sharedJS/map.js";
import CanvasWrapper from "./canvasWrapper.js";
import Time from "./time.js";

//class for handling the current player
class PlayerController extends Player {
    /**
     * 
     * @param {Vec2} location 
     * @param {string} name 
     * @param {string} imgSrc 
     * @param {number} speed 
     * @param {number} health 
     * @param {*} bounds 
     */
    constructor(location, name, imgSrc, speed, health, bounds) {
        //create hitbox
        let image = new Image();
        image.src = imgSrc;
        let hitbox = new Circle(location, image.width/2);
        super(location, name, imgSrc, speed, health, hitbox);
        this.name = name;
        this.image = image;
        this.offset = image.width * 2;

        //create default abilities
        this.abilities = {
            [keyBinds.MELEE]: new Ability("Melee", "./img/arrow.png", 100, 100, 100),
            [keyBinds.RANGE]: new Ability("Arrow", "./img/arrow.png", 200, 100, 200),
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
    /**
     * 
     * @param {Time} time 
     * @param {number} step 
     * @param {GameMap} map 
     * @param {CanvasWrapper} canvas 
     * @param {*} socket 
     */
    // @ts-ignore
    update(time, step, map, canvas, socket) {
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
            this.move(step, direction);
            this.moved = true;
        }

        //abilities
        if(keyPress[keyBinds.MELEE]) {
            console.log(this);
        }
        if(keyPress[keyBinds.RANGE]) {
            //attempt to use the ability
            let arrow = this.abilities[keyBinds.RANGE].use(time.now, this.location, this.look, this.offset);
            //if the ability was successful
            if (arrow) {
                //add projectile to the map
                //console.log(arrow.location.log());
                map.addProjectile(arrow);
                canvas.addDrawable(arrow);
                socket.emit(CHANNELS.newProjectile, arrow.makeObject());
            } else {
                console.log("On CoolDown");
            }
        }
    }
    /**
     * Draws player image, crosshair, and healthbar
     * @param {CanvasWrapper} canvas 
     */
    draw(canvas) {
        this.mouse.changed = false; // flag that the mouse coords have been rendered
        // get mouse canvas coordinate correcting for page scroll
        let target = new Vec2(this.mouse.x, this.mouse.y);
        canvas.drawImageLookat(this.image, this.location, this.look);
        // Draw mouse at its canvas position
        canvas.drawCrossHair(target, "black");
        // draw line from you center to mouse to check alignment is perfect
        canvas.drawLine(this.location, target, "black", 0.2);
        // draw Health bar
        const healthBarOffset = new Vec2(0, -(this.hitbox.halfWidth + 5));
        const healthBarDimentions = new Vec2(32, 8);
        const origin = this.location.add(healthBarOffset);

        canvas.drawHealthBar(origin, healthBarDimentions, this.currHealth, this.maxHealth);
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
