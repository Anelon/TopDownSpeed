import Drawable from "./drawable.js";
import Vec2 from "../sharedJS/vec2.js";
/** @typedef {import("./canvasWrapper.js").default} CanvasWrapper */

export default class Sprite extends Drawable {
    /**
     * @param {import("../sharedJS/entity.js").default | import("../sharedJS/player.js").default | import("../sharedJS/projectile.js").default} owner
     * @param {number} numFrames //number of frames in sprite sheet
     * @param {number} animationSpeed //how fast animation should play
     * @param {number} scale
     */
    constructor(owner, numFrames, animationSpeed, scale, spriteDims = new Vec2(64,64)) {
        super(owner, scale);
        this.frameCount = 0;
        this.numFrames = numFrames;
        this.animationSpeed = animationSpeed;
        this.spriteDims = spriteDims;
        this.tilesWide = this.image.width / spriteDims.x;
    }
    /**
     * @param {CanvasWrapper} canvas
     */
    draw(canvas) {
        let index = Math.floor(this.frameCount++ / this.animationSpeed);
        if(index >= this.numFrames) {
            this.frameCount = 0;
            index = 0;
        }
        const sx = Math.floor(index % this.tilesWide) * this.spriteDims.x;
        const sy = Math.floor(index / this.tilesWide) * this.spriteDims.x;
        //console.log(sx, sy);
        canvas.drawImageLookat(this.image, this.owner.location, this.owner.lookDirection, this.owner.overlapping, this.scale, sx, sy, this.spriteDims.x, this.spriteDims.y);
        //if object has health draw health bar, might change this to be just player or monsters later
        if(this.owner.maxHealth) {
            this.drawHealthBar(canvas);
        }
    }

}