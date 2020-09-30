import Vec2 from "../vec2.js";
import Lane from "./lane.js";
import Region from "./region.js";
import VoidRegion from "./voidRegion.js";

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
        const laneTopLeft = this.leftLane.topLeft.clone();

        let voidCenter, voidDims;
        if (verticalLanes) {
            //set up lane topRight
            laneTopLeft.x += laneDimentions.x + voidWidth;
            //set lane dimentions
            this.dimentions = new Vec2(laneDimentions.x * 2 + voidWidth, laneDimentions.y);
            //set up void variables
            voidCenter = new Vec2((laneDimentions.x * 2 + voidWidth) / 2, laneDimentions.y / 2).multiplyVecS(tileSize);
            voidDims = new Vec2(voidWidth, laneDimentions.y).multiplyVecS(tileSize);
        } else {
            //set up lane topRight
            laneTopLeft.y += laneDimentions.y + voidWidth;
            //set lane dimentions
            this.dimentions = new Vec2(laneDimentions.x, laneDimentions.y * 2 + voidWidth);
            //set up void variables
            voidCenter = new Vec2((laneDimentions.x * 2 + voidWidth) / 2, laneDimentions.y / 2).multiplyVecS(tileSize);
            voidDims = new Vec2(voidWidth, laneDimentions.y).multiplyVecS(tileSize);
        }

        this.rightLane = this.leftLane.mirror(verticalLanes, laneTopLeft);

        this.editMode = false;
        this.verticalLanes = verticalLanes;

        this.voidRegion = new VoidRegion(voidCenter, voidDims, "Void");
    }
    getJSON() {
        return JSON.stringify(this);
    }
    saveMap() {
        const voidWidth = this.voidWidth;
        const tileSize = this.tileSize;
        const leftLane = this.leftLane.makeObject();
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
            console.error("Failed to place tiles");
            console.error(startPoint, endPoint, this.leftLane.region, this.rightLane.region);
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
            console.error("Failed to place tiles");
            console.error(startPoint, endPoint, this.leftLane.region, this.rightLane.region);
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
        let regions = new Array(this.voidRegion);
        regions.push(...this.rightLane.generateRegions());
        regions.push(...this.leftLane.generateRegions());
        return regions;
    }
    /**
     * @param {import("../../clientJS/canvasWrapper.js").default} canvas
     * @param {import("../../clientJS/sprites.js").tileSprites} tileSprites
     */
    draw(canvas, tileSprites) {
        canvas.clear();
        this.rightLane.draw(canvas, tileSprites);
        this.leftLane.draw(canvas, tileSprites);
        canvas.drawGrid();
    }
    bakeImage() {
        //TODO generate image from canvas
    }
}