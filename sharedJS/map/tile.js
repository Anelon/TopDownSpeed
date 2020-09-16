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
}