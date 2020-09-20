import Box from "../box.js";
import { Rectangle } from "../shapes.js";
import { CATEGORY, TYPES } from "../utils/enums.js";
/** @typedef {import("../vec2.js").default} Vec2 */

export default class Region extends Rectangle {
    /**
     * @param {string} name
     * @param {Vec2} center
     * @param {Vec2} dimentions
     * @param {string} [color]
     */
    constructor(center, dimentions, name, color = "gray") {
        super(center, dimentions.x, dimentions.y);
        this.name = name;
        this.color = color;
        this.overlapping = false;
        this.category = CATEGORY.region;
        this.overlaps = new Set();
        this.lastOverlaps = new Set();
    }

    //TODO Figure out mirroring regions in lanes
    //TODO Figure out begin and end overlap
    //call when player overlaps
    hit(other) {
        //don't overlap any other regions
        if(other.category === this.category) return;
        //if player add to overlapping the region
        if(other.category === CATEGORY.player) this.overlaps.add(other);
    }
    draw(canvas) {
        super.draw(canvas, this.color);
    }
    makeHitBox() {
        return new Box(this.center.clone(), this.dimentions.clone(), this, this.color);
    }
    makeShape() {
        return super.clone();
    }
}