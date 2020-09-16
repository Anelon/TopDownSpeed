import Vec2 from "../vec2.js";
import Lane from "./lane.js";

export default class GameMap {
    /**
     * @param {number} voidWidth
     * @param {Vec2} laneDimentions
     * @param {boolean} [verticalLanes]
     * @param {Lane} [lane]
     */
    constructor(voidWidth, laneDimentions, verticalLanes=true, lane) {
        this.voidWidth = voidWidth;
        this.leftLane = lane;
        if(!lane) this.leftLane = new Lane(laneDimentions, 4)
        //TODO figure out if lane orientation is vertical or horizontal
        this.rightLane = this.leftLane.mirror(verticalLanes);
        if (verticalLanes)
            this.rightLane.topRight.x += laneDimentions.x + voidWidth;
        else
            this.rightLane.topRight.y += laneDimentions.y + voidWidth;
        //set top right

        this.editMode = false;
        if(verticalLanes)
            this.dimentions = new Vec2(laneDimentions.x * 2 + voidWidth, laneDimentions.y);
        else
            this.dimentions = new Vec2(laneDimentions.x, laneDimentions.y * 2 + voidWidth);
    }
    update(regionStart, regionEnd, tile, layer) {

    }
    /**
     * @param {import("../../clientJS/canvasWrapper.js").default} canvas
     */
    draw(canvas) {
        canvas.clear();
        console.log(this.rightLane, this.leftLane);
        this.rightLane.draw(canvas);
        this.leftLane.draw(canvas);
        canvas.drawGrid();
    }
}