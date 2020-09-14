import Vec2 from "../vec2.js";
import Tile from "./tile.js";

export default class Layer {
    /**
     * @param {Vec2} dimentions
     */
    constructor(dimentions) {
        /** @type {Array<Array<Tile>>} */
        this.tiles = new Array(dimentions.y);
        for(let j = 0; j < dimentions.y; j++) {
            for (let i = 0; i < dimentions.x; i++) {
                this.tiles[j][i] = new Tile(new Vec2(i,j), "Void", false, true);
            }
        }
        this.dimentions = dimentions;
        console.log(this.tiles.length, this.tiles[0].length);
    }
    /**
     * @param {boolean} [vertical]
     */
    mirror(vertical = true) {
        //TODO mirror all of the tiles
        if(vertical) {
            //mirror vertically
        } else {
            //mirror horizontally
        }
    }
}