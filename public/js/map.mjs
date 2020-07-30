//this will probably change a lot when we make an actual map
import Vec2 from "./vec2.mjs";
import QuadTree from "./quadTree.mjs";
import { Rectangle } from "./shapes.mjs";

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

        //holder for players and monsters
        this.players = [];
        //holder for projectiles
        this.projectiles = [];

        this.boundry = new Rectangle(new Vec2(this.width/2, this.height/2), this.width, this.height);
        this.qTreeCapacity = 10;
        this.collisionTree = new QuadTree(this.boundry, this.qTreeCapacity);
    }
    clear() {
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    }
    //draws an image with a vec2 origin, vec2 look direction, bool if you want to have an outline around the image
    drawImageLookat(img, origin, look, withOutline = false) {
        //save context 
        this.ctx.save();

        this.ctx.setTransform(1, 0, 0, 1, origin.x, origin.y);
        this.ctx.rotate(Math.atan2(look.y, look.x)); // Adjust image 90 degree anti clockwise (PI/2) because the image  is pointing in the wrong direction.
        if (withOutline) {
            let dArr = [-1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1], // offset array
                s = 2,  // thickness scale
                i = 0,  // iterator
                bx = -img.width / 2,  // image position
                by = -img.height / 2;

            // draw images at offsets from the array scaled by s
            for (; i < dArr.length; i += 2)
                this.ctx.drawImage(img, bx + dArr[i] * s, by + dArr[i + 1] * s);

            // fill with color
            //this.ctx.globalCompositeOperation = "source-in";
            this.ctx.globalCompositeOperation = "source-atop";
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(-img.width / 2 - s, -img.height / 2 - s, img.width + 2 * s, img.height + 2 * s);

            // draw original image in normal mode
            this.ctx.globalCompositeOperation = "source-over";
        }
        this.ctx.drawImage(img, -img.width / 2, -img.height / 2);

        //restore back to previous settings
        this.ctx.restore();
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

    update(now, dt) {
        //reset quadTree, might change to updating locations of each item later if we end up with too many static items
        this.collisionTree = new QuadTree(this.boundry, this.qTreeCapacity);

        //move everything and place in collision quad tree
        for (let player of this.players) {
            player.update(now, dt);
            this.collisionTree.push(player.makePoint());
            player.overlapping = false;
        }
        for (let projectile of this.projectiles) {
            projectile.update(dt);
            this.collisionTree.push(projectile.makePoint());
            projectile.overlapping = false;
        }
        //check for collisions
        for (let player of this.players) {
            let playerShape = player.makeShape();
            //make shape with 2 to have it search an area double the size of the player
            let others = this.collisionTree.query(player.makeShape(2));
            for(let other of others) {
                if(other.owner === player) continue;
                if(playerShape.intersects(other.owner.makeShape(1))) {
                    player.overlapping = true;
                    other.owner.overlapping = true;
                }
            }
        }
        for (let projectile of this.projectiles) {
            let projectileShape = projectile.makeShape();
            //make shape with 2 to have it search an area double the size of the projectile
            let others = this.collisionTree.query(projectile.makeShape(2));
            for(let other of others) {
                if(other.owner === projectile) continue;
                if(projectileShape.intersects(other.owner.makeShape(1))) {
                    projectile.overlapping = true;
                    other.owner.overlapping = true;
                }
            }
        }
    }
}

export default Map;