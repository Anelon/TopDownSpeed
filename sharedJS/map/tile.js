import Vec2 from "../vec2.js";

export default class Tile {
    /**
     * @param {Vec2} location
     * @param {string} tileName
     * @param {boolean} walkable
     * @param {boolean} passable
     */
    constructor(location, tileName, walkable, passable) {
        this.location = location;
        this.tileName = tileName;
        this.walkable = walkable;
        this.passable = passable;
    }
    clone() {
        return new Tile(new Vec2(this.location.x, this.location.y), this.tileName, this.walkable, this.passable);
    }
}