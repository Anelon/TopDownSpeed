import Vec2 from "../sharedJS/vec2.js";
import Dragon from "../sharedJS/dragon.js";
import { dragonAnimationWidths, dragonImages } from "./sprites.js";
import { animations } from "../sharedJS/dragonData.js";
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

        for (const imgStr of Object.values(animations)) {
            /** @type {HTMLImageElement} */
            const imgElem = document.querySelector(`img#${imgStr}`);
            if (imgElem) {
                dragonImages.set(imgStr, imgElem);
                dragonAnimationWidths.set(imgStr, imgElem.width / Dragon.SIZE.x);
            }
        }
    }
    /**
     * @param {CanvasWrapper} canvas
     */
    draw(canvas) {
        const phase = this.owner.phase;
        let index = this.owner.frame;
        if(!dragonImages.get(phase)) console.error(phase);

        const sx = Math.floor(index % dragonAnimationWidths.get(phase)) * this.size.x;
        const sy = Math.floor(index / dragonAnimationWidths.get(phase)) * this.size.y;
        canvas.drawImageLookat(dragonImages.get(phase), this.owner.location, this.owner.lookDirection.multiplyScalar(-1), this.scale, sx, sy, this.size.x, this.size.y);

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