import Point from "../point.js";
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
        const laneTopRight = this.leftLane.topRight.clone();
        if (verticalLanes)
            laneTopRight.x += laneDimentions.x + voidWidth;
        else
            laneTopRight.y += laneDimentions.y + voidWidth;
        this.rightLane = this.leftLane.mirror(verticalLanes, laneTopRight);
        //set top right

        this.editMode = false;
        if(verticalLanes)
            this.dimentions = new Vec2(laneDimentions.x * 2 + voidWidth, laneDimentions.y);
        else
            this.dimentions = new Vec2(laneDimentions.x, laneDimentions.y * 2 + voidWidth);
    }
    /**
     * @param {Vec2} regionStart
     * @param {Vec2} regionEnd
     * @param {number} layer
     * @param {import("./tile.js").default} tile
     */
    update(regionStart, regionEnd, layer, tile) {
        const startPoint = new Point(regionStart);
        const endPoint = new Point(regionEnd);
        if(this.rightLane.region.contains(startPoint) && this.rightLane.region.contains(endPoint)) {
            this.rightLane.update(regionStart, regionEnd, layer, tile);
        }
        else if(this.leftLane.region.contains(startPoint) && this.leftLane.region.contains(endPoint)) {
            this.leftLane.update(regionStart, regionEnd, layer, tile);
        } else {
            console.log("Failed to place tiles");
            console.log(startPoint, endPoint, this.leftLane.region, this.rightLane.region);
        }

    }
    /**
     * @param {import("../../clientJS/canvasWrapper.js").default} canvas
     */
    draw(canvas) {
        canvas.clear();
        this.rightLane.draw(canvas);
        this.leftLane.draw(canvas);
        canvas.drawGrid();
    }
}