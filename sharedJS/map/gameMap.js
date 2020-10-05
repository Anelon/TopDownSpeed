import Vec2 from "../vec2.js";
import Lane from "./lane.js";
import Region from "./region.js";
import VoidRegion from "./voidRegion.js";

export default class GameMap {
    static numLayers = 4;
    static LEFT = "Left";
    static RIGHT = "Right";
    /**
     * @param {number} voidWidth
     * @param {Vec2} laneDimentions
     * @param {Vec2} tileSize
     * @param {boolean} [verticalLanes]
     * @param {Lane} [lane]
     */
    constructor(voidWidth, laneDimentions, tileSize, verticalLanes=true, lane) {
        this.voidWidth = voidWidth;
        /** @type {Map<string, Lane>} */
        this.lanes = new Map();
        this.lanes.set(GameMap.LEFT, lane);
        this.tileSize = tileSize;
        if(!lane) this.lanes.set(GameMap.LEFT, new Lane("left", laneDimentions, GameMap.numLayers, tileSize));
        const laneTopLeft = this.lanes.get(GameMap.LEFT).topLeft.clone();

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

        this.lanes.set(GameMap.RIGHT, this.lanes.get(GameMap.LEFT).mirror(verticalLanes, laneTopLeft));

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
        const leftLane = this.lanes.get(GameMap.LEFT).makeObject();
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
        let placed = false;

        //find the lane that the selections are in
        for (const lane of this.lanes.values()) {
            if (lane.region.contains(startPoint) && lane.region.contains(endPoint)) {
                lane.update(regionStart, regionEnd, layer, tile);

                for (let other of this.lanes.keys()) {
                    //skip the current lane
                    if(this.lanes.get(other) === lane) continue;
                    const name = this.lanes.get(other).name;
                    const newLane = lane.mirror(this.verticalLanes, this.lanes.get(other).topLeft);
                    this.lanes.set(other, newLane);
                    //put name back on
                    this.lanes.get(other).name = name;
                }
                placed = true;
                console.log("Placed", placed)
                break;
            }
        }
        if(!placed) {
            //TODO possibly alert an error message
            console.error("Failed to place tiles");
            console.error(startPoint, endPoint);
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
        let placed = false;
        //find the lane that the selections are in
        for (const lane of this.lanes.values()) {
            if (lane.region.contains(startPoint) && lane.region.contains(endPoint)) {
                lane.addRegion(regionStart, regionEnd, region, name);

                for (let other of this.lanes.values()) {
                    //skip the current lane
                    if(other === lane) continue;
                    const name = other.name;
                    other = lane.mirror(this.verticalLanes, other.topLeft);
                    //put name back on
                    other.name = name;
                }
                placed = true;
                break;
            }
        }
        if(placed) {
            //TODO possibly alert an error message
            console.error("Failed to place tiles");
            console.error(startPoint, endPoint);
        }
    }
    generateStatic() {
        const statics = new Array();
        for(const lane of this.lanes.values()) {
            statics.push(...lane.generateStatic());
        }
        return statics
    }
    generateRegions() {
        const regions = new Array(this.voidRegion);
        for(const lane of this.lanes.values()) {
            regions.push(...lane.generateRegions());
        }
        return regions;
    }
    /**
     * @param {import("../../clientJS/canvasWrapper.js").default} canvas
     * @param {import("../../clientJS/sprites.js").tileSprites} tileSprites
     */
    draw(canvas, tileSprites) {
        canvas.clear();
        for(const lane of this.lanes.values()) {
            lane.draw(canvas, tileSprites);
        }
        canvas.drawGrid();
    }
    bakeImage() {
        //TODO generate image from canvas
    }
    getMonsters() {
        const monsters = new Array();
        for(const lane of this.lanes.values()) {
            monsters.push(...lane.getMonsters());
        }
        return monsters;
    }
}