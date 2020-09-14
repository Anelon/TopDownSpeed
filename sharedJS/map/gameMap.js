import Lane from "./lane.js";

export default class GameMap {
    /**
     * @param {Lane} lane
     * @param {number} voidWidth
     */
    constructor(lane, voidWidth) {
        this.leftLane = lane;
        this.rightLane = lane.mirror();
        this.voidWidth = voidWidth;

        this.editMode = false;
    }
}