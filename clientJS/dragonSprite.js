import Vec2 from "../sharedJS/vec2.js";
import { animationLengths, animations } from "../sharedJS/dragonData.js";
import Dragon from "../sharedJS/dragon.js";
import { endedImageLoad, startedImageLoad } from "./clientUtils.js";
/** @typedef {import("./canvasWrapper.js").default} CanvasWrapper */

export default class DragonSprite {
    /**
     * @param {Dragon} owner
     * @param {number} animationSpeed //how fast animation should play
     * @param {number} scale
     */
    constructor(owner, animationSpeed, scale) {
        this.owner = owner;
        this.scale = scale;
        this.size = Dragon.SIZE;
        this.frameCount = 0;
        this.animationSpeed = animationSpeed;
        this.animationImgs = new Map();
        this.animationTileWidth = new Map();
        for(const imgStr of Object.values(animations)) {
            startedImageLoad();
            const image = new Image();
            image.src = Dragon.spritePath + imgStr + "-test.png";
            image.addEventListener('load', () => {
                endedImageLoad();
            });
            this.animationImgs.set(imgStr, image);
            this.animationTileWidth.set(imgStr, image.width / this.size.x);
        }
    }
    /**
     * @param {CanvasWrapper} canvas
     */
    draw(canvas) {
        const phase = this.owner.phase;
        let index = this.owner.frame;
        if(!this.animationImgs.get(phase)) console.log(phase);

        const sx = Math.floor(index % this.animationTileWidth.get(phase)) * this.size.x;
        const sy = Math.floor(index / this.animationTileWidth.get(phase)) * this.size.y;
        canvas.drawImageLookat(this.animationImgs.get(phase), this.owner.location, this.owner.lookDirection.multiplyScalar(-1), this.scale, sx, sy, this.size.x, this.size.y);

        //if the dragon has health draw healthbar
        if(this.owner.currHealth > 0) this.drawHealthBar(canvas);
    }

    /**
     * Draws the health Bar on the canvas
     * @param {CanvasWrapper} canvas 
     */
    drawHealthBar(canvas) {
        const healthBarOffset = new Vec2(0, -(this.owner.hitbox.height / 2 - 20));
        const healthBarDimentions = new Vec2(200, 8);
        const origin = this.owner.location.add(healthBarOffset);

        canvas.drawHealthBar(origin, healthBarDimentions, this.owner.currHealth, this.owner.maxHealth);
    }

}