import { Rectangle } from "../shapes.js";
import Vec2 from "../vec2.js";
import Layer from "./layer.js";
import Region from "./region.js";

export default class Lane {
    /**
     * @param {Vec2} dimentions In number of tiles wide, tall
     * @param {number} numLayers
     * @param {Array<Layer>} [layers] Will fill with empty layers if not set
     */
    constructor(dimentions, numLayers, layers, topRight=new Vec2()) {
        this.dimentions = dimentions;
        /** @type {Array<Layer>} */
        this.layers;
        if(layers) {
            this.layers = layers;
        } else {
            this.layers = new Array(numLayers);
            for (let layer of this.layers) {
                layer = new Layer(dimentions);
            }
        }
        //set spawn region
        this.spawn = new Rectangle(new Vec2(500,100), 1000, 200);
        //set dungeons

        /** @type {Array<Region>} */
        this.regions = new Array();
    }
    /**
     * @param {boolean} [vertical]
     */
    mirror(vertical=true) {
        let mirrored = new Lane(this.dimentions.clone(), this.layers.length);
        for(let layer of mirrored.layers) { 
            layer.mirror(vertical);
        }
        return mirrored;
    }
    getJSON() {
        return JSON.stringify(this);
    }
}