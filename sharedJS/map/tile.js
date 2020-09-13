export default class Tile {
    /**
     * @param {string} tileName
     * @param {boolean} walkable
     * @param {boolean} passable
     */
    constructor(tileName, walkable, passable) {
        this.tileName = tileName;
        this.walkable = walkable;
        this.passable = passable;
    }
}