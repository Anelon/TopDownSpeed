import { Rectangle } from "../shapes.js";

export default class Region {
    /**
     * @param {string} name
     * @param {Rectangle} area
     */
    constructor(name, area) {
        this.name = name;
        this.area = area;
    }

    //call when player overlaps
    hit(other) {
        console.log(other, "entered", this.name);
    }
}