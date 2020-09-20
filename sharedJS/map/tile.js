import { tileSprites } from "../../clientJS/sprites.js";
import Box from "../box.js";
import { Rectangle } from "../shapes.js";
import { CATEGORY, TYPES } from "../utils/enums.js";
import Vec2 from "../vec2.js";

export default class Tile {
    /**
     * @param {Vec2} location
     * @param {string} name name of the tilesprite to draw
     * @param {boolean} walkable
     * @param {boolean} passable
     * @param {number} around
     */
    constructor(location, name, walkable, passable, around) {
        this.location = location;
        this.name = name;
        this.walkable = walkable;
        this.passable = passable;
        this.around = around;
        this.overlapping = false;
        this.tileSize = new Vec2();
        this.category = CATEGORY.tile;
        this.type = TYPES.basic;
    }
    /**
     * @param {Vec2} location
     * @param {number} around
     */
    init(location, around) {
        this.location = location;
        this.around = around;
        return this;
    }
    clone() {
        return new Tile(new Vec2(this.location.x, this.location.y), this.name, this.walkable, this.passable, this.around);
    }
    /**
     * @param {Vec2} tileSize
     */
    makeBox(tileSize) {
        this.tileSize = tileSize;
        const center = this.location.multiplyVec(tileSize).subS(tileSize.multiplyScalar(0.5));
        return new Box(center, tileSize, this);
    }
    makeShape() {
        const center = this.location.multiplyVec(this.tileSize).subS(this.tileSize.multiplyScalar(0.5));
        return new Rectangle(center, this.tileSize.x, this.tileSize.y);
    }
    /**
     * @param {import("../entity.js").default} other
     */
    hit(other) {
        if(other.category === CATEGORY.player) {
            if(!this.walkable) {
                //move player back to previous location
            }
        }

    }
}