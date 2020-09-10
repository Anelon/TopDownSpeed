import CanvasWrapper from "./canvasWrapper.js";
import Vec2 from "../sharedJS/vec2.js";

class Drawable {
    /**
     * @param {import("../sharedJS/entity.js").default | import("../sharedJS/player.js").default | import("../sharedJS/projectile.js").default} owner
     * @param {number} scale
     */
    constructor(owner, scale) {
        this.owner = owner;
        this.image = new Image();
        this.image.src = owner.imgSrc;
        this.scale = scale;
        console.log(this.image);
    }
    //function to pass an update to the owner
    /**
     * @param {import("./time.js").default} time
     * @param {number} dt
     */
    update(time, dt) {
        this.owner.update(time, dt);
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