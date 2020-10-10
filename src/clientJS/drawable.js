import CanvasWrapper from "./canvasWrapper.js";
import Vec2 from "../sharedJS/vec2.js";
import { CATEGORY, TYPES } from "../sharedJS/utils/enums.js";

class Drawable {
    /**
     * @param {import("../sharedJS/entity.js").default | import("../sharedJS/player.js").default | import("../sharedJS/ability/projectile.js").default} owner
     * @param {number} scale
     */
    constructor(owner, scale) {
        this.owner = owner;
        /** @type {HTMLImageElement} */
        this.image = document.querySelector(`img#${this.owner.imgSrc}`);
        this.scale = scale;
    }
    //function to pass an update to the owner
    /**
     * @param {import("../sharedJS/utils/time.js").default} time
     * @param {number} dt
     */
    update(time, dt) {
        this.owner.update(time, dt, null);
    }
    /**
     * @param {CanvasWrapper} canvas
     */
    draw(canvas) {
        if (this.owner.category === CATEGORY.player) {
            // @ts-ignore
            canvas.drawImageLookat(this.image, this.owner.location, this.owner.lookDirection, this.scale, null, null, null, null, this.owner.objectives);
        } else {
            canvas.drawImageLookat(this.image, this.owner.location, this.owner.lookDirection, this.scale);
        }
        //if object has health draw health bar, might change this to be just player or monsters later
        if(this.owner.maxHealth) {
            this.drawHealthBar(canvas);
        }
    }
    /**
     * Draws the health Bar on the canvas
     * @param {CanvasWrapper} canvas 
     */
    drawHealthBar(canvas) {
        const healthBarOffset = new Vec2(0, -(this.owner.hitbox.halfWidth + 5));
        const healthBarDimentions = new Vec2(32, 8);
        const origin = this.owner.location.add(healthBarOffset);

        canvas.drawHealthBar(origin, healthBarDimentions, this.owner.currHealth, this.owner.maxHealth);
    }
}
export default Drawable;