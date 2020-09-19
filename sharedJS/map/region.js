import Box from "../box.js";
import { Rectangle } from "../shapes.js";
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
    }

    //TODO Figure out begin and end overlap
    //call when player overlaps
    hit(other) {
        //console.log(other, "entered", this.name);
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