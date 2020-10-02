import { DIRBITS, DIRS } from "../sharedJS/utils/dirsMap.js";
import CanvasWrapper from "./canvasWrapper.js";
import Vec2 from "../sharedJS/vec2.js";

export default class DecorationSprite {
    static width = 16;
    static height = 16;
    static imagesToLoad = 0;
    /**
     * @param {string} imgSrc
     * @param {string} char
     */
    constructor(imgSrc, char) {
        //add one to imagesLoading
        DecorationSprite.imagesToLoad++;
        this.imgSrc = imgSrc;
        this.image = new Image();
        this.image.addEventListener('load', () => {
            this.tilesWide = this.image.width / DecorationSprite.width;
            DecorationSprite.imagesToLoad--;
            if (DecorationSprite.imagesToLoad === 0) {
                //drawMap();
            }
        });
        this.image.src = imgSrc;
        this.char = char;
        this.scale = 2;
    }
    /**
     * @param {CanvasWrapper} canvas 
     * @param {Vec2} location Tile x and y location
     */
    draw(canvas, location) {
        const x = location.x * DecorationSprite.width * this.scale;
        const y = location.y * DecorationSprite.height * this.scale;
        canvas.drawImage(this.image, x, y, this.scale);
    }
}
