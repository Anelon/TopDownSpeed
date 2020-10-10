import { DIRBITS, DIRS } from "../sharedJS/utils/dirsMap.js";
import CanvasWrapper from "./canvasWrapper.js";
import Vec2 from "../sharedJS/vec2.js";

export default class TileSprite {
    static width = 16;
    static height = 16;
    static imagesToLoad = 0;
    /**
     * @param {string} imgSrc
     * @param {string} char
     * @param {Array<string>} [connects] What this tile connects to defaults to just char
     */
    constructor(imgSrc, char, connects = [char]) {
        //prevent from running on server
        if(typeof window === "undefined") return null;
        //add one to imagesLoading
        TileSprite.imagesToLoad++;
        this.imgSrc = imgSrc;
        /** @type {HTMLImageElement} */
        this.image = document.querySelector(`img#${imgSrc}`);
        this.tilesWide = this.image.width / TileSprite.width;
        this.char = char;
        this.connects = connects;
        this.scale = 2;
    }
    /**
     * @param {number} around bitmap with the tiles that are around this
     */
    static aroundToString(around) {
        let retStr = "";
        if (around & DIRBITS.right) retStr += "right | ";
        if (around & DIRBITS.left) retStr += "left | ";
        if (around & DIRBITS.up) retStr += "up | ";
        if (around & DIRBITS.down) retStr += "down | ";
        if (around & DIRBITS.downAndRight) retStr += "downAndRight | ";
        if (around & DIRBITS.downAndLeft) retStr += "downAndLeft | ";
        if (around & DIRBITS.upAndRight) retStr += "upAndRight | ";
        if (around & DIRBITS.upAndLeft) retStr += "upAndLeft | ";
        if (retStr.length > 0) retStr.slice(0, -2);
        return retStr;
    }
    /**
     * @param {number} around 
     * @returns {number}
     */
    static aroundToIndex(around) {
        //need unsigned bitwise not of around
        let nAround = (~around >>> 0);
        if (around === DIRBITS.allRound) return 0;
        if (around === (DIRBITS.allRound ^ DIRBITS.downAndRight)) return 1;
        if (around === (DIRBITS.allRound ^ DIRBITS.downAndLeft)) return 2;
        if (around === (DIRBITS.allRound ^ DIRBITS.upAndRight)) return 3;
        if (around === (DIRBITS.allRound ^ DIRBITS.upAndLeft)) return 4;
        if (around === (DIRBITS.allRound ^ (DIRBITS.downAndLeft | DIRBITS.downAndRight))) return 5;
        if (around === (DIRBITS.allRound ^ (DIRBITS.upAndLeft | DIRBITS.downAndRight))) return 6;
        if (around === (DIRBITS.allRound ^ (DIRBITS.upAndRight | DIRBITS.downAndRight))) return 7;
        if (around === (DIRBITS.allRound ^ (DIRBITS.downAndLeft | DIRBITS.upAndLeft))) return 8;
        if (around === (DIRBITS.allRound ^ (DIRBITS.downAndLeft | DIRBITS.upAndRight))) return 9;
        if (around === (DIRBITS.allRound ^ (DIRBITS.upAndLeft | DIRBITS.upAndRight))) return 10;
        if (around === (DIRBITS.allRound ^ (DIRBITS.downAndLeft | DIRBITS.upAndRight | DIRBITS.downAndRight))) return 11;
        if (around === (DIRBITS.allRound ^ (DIRBITS.downAndLeft | DIRBITS.upAndLeft | DIRBITS.downAndRight))) return 12;
        if (around === (DIRBITS.allRound ^ (DIRBITS.downAndLeft | DIRBITS.upAndLeft | DIRBITS.upAndRight))) return 13;
        if (around === (DIRBITS.allRound ^ (DIRBITS.downAndRight | DIRBITS.upAndLeft | DIRBITS.upAndRight))) return 14;
        if (around === (DIRBITS.allRound ^ (DIRBITS.downAndLeft | DIRBITS.downAndRight | DIRBITS.upAndLeft | DIRBITS.upAndRight))) return 15;
        //edges
        if (nAround & DIRBITS.up) {
            if (nAround & DIRBITS.down) {
                if (nAround & DIRBITS.left) {
                    if (nAround & DIRBITS.right) return 46;
                    return 44;
                }
                if (nAround & DIRBITS.right) return 42;
                return 33;
            }
            if (nAround & DIRBITS.right) {
                if (nAround & DIRBITS.left) return 45;
                if (nAround & DIRBITS.downAndLeft) return 41;
                return 37;
            }
            if (nAround & DIRBITS.left) {
                if (nAround & DIRBITS.downAndRight) return 40;
                return 36;
            }
            if (nAround & DIRBITS.downAndRight && nAround & DIRBITS.downAndLeft) return 31;
            if (nAround & DIRBITS.downAndRight) return 30;
            if (nAround & DIRBITS.downAndLeft) return 29;
            return 19;
        }
        if (nAround & DIRBITS.down) {
            if (nAround & DIRBITS.right) {
                if (nAround & DIRBITS.left) return 43;
                if (nAround & DIRBITS.upAndLeft) return 38;
                return 34;
            }
            if (nAround & DIRBITS.left) {
                if (nAround & DIRBITS.upAndRight) return 39;
                return 35;
            }
            if (nAround & DIRBITS.upAndRight && nAround & DIRBITS.upAndLeft) return 25;
            if (nAround & DIRBITS.upAndRight) return 24;
            if (nAround & DIRBITS.upAndLeft) return 23;
            return 17;
        }
        if (nAround & DIRBITS.left) {
            if (nAround & DIRBITS.right) return 32;
            if (nAround & DIRBITS.upAndRight && nAround & DIRBITS.downAndRight) return 28;
            if (nAround & DIRBITS.downAndRight) return 26;
            if (nAround & DIRBITS.upAndRight) return 27;
            return 18;
        }
        if (nAround & DIRBITS.right) {
            if (nAround & DIRBITS.downAndLeft && nAround & DIRBITS.upAndLeft) return 22;
            if (nAround & DIRBITS.downAndLeft) return 20;
            if (nAround & DIRBITS.upAndLeft) return 21;
            return 16;
        }
        //default case if something doesn't get found (should never get here)
        return -1;
    }
    /**
     * @param {CanvasWrapper} canvas 
     * @param {Vec2} location Tile x and y location
     * @param {number} around Bitmap of similar tiles that are around this
     */
    draw(canvas, location, around = null) {
        const x = location.x * TileSprite.width * this.scale;
        const y = location.y * TileSprite.height * this.scale;
        if (around !== null) {
            let sx = 0, sy = 0;
            //if it doesn't contain around I probably did something wrong but default to the first tile in the map
            let index = TileSprite.aroundToIndex(around);
            if (index !== -1) {
                sx = Math.floor(index % this.tilesWide) * TileSprite.width;
                sy = Math.floor(index / this.tilesWide) * TileSprite.height;
            } else {
                console.error(location.log(), "tile not found ", around.toString(2));
                let aroundStr = TileSprite.aroundToString(around);
                console.error(aroundStr);
            }
            canvas.drawImage(this.image, x, y, 2, sx, sy, TileSprite.width, TileSprite.height);
            //ctx.drawImage(this.image, x, y);
        } else {
            canvas.drawImage(this.image, x, y, this.scale);
        }
    }
}
