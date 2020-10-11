import Region from "./region.js";
/** @typedef {import("../player.js").default} Player */
/** @typedef {import("./tile.js").default} Tile */

export default class VictoryMonument extends Region {
    /**
     * @param {import("../vec2").default} center
     * @param {import("../vec2").default} dimentions
     * @param {string} name
     */
    constructor(center, dimentions, name) {
        super(center, dimentions, name, "white");
        this.objectives = new Set();
        /** @type {Map<string, Tile>} */
        this.decorations = new Map();
    }
    getInfo() {
        const objectives = new Array();
        for(const objective of this.objectives.values()) objectives.push(objective);
        return { objectives, laneName: this.laneName };
    }
    /**
     * @param {Array<Tile>} newDecorations
     */
    setDecoration(newDecorations) {
        for(const decoration of newDecorations) {
            this.decorations.set(decoration.name, decoration)
        }
    }
    activateDecoration(objective) {
        console.info(objective, " added to VM");
        this.objectives.add(objective);
        const decorationStr = `${objective}Pillar`;
        if(this.decorations.has(decorationStr)) {
            this.decorations.get(decorationStr).name = decorationStr + "Active";
        }
    }
    /**
     * placeholder for regions that need to do something when first player begins overlap will probably just be used for the PVE dungeon to start AI
     * @param {Player} player
     */
    beginOverlap(player) {
        if(player.objectives.size) {
            for(const objective of player.objectives) {
                this.activateDecoration(objective);
            }
            if(this.objectives.size === 3) {
                console.info("A winner is you");
            }
            player.objectives.clear();
        }
    }
}