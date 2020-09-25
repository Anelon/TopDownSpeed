import { tileSprites } from "../../clientJS/sprites.js";
import { DIRS } from "../utils/dirsMap.js";
import { TILES, TILE_NAMES } from "../utils/enums.js";
import Vec2 from "../vec2.js";
import Tile from "./tile.js";

export default class Layer {
    /**
     * @param {Vec2} dimentions
     * @param {Tile} [baseTile]
     * @param {Array<Array<Tile>>} [tiles]
     */
    constructor(dimentions, baseTile, tiles) {
        /** @type {Array<Array<Tile>>} */
        this.tiles;
        if (!baseTile) {
            this.empty = true;
            this.baseTile = TILES[TILE_NAMES[" "]].clone();
        } else {
            this.empty = false;
            this.baseTile = baseTile;
        }
        
        if (tiles) {
            this.tiles = tiles;
        } else {
            this.tiles = new Array(dimentions.y);
            for (let j = 0; j < dimentions.y; j++) {
                this.tiles[j] = new Array(dimentions.x);
                for (let i = 0; i < dimentions.x; i++) {
                    //default base layer to grass
                    this.tiles[j][i] = this.baseTile.clone().init(new Vec2(i, j), 0);
                }
            }
        }
        this.dimentions = dimentions;
    }
    makeObject() {
        const baseTile = this.baseTile;
        const tiles = new Array();
        const empty = this.empty;
        for (const row of this.tiles) {
            const newRow = new Array();
            for (const tile of row) {
                newRow.push({ "name": tile.name, "walkable": tile.walkable, "passable": tile.passable });
            }
            tiles.push(newRow);
        }
        return { baseTile, tiles, empty };
    }
    static makeFromJSON(json, dimentions) {
        const {
            baseTile, tiles
        } = json;

        let tile = null;
        if (baseTile) tile = new Tile(new Vec2(), baseTile.name, baseTile.walkable, baseTile.passable, 0);
        let empty = true;
        const newTiles = new Array();
        for (let j = 0; j < tiles.length; j++) {
            const newRow = new Array();
            for (let i = 0; i < tiles[0].length; i++) {
                newRow.push(new Tile(new Vec2(i, j),
                    tiles[j][i].name, tiles[j][i].walkable, tiles[j][i].passable, 0));
                if (tiles[j][i].name !== TILE_NAMES[" "]) {
                    empty = false;
                }
            }
            newTiles.push(newRow);
        }
        const newLayer = new Layer(dimentions, tile, newTiles);
        newLayer.empty = empty;
        return newLayer;
    }
    /**
     * @param {boolean} [vertical]
     */
    mirror(vertical = true) {
        let layer = new Layer(this.dimentions.clone(), this.baseTile);
        if (vertical) {
            //mirror vertically
            for (let j = 0; j < layer.dimentions.y; j++) {
                for (let i = 0; i < layer.dimentions.x; i++) {
                    layer.tiles[j][i] = this.tiles[j][this.dimentions.x - (i + 1)].clone().init(new Vec2(i, j), 0);
                }
            }
        } else {
            //mirror horizontally
            for (let j = 0; j < layer.dimentions.y; j++) {
                for (let i = 0; i < layer.dimentions.x; i++) {
                    layer.tiles[j][i] = this.tiles[this.dimentions.y - (j + 1)][i].clone().init(new Vec2(i, j), 0);
                }
            }
        }
        layer.empty = this.empty;
        return layer;
    }
    /**
     * @param {Vec2} tileSize
     */
    generateStatic(tileSize, topLeft) {
        if(this.empty) return [];
        const statics = new Array();
        for (const row of this.tiles) {
            for (const tile of row) {
                if ((this.baseTile.name !== tile.name) && (!tile.walkable || !tile.passable)) {
                    statics.push(tile.makeBox(tileSize, topLeft));
                }
            }
        }
        return statics;
    }
    /**
     * @param {Vec2} regionStart
     * @param {Vec2} regionEnd
     * @param {Tile} tile
     * @param {Vec2} topLeft
     */
    update(regionStart, regionEnd, tile, topLeft) {
        console.assert(regionStart instanceof Vec2, "regionStart Not Vec2", regionStart);
        console.assert(regionEnd instanceof Vec2, "regionEnd Not Vec2", regionEnd);
        let [startX, startY] = regionStart.sub(topLeft).getXY();
        let [endX, endY] = regionEnd.sub(topLeft).getXY();
        //if start is after end swap
        if (startX > endX)
            [startX, endX] = [endX, startX];
        if (startY > endY)
            [startY, endY] = [endY, startY];

        for (let j = startY; j <= endY; j++) {
            for (let i = startX; i <= endX; i++) {
                this.tiles[j][i] = tile.clone().init(new Vec2(i, j), 0);
            }
        }
        this.empty = false;
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
            //if out of bounds skip the check
            if (newI < 0 || newJ < 0 || newI >= this.dimentions.x || newJ >= this.dimentions.y) {
                //around = around | dir.dir;
                continue;
            }
            if (curr.includes(this.tiles[newJ][newI].name)) {
                around = around | dir.dir;
            }
        }
        return around;
    }

    //this should probably get moved to a client class
    /**
     * @param {import("../../clientJS/canvasWrapper.js").default} canvas
     * @param {Vec2} topLeft
     */
    draw(canvas, topLeft) {
        if (this.empty) return;
        const height = this.dimentions.y, width = this.dimentions.x;
        for (let j = 0; j < height; j++) {
            for (let i = 0; i < width; i++) {
                //grab tile name
                const tileName = this.tiles[j][i].name;
                //skip if tile name in none
                if (!tileSprites.has(tileName)) continue;
                //get the sprite
                const sprite = tileSprites.get(tileName);
                //get the around value
                const around = this.getAround(i, j, sprite.connects);
                const tile = TILES[tileName].clone().init(new Vec2(i, j), around);
                //sprite.draw(canvas, tile.location, tile.around);
                tileSprites.get(tile.name).draw(canvas, tile.location.add(topLeft), tile.around);
            }
        }
    }
}