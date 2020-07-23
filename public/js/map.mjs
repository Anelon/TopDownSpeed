//this will probably change a lot when we make an actual map
import Vec2 from "./vec2.mjs";

class Map {
    constructor() {
        //canvas set up
        this.canvas = document.getElementById('game');
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.borderSize = 40;
        this.canvas.width = this.width - this.borderSize;
        this.canvas.height = this.height - this.borderSize;
        this.ctx.font = "18px arial";
        this.ctx.lineWidth = 1;

        //holders for monsters and projectiles
        this.monsters = [];
        this.projectiles = [];
    }
    clear() {
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    }
    //draws an image with a vec2 origin, vec2 look direction, bool if you want to have an outline around the image
    drawImageLookat(img, origin, look, withOutline = false) {
        this.ctx.setTransform(1, 0, 0, 1, origin.x, origin.y);
        this.ctx.rotate(Math.atan2(look.y, look.x)); // Adjust image 90 degree anti clockwise (PI/2) because the image  is pointing in the wrong direction.
        if (withOutline) {
            let dArr = [-1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1], // offset array
                s = 2,  // thickness scale
                i = 0,  // iterator
                bx = -img.width / 2,  // final position
                by = -img.height / 2;

            // draw images at offsets from the array scaled by s
            for (; i < dArr.length; i += 2)
                this.ctx.drawImage(img, bx + dArr[i] * s, by + dArr[i + 1] * s);

            // fill with color
            this.ctx.globalCompositeOperation = "source-in";
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(-img.width / 2 - s, -img.height / 2 - s, img.width + 2 * s, img.height + 2 * s);

            // draw original image in normal mode
            this.ctx.globalCompositeOperation = "source-over";
        }
        this.ctx.drawImage(img, -img.width / 2, -img.height / 2);
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // restore default not needed if you use setTransform for other rendering operations
    }
    //draws the player's crosshair with vec2 origin and string color
    drawCrossHair(origin, color) {
        const x = origin.x, y = origin.y;
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x - 10, y);
        this.ctx.lineTo(x + 10, y);
        this.ctx.moveTo(x, y - 10);
        this.ctx.lineTo(x, y + 10);
        this.ctx.stroke();
    }
}

export default Map;