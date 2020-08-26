
class Drawable {
    constructor(owner) {
        this.owner = owner;
        this.image = new Image();
        this.image.src = owner.imgSrc;
    }
    //function to pass an update to the owner
    update(dt, map) {
        this.owner.update(dt, map);
    }
    draw(canvas) {
        canvas.drawImageLookat(this.image, this.owner.location, this.owner.lookDirection, this.owner.overlapping);
    }
}
export default Drawable;