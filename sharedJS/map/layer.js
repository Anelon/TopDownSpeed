import { tileSprites } from "../../clientJS/sprites.js";
import { DIRS } from "../utils/dirsMap.js";
import { TILES, TILE_NAMES } from "../utils/enums.js";
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
        if (tiles) {
            this.tiles = tiles;
        } else {
            this.tiles = new Array(dimentions.y);
            for (let j = 0; j < dimentions.y; j++) {
                this.tiles[j] = new Array(dimentions.x);
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
        if (vertical) {
            //mirror vertically
        } else {
            //mirror horizontally
        }
        return this;
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
                this.tiles[j][i] = tile.clone().init(new Vec2(i, j), 0);
                //room[j] = room[j].slice(0, startX) + newStr + room[j].slice(endX + 1);
            }
        }
    }

    /**
     * Gets where each tile is around the current tile
     * @param {number} i X location of Tile
     * @param {number} j Y location of Tile
     * @param {Array} curr Array of tiles that can connect to
     */
    getAround(i, j, curr) {
        //console.log("getting Around");
        let around = 0;
        for (const dir of DIRS) {
            //console.log(dirs[dir]);
            let newI = dir.x + i;
            let newJ = dir.y + j;
            //if out of bounds count that as the tile
            if (newI < 0 || newJ < 0 || newI >= this.dimentions.x || newJ >= this.dimentions.y) {
                around = around | dir.dir;
                continue;
            }
            if (curr.includes(this.tiles[newJ][newI])) {
                around = around | dir.dir;
            }
        }
        return around;
    }

    /**
         * @param {import("../../clientJS/canvasWrapper.js").default} canvas
         */
    async draw(canvas) {
        canvas.clear();
        const height = this.tiles.length, width = this.tiles[0].length;
        console.log("drawing map", width, height);
        for (let j = 0; j < height; j++) {
            for (let i = 0; i < width; i++) {
                //grab tile name
                const tileName = TILE_NAMES[this.tiles[j][i]];
                //get the sprite
                const sprite = tileSprites.get(tileName);
                //get the around value
                const around = this.getAround(i, j, sprite.connects);
                const tile = TILES[tileName].clone().init(new Vec2(i, j), around);
                //sprite.draw(canvas, tile.location, tile.around);
                tileSprites.get(tile.name).draw(canvas, tile.location, tile.around);
                //await sleep(.01);
            }
        }
        canvas.drawGrid();
    }
}