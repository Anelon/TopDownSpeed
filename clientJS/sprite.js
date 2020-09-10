import Drawable from "./drawable.js";
/** @typedef {import("./canvasWrapper.js").default} CanvasWrapper */

export default class Sprite extends Drawable {
    /**
     * @param {import("../sharedJS/entity.js").default | import("../sharedJS/player.js").default | import("../sharedJS/projectile.js").default} owner
     * @param {number} numFrames
     * @param {number} animationSpeed
     * @param {number} scale
     */
    constructor(owner, numFrames, animationSpeed, scale) {
        super(owner, scale);
        this.spriteIndex = 0;
        this.numFrames = numFrames
        this.animationSpeed = animationSpeed
    }
    /**
     * @param {CanvasWrapper} canvas
     */
    draw(canvas) {
        canvas.drawImageLookat(this.image, this.owner.location, this.owner.lookDirection, this.owner.overlapping, this.scale);
        //if object has health draw health bar, might change this to be just player or monsters later
        if(this.owner.maxHealth) {
            this.drawHealthBar(canvas);
        }
    }

}