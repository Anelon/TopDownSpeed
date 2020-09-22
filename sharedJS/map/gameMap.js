import Point from "../point.js";
import Vec2 from "../vec2.js";
import Lane from "./lane.js";
import Region from "./region.js";

export default class GameMap {
    static numLayers = 4;
    /**
     * @param {number} voidWidth
     * @param {Vec2} laneDimentions
     * @param {Vec2} tileSize
     * @param {boolean} [verticalLanes]
     * @param {Lane} [lane]
     */
    constructor(voidWidth, laneDimentions, tileSize, verticalLanes=true, lane) {
        this.voidWidth = voidWidth;
        this.leftLane = lane;
        this.tileSize = tileSize;
        if(!lane) this.leftLane = new Lane(laneDimentions, GameMap.numLayers, tileSize)
        //TODO figure out if lane orientation is vertical or horizontal
        const laneTopRight = this.leftLane.topLeft.clone();
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
        this.verticalLanes = verticalLanes;
    }
    /**
     * @param {Vec2} regionStart
     * @param {Vec2} regionEnd
     * @param {number} layer
     * @param {import("./tile.js").default} tile
     */
    update(regionStart, regionEnd, layer, tile) {
        const startPoint = new Point(regionStart.multiplyVec(this.tileSize));
        const endPoint = new Point(regionEnd.multiplyVec(this.tileSize));
        //Left Lane
        if(this.leftLane.region.contains(startPoint) && this.leftLane.region.contains(endPoint)) {
            this.leftLane.update(regionStart, regionEnd, layer, tile);
            this.rightLane = this.leftLane.mirror(this.verticalLanes, this.rightLane.topLeft);
        }
        //Right Lane
        else if(this.rightLane.region.contains(startPoint) && this.rightLane.region.contains(endPoint)) {
            this.rightLane.update(regionStart, regionEnd, layer, tile);
            this.leftLane = this.rightLane.mirror(this.verticalLanes, this.leftLane.topLeft);
        }
        //Both points weren't in a lane
        else {
            console.log("Failed to place tiles");
            console.log(startPoint, endPoint, this.leftLane.region, this.rightLane.region);
        }
    }

    /**
     * @param {Vec2} regionStart
     * @param {Vec2} regionEnd
     * @param {typeof Region} region
     * @param {string} name
     */
    addRegion(regionStart, regionEnd, region, name) {
        const startPoint = new Point(regionStart.multiplyVec(this.tileSize));
        const endPoint = new Point(regionEnd.multiplyVec(this.tileSize));
        //Left Lane
        if(this.leftLane.region.contains(startPoint) && this.leftLane.region.contains(endPoint)) {
            this.leftLane.addRegion(regionStart, regionEnd, region, name);
            this.rightLane = this.leftLane.mirror(this.verticalLanes, this.rightLane.topLeft);
        }
        //Right Lane
        else if(this.rightLane.region.contains(startPoint) && this.rightLane.region.contains(endPoint)) {
            this.rightLane.addRegion(regionStart, regionEnd, region, name);
            this.leftLane = this.rightLane.mirror(this.verticalLanes, this.leftLane.topLeft);
        }
        //Both points weren't in a lane
        else {
            console.log("Failed to place tiles");
            console.log(startPoint, endPoint, this.leftLane.region, this.rightLane.region);
            //exit function
            return;
        }
    }
    generateStatic() {
        let statics = this.rightLane.generateStatic();
        statics.push(...this.leftLane.generateStatic());
        return statics
    }
    generateRegions() {
        let regions = this.rightLane.generateRegions();
        regions.push(...this.leftLane.generateRegions());
        return regions;
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
    getJSON() {
        return JSON.stringify(this);
    }
    static makeFromJSON(json) {

    }
    bakeImage() {
        //TODO generate image from canvas
    }
}