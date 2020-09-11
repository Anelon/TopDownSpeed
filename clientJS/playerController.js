import Vec2 from "../sharedJS/vec2.js";
import { Circle } from "../sharedJS/shapes.js";
import Ability from "../sharedJS/ability.js";
import CHANNELS from "../sharedJS/channels.js";
import Player from "../sharedJS/player.js";
import { keyBinds, keyPress } from "./keyBinds.js";
import CollisionEngine from "../sharedJS/collisionEngine.js";
import CanvasWrapper from "./canvasWrapper.js";
import Time from "./time.js";
import Projectile from "../sharedJS/projectile.js";
import FireballAbility from "../sharedJS/fireballAbility.js";
import WaterballAbility from "../sharedJS/waterballAbility.js";
import PlantSeedAbility from "../sharedJS/plantSeedAbility.js";
import Waterball from "../sharedJS/waterball.js";

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
     * @param {number} scale 
     */
    constructor(location, name, imgSrc, speed, health, bounds, scale) {
        //create hitbox
        let image = new Image();
        image.src = imgSrc;
        let hitbox = new Circle(location, 32);
        super(location, name, imgSrc, speed, health, hitbox, scale);
        this.name = name;
        this.image = image;

        //create default abilities
        this.abilities = {
            [keyBinds.MELEE]: new Ability("Melee",  100, 100, 100, 10, Projectile, 1, new Circle(new Vec2(), 16)),
            [keyBinds.RANGE]: new Ability("Arrow",  200, 100, 200, 10, Projectile, 1, new Circle(new Vec2(), 16)),
            [keyBinds.ABILITY1]: new FireballAbility(),
            [keyBinds.ABILITY2]: new WaterballAbility(),
            [keyBinds.ABILITY3]: new PlantSeedAbility(),
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
     * @param {Time} time
     * @param {number} dt
     * @param {CollisionEngine} [collisions]
     * @param {CanvasWrapper} [canvas]
     * @param {any} [socket]
     */
    update(time, dt, collisions, canvas, socket) {
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
            this.move(dt, direction);
            this.moved = true;
        }

        // --- Abilities ---

        //TODO make melee ability (currently debugging prints this)
        if(keyPress[keyBinds.MELEE]) {
            console.log(this);
            console.log(collisions.projectiles);
        }
        //basic arrow ability
        if(keyPress[keyBinds.RANGE]) {
            //attempt to use the ability
            let arrow = this.abilities[keyBinds.RANGE].use(time.now, this);
            //if the ability was successful
            if (arrow) {
                //add projectile to the collisions
                //console.log(arrow.location.log());
                collisions.addProjectile(arrow);
                canvas.addDrawable(arrow);
                socket.emit(CHANNELS.newProjectile, arrow.makeObject());
            } else {
                console.log("On CoolDown");
            }
        }

        //TODO make ranged ability right now does fireball
        if(keyPress[keyBinds.ABILITY1]) {
            //attempt to use the ability
            let fireball = this.abilities[keyBinds.ABILITY1].use(time.now, this);
            //if the ability was successful
            if (fireball) {
                //add projectile to the collisions
                //console.log(fireball.location.log());
                collisions.addProjectile(fireball);
                canvas.addDrawable(fireball.makeSprite());
                socket.emit(CHANNELS.newProjectile, fireball.makeObject());
            } else {
                console.log("On CoolDown");
            }
        }
        if(keyPress[keyBinds.ABILITY2]) {
            //attempt to use the ability
            /** @type {Waterball} */
            // @ts-ignore
            let waterball = this.abilities[keyBinds.ABILITY2].use(time.now, this);
            //if the ability was successful
            if (waterball) {
                //add projectile to the collisions
                collisions.addProjectile(waterball);
                canvas.addDrawable(waterball.makeSprite());
                socket.emit(CHANNELS.newProjectile, waterball.makeObject());
            } else {
                console.log("On CoolDown");
            }
        }
        if(keyPress[keyBinds.ABILITY3]) {
            //attempt to use the ability
            let plantSeed = this.abilities[keyBinds.ABILITY3].use(time.now, this);
            //if the ability was successful
            if (plantSeed) {
                //add projectile to the collisions
                //console.log(plantSeed.location.log());
                collisions.addProjectile(plantSeed);
                canvas.addDrawable(plantSeed.makeSprite());
                socket.emit(CHANNELS.newProjectile, plantSeed.makeObject());
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
        canvas.drawImageLookat(this.image, this.location, this.look, this.overlapping, this.scale);
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
        //let bounds = collisions.canvas.getBoundingClientRect();
        this.mouse.x = e.pageX - this.bounds.left;
        this.mouse.y = e.pageY - this.bounds.top;
        this.mouse.cx = e.clientX - this.bounds.left; // to compare the difference between client and page coordinates
        this.mouse.cy = e.clienY - this.bounds.top;
        this.mouse.changed = true;
        this.mouse.changeCount += 1;
    }
}

export default PlayerController;
