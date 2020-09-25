import { tileSprites } from "../../clientJS/sprites.js";
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
    getJSON() {
        return JSON.stringify(this);
    }
    saveMap() {
        const voidWidth = this.voidWidth;
        const tileSize = this.tileSize;
        const leftLane = this.leftLane.makeObject();
        console.log(leftLane);
        return JSON.stringify({voidWidth, tileSize, leftLane})
    }
    static makeFromJSON(json) {
        const {
            leftLane, voidWidth, tileSize, verticalLanes
        } = json;
        const tilesize = new Vec2(tileSize.x, tileSize.y);
        const lane = Lane.makeFromJSON(leftLane, tilesize);
        return new GameMap(voidWidth, lane.dimentions, tilesize, verticalLanes, lane);
    }
    /**
     * @param {Vec2} regionStart
     * @param {Vec2} regionEnd
     * @param {number} layer
     * @param {import("./tile.js").default} tile
     */
    update(regionStart, regionEnd, layer, tile) {
        //convert from tile to pixels
        const startPoint = regionStart.multiplyVec(this.tileSize);
        const endPoint = regionEnd.multiplyVec(this.tileSize);
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
            //TODO possibly alert an error message
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
        const startPoint = regionStart.multiplyVec(this.tileSize);
        const endPoint = regionEnd.multiplyVec(this.tileSize);
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
        console.log("GameMap statics", statics);
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
    bakeImage() {
        //TODO generate image from canvas
    }
}