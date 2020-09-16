import Vec2 from "../vec2.js";
import Lane from "./lane.js";

export default class GameMap {
    /**
     * @param {number} voidWidth
     * @param {Vec2} laneDimentions
     * @param {Lane} [lane]
     */
    constructor(voidWidth, laneDimentions, lane) {
        this.voidWidth = voidWidth;
        this.leftLane = lane;
        if(!lane) this.leftLane = new Lane(laneDimentions, 4)
        this.rightLane = this.leftLane.mirror();
        //set top right

        this.editMode = false;
    }
    /**
     * @param {import("../../clientJS/canvasWrapper.js").default} canvas
     */
    draw(canvas) {
        this.rightLane.draw(canvas);
    }
}