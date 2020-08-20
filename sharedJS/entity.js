import Vec2 from "./vec2.js";
import Point from "./point.js";
import { Circle, Rectangle } from "./shapes.js";

let idGen = 0;
class Entity {
    /**
     * Makes a new Entity
     * @constructor
     * @param {Vec2} location The start location of Entity
     * @param {string} imgSrc Display image
     * @param {Circle|Rectangle} hitbox Hittable region
     * @param {number} [speed=0] How many pixels the entity moves per second
     * @param {Vec2} [lookDirection=Vec2(1,0)] Which direction the entity is looking at
     */
    constructor(location, imgSrc, hitbox, speed = 0, lookDirection = new Vec2(1,0)) {
        if(!(location instanceof Vec2)) {
            throw TypeError("Entity: Location not Vec2");
        }
        this.id = idGen++;
        this.location = location.clone();
        this.oldLocation = location.clone();
        //this.image = new Image();
        this.imgSrc = imgSrc;
        this.hitbox = hitbox.clone();
        this.lookDirection = lookDirection;
        this.speed = speed;
        //mostly for debugging now
        this.overlapping = false;
    }

    /**
     * Given a JSON object it updates the entity
     * @param {JSON} infoJSON Contains what needs to be updated
     */
    updateInfo(infoJSON) {
        if(infoJSON.id) this.id = infoJSON.id;
        if(infoJSON.location) {
            this.location = new Vec2(infoJSON.location.x, infoJSON.location.y);
        }
        if(infoJSON.lookDirection) {
            this.lookDirection = new Vec2(infoJSON.lookDirection.x, infoJSON.lookDirection.y);
        }
        if(infoJSON.speed) {
            this.speed = infoJSON.speed;
        }
    }
    get x() {
        return this.location.x;
    }
    get y() {
        return this.location.y;
    }

    /**
     * Makes a point and assigns Entity as owner
     * @returns {Point}
     */
    makePoint() {
        return new Point(this.location, this, this.hitbox.halfWidth);
    }

    /**
     * Creates a cirlce based on the size and location of Entity
     * @param {number} [scale=1] The scale of the shape you want to make
     * @returns {Circle}
     */
    makeShape(scale = 1) {
        return new Circle(this.location, (this.hitbox.halfWidth) * scale);
    }

    /**
     * Converts an Entity to a JSON object with the type as constructor name
     * @returns {JSON}
     */
    makeObject() {
        let objectType = this.constructor.name;
        let objectJson = JSON.stringify(this);
        return {type: objectType, json: objectJson};
    }

    /**
     * Updates the Entity based on how much time has passed and the map state
     * @param {Time} time 
     * @param {number} dt The time sinse last frame
     * @param {*} map 
     */
    update(time, dt, map) {
        if(this.speed > 0) {
            this.move(dt, this.lookDirection, map);
        }
    }
    move(dt, direction, map) {
        if(!(direction instanceof Vec2)) {
            throw TypeError("Moveable move: Direction not Vec2");
        }
        this.oldLocation = this.location.clone();

        let dist = this.speed * dt;
        this.location.addS(direction.getUnit().multiplyScalar(dist));
        /*
        //handle this with collision detection
        if(this.location.x < 0 || this.location.x >= map.canvas.width) {
            this.location.x = oldLocation.x;
        }
        if(this.location.y < 0 || this.location.y >= map.canvas.height) {
            this.location.y = oldLocation.y;
        }
        */
    }
}

export default Entity;