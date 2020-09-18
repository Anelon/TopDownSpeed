import { Rectangle } from "../shapes.js";
import { TILES, TILE_NAMES } from "../utils/enums.js";
import Vec2 from "../vec2.js";
import Layer from "./layer.js";
import Region from "./region.js";

export default class Lane {
    /**
     * @param {Vec2} dimentions In number of tiles wide, tall
     * @param {number} numLayers
     * @param {Vec2} [topRight] Will fill with empty layers if not set
     * @param {Array<Layer>} [layers] Will fill with empty layers if not set
     */
    constructor(dimentions, numLayers, topRight=new Vec2(), layers) {
        this.dimentions = dimentions;
        this.topRight = topRight;
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
        let center = dimentions.multiplyScalar(.5).add(topRight);
        this.region = new Rectangle(center, dimentions.x, dimentions.y);
        console.log(this.region);

        /** @type {Array<Region>} */
        this.regions = new Array();
    }
    /**
     * @param {boolean} vertical
     * @param {Vec2} laneTopRight
     */
    mirror(vertical, laneTopRight) {
        //clone the layers
        const mirroredLayers = this.layers.map((layer) => layer.mirror(vertical));
        console.log(mirroredLayers);

        let mirrored = new Lane(this.dimentions.clone(), this.layers.length, laneTopRight, mirroredLayers);
        return mirrored;
    }
    getJSON() {
        return JSON.stringify(this);
    }
    static makeFromJSON(json) {

    }
    /**
     * @param {import("../../clientJS/canvasWrapper.js").default} canvas
     */
    draw(canvas) {
        //pass the draw command to the layers
        for(const layer of this.layers) {
            layer.draw(canvas, this.topRight);
        }
    }
    /**
     * @param {Vec2} regionStart
     * @param {Vec2} regionEnd
     * @param {number} layer
     * @param {import("./tile.js").default} tile
     */
    update(regionStart, regionEnd, layer, tile) {
        this.layers[layer].update(regionStart,regionEnd,tile, this.topRight);
    }
}