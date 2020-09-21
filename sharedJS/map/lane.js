import { Rectangle } from "../shapes.js";
import { REGIONS, TILES, TILE_NAMES } from "../utils/enums.js";
import Vec2 from "../vec2.js";
import Layer from "./layer.js";
import Region from "./region.js";

export default class Lane {
    /**
     * @param {Vec2} dimentions In number of tiles wide, tall
     * @param {number} numLayers
     * @param {Vec2} tileSize
     * @param {Vec2} [topLeft] Will fill with empty layers if not set
     * @param {Array<Layer>} [layers] Will fill with empty layers if not set
     * @param {Map<string, Region>} [regions]
     */
    constructor(dimentions, numLayers, tileSize, topLeft=new Vec2(), layers, regions) {
        this.dimentions = dimentions;
        this.tileSize = tileSize;
        this.topLeft = topLeft;
        /** @type {Array<Layer>} */
        this.layers;
        if(layers) {
            this.layers = layers;
        } else {
            this.layers = new Array(numLayers);
            this.layers[0] = new Layer(dimentions, TILES[TILE_NAMES.g]);
            for (let i = 1; i < numLayers; i++) {
                this.layers[i] = new Layer(dimentions);
            }
        }
        //set spawn region
        this.spawn = new Rectangle(new Vec2(500,100), 1000, 200);
        //set dungeons
        let center = dimentions.multiplyScalar(.5).add(topLeft).multiplyVecS(tileSize);
        this.region = new Region(center, dimentions.clone().multiplyVecS(tileSize), "Lane");

        /** @type {Map<string, Region>} */
        this.regions = new Map();
        if(regions) this.regions = regions;
    }

    /**
     * @param {boolean} vertical
     * @param {Vec2} laneTopLeft
     */
    mirror(vertical, laneTopLeft) {
        //clone the layers and mirror them
        const mirroredLayers = this.layers.map((layer) => layer.mirror(vertical));
        //find the new lane center
        let laneCenter = this.dimentions.multiplyScalar(.5).add(laneTopLeft).multiplyVecS(this.tileSize);
        //mirror the regions
        const mirroredRegions = new Map();
        for(const region of this.regions.values()) {
            const centerToRegion = region.center.sub(this.region.center);
            if(vertical) centerToRegion.x *= -1;
            else centerToRegion.y *= -1;

            mirroredRegions.set(region.name, new REGIONS[region.name](laneCenter.add(centerToRegion), region.dimentions.clone(), region.name, region.color));
            //region.mirror(vertical)
        }

        //create new mirrored lane
        return new Lane(this.dimentions.clone(), this.layers.length, this.tileSize, laneTopLeft, mirroredLayers, mirroredRegions);
    }
    getJSON() {
        return JSON.stringify(this);
    }
    static makeFromJSON(json) {

    }
    generateStatic() {
        let statics = new Array();
        for(const layer of this.layers) {
            layer.generateStatic(this.tileSize);
        }
        return statics;
    }
    generateRegions() {
        let regions = new Array(this.region.makeHitBox());
        for(const region of this.regions.values()) {
            regions.push(region.makeHitBox());
        }
        return regions;
    }
    /**
     * @param {import("../../clientJS/canvasWrapper.js").default} canvas
     */
    draw(canvas) {
        //pass the draw command to the layers
        for(const layer of this.layers) {
            layer.draw(canvas, this.topLeft);
        }
        this.region.draw(canvas);
        for(const region of this.regions.values()) {
            region.draw(canvas);
        }
    }
    /**
     * @param {Vec2} regionStart
     * @param {Vec2} regionEnd
     * @param {number} layer
     * @param {import("./tile.js").default} tile
     */
    update(regionStart, regionEnd, layer, tile) {
        this.layers[layer].update(regionStart, regionEnd, tile, this.topLeft);
    }
    /**
     * @param {Vec2} regionStart
     * @param {Vec2} regionEnd
     * @param {typeof Region} region
     * @param {string} name
     */
    addRegion(regionStart, regionEnd, region, name) {
        const dimentions = regionEnd.sub(regionStart).absS().multiplyVecS(this.tileSize).addS(this.tileSize);
        const topLeft = new Vec2(Math.min(regionStart.x, regionEnd.x), Math.min(regionStart.y, regionEnd.y))
        const center = topLeft.multiplyVec(this.tileSize).addS(dimentions.multiplyScalar(0.5));
        //update or add the region to the map
        this.regions.set(name, new region(center, dimentions, name));
    }
}