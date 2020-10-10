import Region from "./region.js";
/** @typedef {import("../player.js").default} Player */

export default class VictoryMonument extends Region {
    /**
     * @param {import("../vec2").default} center
     * @param {import("../vec2").default} dimentions
     * @param {string} name
     */
    constructor(center, dimentions, name) {
        super(center, dimentions, name, "white");
        this.objectives = new Set();
    }
    /**
     * placeholder for regions that need to do something when first player begins overlap will probably just be used for the PVE dungeon to start AI
     * @param {Player} player
     */
    beginOverlap(player) {
        if(player.objectives.size) {
            for(const objective of player.objectives) {
                console.info(objective, " added to VM");
                this.objectives.add(objective);
            }
            if(this.objectives.size === 3) {
                console.info("A winner is you");
            }
            player.objectives.clear();
        }
    }
}