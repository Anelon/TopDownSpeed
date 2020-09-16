import Vec2 from "../vec2.js";
import Tile from "./tile.js";

export default class Layer {
    /**
     * @param {Vec2} dimentions
     * @param {Array<Array<Tile>>} [tiles]
     */
    constructor(dimentions, tiles) {
        /** @type {Array<Array<Tile>>} */
        this.tiles;
        if(tiles) {
            this.tiles = tiles;
        } else {
            this.tiles = new Array(dimentions.y);
            for (let j = 0; j < dimentions.y; j++) {
                for (let i = 0; i < dimentions.x; i++) {
                    this.tiles[j][i] = new Tile(new Vec2(i, j), "Void", false, true, 0);
                }
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
    /**
     * @param {Vec2} regionStart
     * @param {Vec2} regionEnd
     * @param {Tile} tile
     */
    update(regionStart, regionEnd, tile) {
        console.assert(regionStart instanceof Vec2, "regionStart Not Vec2", regionStart);
        console.assert(regionEnd instanceof Vec2, "regionEnd Not Vec2", regionEnd);
        console.log(regionStart, regionEnd);
        let [startX, startY] = regionStart.getXY();
        let [endX, endY] = regionEnd.getXY();
        //if start is after end swap
        if (startX > endX)
            [startX, endX] = [endX, startX];
        if (startY > endY)
            [startY, endY] = [endY, startY];

        //build replacement string
        console.log(tile);

        for (let j = startY; j <= endY; j++) {
            for (let i = startX; i <= endX; i++) {
                this.tiles[j][i] = tile.clone().init(new Vec2(i,j), 0);
                //room[j] = room[j].slice(0, startX) + newStr + room[j].slice(endX + 1);
            }
        }

    }
}