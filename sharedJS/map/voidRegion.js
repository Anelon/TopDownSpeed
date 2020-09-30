import Vec2 from "../vec2.js";
import Region from "./region.js";
/** @typedef {import("../player.js").default} Player */

export default class VoidRegion extends Region {
    /**
     * @param {string} name
     * @param {Vec2} center
     * @param {Vec2} dimentions
     * @param {string} [color]
     */
    constructor(center, dimentions, name, color = "black") {
        super(center, dimentions, name, color);
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
        //move player back out of the void
        player.location = player.oldLocation;
        return false;
    }
}