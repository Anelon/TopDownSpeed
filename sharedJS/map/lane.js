import { Rectangle } from "../shapes.js";
import { TILES, TILE_NAMES } from "../utils/enums.js";
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
     * @param {Array<Region>} [regions]
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

        /** @type {Array<Region>} */
        this.regions = new Array();
        if(regions) this.regions = regions;
    }

    /**
     * @param {boolean} vertical
     * @param {Vec2} laneTopRight
     */
    mirror(vertical, laneTopRight) {
        //clone the layers and mirror them
        const mirroredLayers = this.layers.map((layer) => layer.mirror(vertical));

        //create new mirrored lane
        let mirrored = new Lane(this.dimentions.clone(), this.layers.length, this.tileSize, laneTopRight, mirroredLayers);
        return mirrored;
    }
    getJSON() {
        return JSON.stringify(this);
    }
    static makeFromJSON(json) {

    }
    generateStatic() {
        let statics = new Array(this.region.makeHitBox());
        statics.push(...(this.regions.map((region) => region.makeHitBox())));
        return statics;
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
    addRegion(regionStart, regionEnd, region) {
        console.log(regionStart,regionEnd);
        //get tile version
    }
}