import Box from "../box.js";
import { Rectangle } from "../shapes.js";
import { CATEGORY, REGIONS, TYPES } from "../utils/enums.js"
import Vec2 from "../vec2.js";
/** @typedef {import("../player.js").default} Player */

export default class Region extends Rectangle {
    /**
     * @param {string} name
     * @param {Vec2} center
     * @param {Vec2} dimentions
     * @param {string} [color]
     */
    constructor(center, dimentions, name, color = "gray") {
        super(center, dimentions.x, dimentions.y);
        this.name = name;
        this.color = color;
        this.overlapping = false;
        this.category = CATEGORY.region;
        this.overlaps = new Map();
        this.lastOverlaps = new Map();
    }
    static makeFromJSON(json) {
        const {
            center, dimentions, name, color
        } = json;
        return new REGIONS[name](new Vec2(center.x, center.y), new Vec2(dimentions.x, dimentions.y), name, color);
    }

    //call when player overlaps
    hit(other) {
        //don't overlap any other regions
        if(other.category === this.category) return;
        //if player add to overlapping the region
        if(other.category === CATEGORY.player) this.overlaps.set(other.id, other);
    }
    draw(canvas) {
        super.draw(canvas, this.color);
    }
    makeHitBox() {
        return new Box(this.center.clone(), this.dimentions.clone(), this, this.color);
    }
    makeShape() {
        return super.clone();
    }
    resetOverlaps() {
        this.lastOverlaps.clear();
        for(const [key, val] of this.overlaps) {
            this.lastOverlaps.set(key,val);
        }
        this.overlaps.clear();
    }
    /**
     * placeholder for regions that need to do something when first player begins overlap will probably just be used for the PVE dungeon to start AI
     * @param {Player} player
     */
    firstOverlap(player) {
    }
    /**
     * placeholder for regions that need to do something when first player begins overlap will probably just be used for the PVE dungeon to start AI
     * @param {Player} player
     */
    beginOverlap(player) {
    }
    /**
     * @param {Player} player
     */
    addOverlaps(player) {
        this.overlaps.set(player.id, player);
        if(this.lastOverlaps.size === 0) this.firstOverlap(player);
        if(!this.lastOverlaps.has(player.id)) {
            this.beginOverlap(player);
            return true;
        }
        return false;
    }
}