import CanvasWrapper from "./canvasWrapper.js";
import Vec2 from "../sharedJS/vec2.js";

class Drawable {
    /**
     * @param {import("../sharedJS/entity.js").default | import("../sharedJS/player.js").default | import("../sharedJS/projectile.js").default} owner
     */
    constructor(owner) {
        this.owner = owner;
        this.image = new Image();
        this.image.src = owner.imgSrc;
        console.log(this.image);
    }
    //function to pass an update to the owner
    update(dt, map) {
        this.owner.update(dt, map);
    }
    /**
     * @param {CanvasWrapper} canvas
     */
    draw(canvas) {
        canvas.drawImageLookat(this.image, this.owner.location, this.owner.lookDirection, this.owner.overlapping);
        //if object has health draw health bar, might change this to be just player or monsters later
        if(this.owner.maxHealth) {
            this.drawHealthBar(canvas);
        }
    }
    /**
     * Draws the health Bar on the canvas (warning only call in clientside code)
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