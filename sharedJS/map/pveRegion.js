import Region from "./region.js";
/** @typedef {import("../player.js").default} Player */

export default class PVERegion extends Region {
    /**
     * @param {import("../vec2").default} center
     * @param {import("../vec2").default} dimentions
     * @param {string} name
     */
    constructor(center, dimentions, name) {
        super(center, dimentions, name);
        this.bossMonster = null;
    }
    endOverlap() {
        console.log("No longer have anyone overlapping");
        //pause the dragon
    }
    firstOverlap(player) {
        //start the dragon
    }
    /**
     * placeholder for regions that need to do something when first player begins overlap will probably just be used for the PVE dungeon to start AI
     * @param {Player} player
     */
    beginOverlap(player) {
        if(this.bossMonster) {
            this.bossMonster.active = true;
        }
    }
}