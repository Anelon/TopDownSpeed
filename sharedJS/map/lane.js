import TileSprite from "../../clientJS/tileSprite";
import Vec2 from "../vec2";

export default class GameMap {
    /**
     * @param {Vec2} dimentions In number of tiles wide, tall
     * @param {Vec2} tileDimentions
     * @param {number} numLayers
     */
    constructor(dimentions, tileDimentions, numLayers) {
        this.dimentions = dimentions;
        this.tileDimentions = tileDimentions;
        /** @type {Array<TileSprite>} */
        this.layers = new Array(numLayers);
    }
}